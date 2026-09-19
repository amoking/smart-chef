import prisma from "@/lib/prisma";

export interface RaffleResult {
  success: boolean;
  message: string;
  targetMonth: number;
  targetYear: number;
  totalRemoteHours: number;
  poolHours: number; // 5% of totalRemoteHours
  awardedHours: number;
  winner?: {
    id: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
  };
  ledgerEntryId?: string;
  awardedBookingId?: string;
}

/**
 * Calculates 5% of all previous calendar month's remote consultation hours
 * and randomly selects one registered, non-subscribed user for a free 1-hour session.
 *
 * @param options.force - If true, recalculates even if a ledger entry already exists for the month
 * @param options.overrideMonth - Optional target month (1-12) for testing/manual runs
 * @param options.overrideYear - Optional target year for testing/manual runs
 */
export async function executeMonthlyRaffleCron(options?: {
  force?: boolean;
  overrideMonth?: number;
  overrideYear?: number;
}): Promise<RaffleResult> {
  const now = new Date();

  // Determine previous calendar month and year (or use manual override)
  let targetMonth: number;
  let targetYear: number;

  if (options?.overrideMonth && options?.overrideYear) {
    targetMonth = options.overrideMonth;
    targetYear = options.overrideYear;
  } else {
    const currentMonth = now.getUTCMonth(); // 0-indexed (0 = Jan)
    const currentYear = now.getUTCFullYear();
    if (currentMonth === 0) {
      targetMonth = 12;
      targetYear = currentYear - 1;
    } else {
      targetMonth = currentMonth; // previous month in 1-based indexing
      targetYear = currentYear;
    }
  }

  // Month start: 1st day 00:00:00 UTC
  const monthStart = new Date(Date.UTC(targetYear, targetMonth - 1, 1, 0, 0, 0, 0));
  // Month end: last day 23:59:59.999 UTC
  const monthEnd = new Date(Date.UTC(targetYear, targetMonth, 0, 23, 59, 59, 999));

  console.log(`[Raffle Cron] Evaluating period: ${targetMonth}/${targetYear} (${monthStart.toISOString()} -> ${monthEnd.toISOString()})`);

  // Check idempotency: check if raffle has already run for this target month
  const existingLedger = await prisma.raffleLedger.findUnique({
    where: {
      month_year: {
        month: targetMonth,
        year: targetYear,
      },
    },
    include: {
      winner: true,
    },
  });

  if (existingLedger && !options?.force) {
    return {
      success: false,
      message: `Raffle for ${targetMonth}/${targetYear} has already been executed on ${existingLedger.createdAt.toISOString()}. Use force flag to override.`,
      targetMonth,
      targetYear,
      totalRemoteHours: existingLedger.totalRemoteHours,
      poolHours: existingLedger.poolHours,
      awardedHours: existingLedger.awardedHours,
      winner: existingLedger.winner
        ? {
            id: existingLedger.winner.id,
            displayName: existingLedger.winner.displayName,
            email: existingLedger.winner.email,
            phoneNumber: existingLedger.winner.phoneNumber,
          }
        : undefined,
      ledgerEntryId: existingLedger.id,
      awardedBookingId: existingLedger.awardedBookingId ?? undefined,
    };
  }

  // 1. Calculate previous month's remote consultation hours
  const remoteBookings = await prisma.booking.findMany({
    where: {
      type: "REMOTE",
      status: {
        in: ["COMPLETED", "CONFIRMED"],
      },
      scheduledAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  });

  const totalRemoteHours = remoteBookings.reduce(
    (sum, booking) => sum + (booking.durationHours || 0),
    0
  );

  // 2. Calculate 5% pool
  const poolHours = Number((totalRemoteHours * 0.05).toFixed(2));

  console.log(
    `[Raffle Cron] Found ${remoteBookings.length} remote bookings totalling ${totalRemoteHours} hours. 5% Pool: ${poolHours} hours.`
  );

  // 3. Find registered but non-subscribed users (is_subscribed = false)
  const eligibleUsers = await prisma.user.findMany({
    where: {
      is_subscribed: false,
    },
  });

  if (eligibleUsers.length === 0) {
    return {
      success: false,
      message: `No eligible non-subscribed users found in database for raffle draw.`,
      targetMonth,
      targetYear,
      totalRemoteHours,
      poolHours,
      awardedHours: 0,
    };
  }

  // 4. Randomly select one lucky registered non-subscribed user
  const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
  const luckyWinner = eligibleUsers[randomIndex];

  const awardedHours = 1.0; // Free 1-hour consultation session

  // 5. Atomic Transaction: Award free booking & record in RaffleLedger
  const result = await prisma.$transaction(async (tx) => {
    // Schedule a complimentary 1-hour session 7 days from today
    const sessionDate = new Date();
    sessionDate.setDate(sessionDate.getDate() + 7);
    sessionDate.setHours(15, 0, 0, 0); // 3:00 PM default slot

    const awardedBooking = await tx.booking.create({
      data: {
        userId: luckyWinner.id,
        type: "REMOTE",
        status: "CONFIRMED",
        title: "Complimentary 1-Hour Chef Session (Monthly Raffle Prize)",
        durationHours: awardedHours,
        scheduledAt: sessionDate,
        isRaffleReward: true,
        notes: `Awarded from ${targetMonth}/${targetYear} community raffle. Pool accumulated: 5% of ${totalRemoteHours} remote consultation hours.`,
      },
    });

    // Delete existing ledger if forcing recalculation
    if (existingLedger && options?.force) {
      await tx.raffleLedger.delete({
        where: { id: existingLedger.id },
      });
    }

    // Record in RaffleLedger
    const ledger = await tx.raffleLedger.create({
      data: {
        month: targetMonth,
        year: targetYear,
        totalRemoteHours,
        poolHours,
        awardedHours,
        winnerId: luckyWinner.id,
        status: "AWARDED",
        awardedBookingId: awardedBooking.id,
        notes: `Winner randomly selected among ${eligibleUsers.length} non-subscribed users. 5% pool from ${totalRemoteHours}h remote consultations.`,
      },
    });

    return {
      ledger,
      awardedBooking,
    };
  });

  console.log(
    `[Raffle Cron] Raffle successfully executed! Winner: ${luckyWinner.displayName || luckyWinner.email || luckyWinner.id}. Ledger ID: ${result.ledger.id}`
  );

  return {
    success: true,
    message: `Raffle successfully executed for ${targetMonth}/${targetYear}.`,
    targetMonth,
    targetYear,
    totalRemoteHours,
    poolHours,
    awardedHours,
    winner: {
      id: luckyWinner.id,
      displayName: luckyWinner.displayName,
      email: luckyWinner.email,
      phoneNumber: luckyWinner.phoneNumber,
    },
    ledgerEntryId: result.ledger.id,
    awardedBookingId: result.awardedBooking.id,
  };
}
