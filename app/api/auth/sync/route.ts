import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firebaseUid, email, displayName, photoURL, phoneNumber } = body;

    if (!firebaseUid) {
      return NextResponse.json(
        { error: "Missing required firebaseUid" },
        { status: 400 }
      );
    }

    // Upsert user into database
    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: {
        email: email || undefined,
        displayName: displayName || undefined,
        photoURL: photoURL || undefined,
        phoneNumber: phoneNumber || undefined,
      },
      create: {
        firebaseUid,
        email: email || undefined,
        displayName: displayName || "Smart Chef Member",
        photoURL: photoURL || undefined,
        phoneNumber: phoneNumber || undefined,
        is_subscribed: false,
        has_course_access: false,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    console.error("[AuthSync Error]:", error);
    const msg = error instanceof Error ? error.message : "Failed to sync user";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
