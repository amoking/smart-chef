import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    if (id) {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          bookings: { orderBy: { scheduledAt: "desc" }, take: 5 },
          transactions: { orderBy: { createdAt: "desc" }, take: 5 },
          raffleWins: { orderBy: { createdAt: "desc" } },
        },
      });
      return NextResponse.json({ user });
    }

    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            bookings: true,
            transactions: true,
            raffleWins: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
