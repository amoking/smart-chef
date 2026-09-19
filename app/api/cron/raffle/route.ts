import { NextRequest, NextResponse } from "next/server";
import { executeMonthlyRaffleCron } from "@/lib/cron/raffle-cron";

/**
 * Endpoint for running the background raffle cron job.
 * Calculates 5% of previous month's remote consultation hours
 * and awards a free 1-hour session to a registered non-subscribed user.
 *
 * Securable via:
 * 1. Authorization: Bearer <CRON_SECRET>
 * 2. ?secret=<CRON_SECRET>
 */
export async function POST(req: NextRequest) {
  return handleCron(req);
}

export async function GET(req: NextRequest) {
  return handleCron(req);
}

async function handleCron(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const bearerSecret = authHeader ? authHeader.replace("Bearer ", "").trim() : null;
  const searchParams = req.nextUrl.searchParams;
  const querySecret = searchParams.get("secret");

  const expectedSecret = process.env.CRON_SECRET;

  // Verify secret in production or if CRON_SECRET is configured
  if (expectedSecret) {
    if (bearerSecret !== expectedSecret && querySecret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing cron secret" },
        { status: 401 }
      );
    }
  }

  const force = searchParams.get("force") === "true";
  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");

  const overrideMonth = monthParam ? parseInt(monthParam, 10) : undefined;
  const overrideYear = yearParam ? parseInt(yearParam, 10) : undefined;

  try {
    const result = await executeMonthlyRaffleCron({
      force,
      overrideMonth,
      overrideYear,
    });

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error: unknown) {
    console.error("[Cron Route Error]:", error);
    const msg = error instanceof Error ? error.message : "Cron job failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
