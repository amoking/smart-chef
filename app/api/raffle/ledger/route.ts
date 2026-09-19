import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const ledgers = await prisma.raffleLedger.findMany({
      include: {
        winner: {
          select: {
            id: true,
            displayName: true,
            email: true,
            photoURL: true,
            phoneNumber: true,
            is_subscribed: true,
          },
        },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    // Compute live estimation for current month's accumulated pool
    const now = new Date();
    const currentMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const currentMonthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

    const currentMonthRemoteBookings = await prisma.booking.findMany({
      where: {
        type: "REMOTE",
        status: { in: ["COMPLETED", "CONFIRMED"] },
        scheduledAt: { gte: currentMonthStart, lte: currentMonthEnd },
      },
    });

    const currentRemoteHours = currentMonthRemoteBookings.reduce(
      (sum, b) => sum + (b.durationHours || 0),
      0
    );
    const liveEstimatedPoolHours = Number((currentRemoteHours * 0.05).toFixed(2));

    const eligibleUsersCount = await prisma.user.count({
      where: { is_subscribed: false },
    });

    return NextResponse.json({
      ledgers,
      currentMonthMetrics: {
        month: now.getUTCMonth() + 1,
        year: now.getUTCFullYear(),
        currentRemoteHours,
        liveEstimatedPoolHours,
        eligibleUsersCount,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch raffle ledger";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
