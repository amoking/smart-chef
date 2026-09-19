import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId");
    const type = searchParams.get("type"); // "REMOTE" | "FACE_TO_FACE"

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
    const msg = error instanceof Error ? error.message : "Failed to fetch bookings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      type = "REMOTE",
      title = "Chef Consultation",
      durationHours = 1.0,
      scheduledAt,
      notes,
    } = body;

    if (!userId || !scheduledAt) {
      return NextResponse.json(
        { error: "userId and scheduledAt are required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        type: type === "FACE_TO_FACE" ? "FACE_TO_FACE" : "REMOTE",
        status: "CONFIRMED",
        title,
        durationHours: Number(durationHours),
        scheduledAt: new Date(scheduledAt),
        notes,
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create booking";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
