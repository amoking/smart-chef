import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const fallbackBookingsStore: any[] = [
  {
    id: "bk_demo_001",
    userId: "guest_user",
    type: "REMOTE",
    status: "CONFIRMED",
    title: "Kitchen Cost & 2% Wastage Turnaround Consultation",
    durationHours: 1.0,
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Fee: Kshs. 200 (Pay Upfront Confirmed)",
    isRaffleReward: false,
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    const whereClause: {
      userId?: string;
      type?: string;
    } = {};

    if (userId) whereClause.userId = userId;
    if (type) whereClause.type = type;

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
            photoURL: true,
          },
        },
      },
      orderBy: { scheduledAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error: unknown) {
    console.warn("Falling back to in-memory bookings store:", error);
    return NextResponse.json({ bookings: fallbackBookingsStore });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      type = "REMOTE",
      title = "Chef Turnaround Consultation",
      durationHours = 1.0,
      scheduledAt,
      notes,
      status = "CONFIRMED",
    } = body;

    if (!scheduledAt) {
      return NextResponse.json(
        { error: "scheduledAt date and time are required" },
        { status: 400 }
      );
    }

    if (userId) {
      try {
        const booking = await prisma.booking.create({
          data: {
            userId,
            type: type === "FACE_TO_FACE" ? "FACE_TO_FACE" : "REMOTE",
            status,
            title,
            durationHours: Number(durationHours),
            scheduledAt: new Date(scheduledAt),
            notes,
          },
        });
        return NextResponse.json({ success: true, booking });
      } catch (dbErr) {
        console.warn("DB fallback for booking creation:", dbErr);
      }
    }

    const fallbackBooking = {
      id: `bk_${Date.now()}`,
      userId: userId || "guest_customer",
      type: type === "FACE_TO_FACE" ? "FACE_TO_FACE" : "REMOTE",
      status,
      title,
      durationHours: Number(durationHours),
      scheduledAt: new Date(scheduledAt).toISOString(),
      notes: notes || "Fee: Kshs. 200",
      isRaffleReward: false,
      createdAt: new Date().toISOString(),
    };

    fallbackBookingsStore.unshift(fallbackBooking);
    return NextResponse.json({ success: true, booking: fallbackBooking });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create booking";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
