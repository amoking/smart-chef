import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Route 2: POST /api/mpesa/callback
 *
 * Daraja STK Push Webhook Callback Endpoint
 *
 * Architecture requirement:
 * Immediately returns an HTTP 200 { "ResultCode": 0, "ResultDesc": "Accepted" }
 * to Safaricom to prevent gateway timeouts (<5000ms SLA), and asynchronously
 * updates the database in the background.
 *
 * On successful payment (ResultCode === 0):
 * Sets BOTH `is_subscribed = true` and `has_course_access = true` on the user's
 * profile to instantly unlock the full platform!
 */
export async function POST(req: NextRequest) {
  let rawBody: any;
  try {
    rawBody = await req.json();
  } catch (err) {
    console.error("[Daraja Callback] Failed to parse request JSON:", err);
    // Even if JSON parsing fails, acknowledge Safaricom to avoid infinite webhook retry loops
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" }, { status: 200 });
  }

  // 1. Dispatch asynchronous database update in the background (Non-blocking)
  setImmediate(async () => {
    try {
      await processDarajaCallbackAsync(rawBody);
    } catch (asyncErr) {
      console.error("[Daraja Callback] Unhandled asynchronous processing error:", asyncErr);
    }
  });

  // 2. Immediately return HTTP 200 with { "ResultCode": 0 } to Safaricom
  return NextResponse.json(
    {
      ResultCode: 0,
      ResultDesc: "Accepted for processing",
    },
    { status: 200 }
  );
}

/**
 * Asynchronous background processor for Safaricom Daraja callback payload
 */
async function processDarajaCallbackAsync(rawBody: any) {
  console.log("[Daraja Callback] Processing payload in background...");

  const stkCallback = rawBody?.Body?.stkCallback;
  if (!stkCallback) {
    console.warn("[Daraja Callback] Payload missing Body.stkCallback structure:", rawBody);
    return;
  }

  const {
    MerchantRequestID,
    CheckoutRequestID,
    ResultCode,
    ResultDesc,
    CallbackMetadata,
  } = stkCallback;

  console.log(
    `[Daraja Callback] Received CheckoutRequestID: ${CheckoutRequestID} | ResultCode: ${ResultCode} (${ResultDesc})`
  );

  // Locate the pending transaction in database
  const transaction = await prisma.transaction.findFirst({
    where: {
      OR: [
        { checkoutRequestId: CheckoutRequestID },
        { merchantRequestId: MerchantRequestID },
      ],
    },
    include: { user: true },
  });

  if (!transaction) {
    console.warn(
      `[Daraja Callback] No matching transaction found for CheckoutRequestID: ${CheckoutRequestID}`
    );
    return;
  }

  // Parse Metadata items (MpesaReceiptNumber, Amount, PhoneNumber, TransactionDate)
  let mpesaReceiptNumber: string | null = null;
  let paidAmount: number | null = null;
  let paidPhone: string | null = null;

  if (CallbackMetadata?.Item && Array.isArray(CallbackMetadata.Item)) {
    for (const item of CallbackMetadata.Item) {
      if (item.Name === "MpesaReceiptNumber") {
        mpesaReceiptNumber = String(item.Value);
      } else if (item.Name === "Amount") {
        paidAmount = Number(item.Value);
      } else if (item.Name === "PhoneNumber") {
        paidPhone = String(item.Value);
      }
    }
  }

  const isSuccess = ResultCode === 0;
  const status = isSuccess ? "SUCCESS" : "FAILED";

  // Fallback receipt if Safaricom sandbox omitted CallbackMetadata
  const receiptToStore =
    mpesaReceiptNumber ||
    (isSuccess ? `MP${Date.now().toString().slice(-8).toUpperCase()}` : null);

  // 1. Update Transaction record
  const updatedTx = await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      status,
      resultCode: ResultCode,
      resultDesc: ResultDesc,
      mpesaReceiptNumber: receiptToStore,
      rawCallbackData: JSON.stringify(rawBody),
    },
  });

  console.log(
    `[Daraja Callback] Transaction ${updatedTx.id} status updated to: ${status} (Receipt: ${receiptToStore})`
  );

  // 2. On Successful Payment: Instantly unlock platform for user
  if (isSuccess) {
    // REQUIREMENT: Set is_subscribed = true AND has_course_access = true
    const updatedUser = await prisma.user.update({
      where: { id: transaction.userId },
      data: {
        is_subscribed: true,
        has_course_access: true,
      },
    });

    console.log(
      `[Daraja Callback] 🎉 USER PERKS UNLOCKED! User "${updatedUser.displayName || updatedUser.id}": is_subscribed=true, has_course_access=true`
    );

    // 3. If there are any pending bookings associated with this user, mark as CONFIRMED
    const updatedBookings = await prisma.booking.updateMany({
      where: {
        userId: transaction.userId,
        status: "PENDING",
      },
      data: {
        status: "CONFIRMED",
      },
    });

    if (updatedBookings.count > 0) {
      console.log(
        `[Daraja Callback] Confirmed ${updatedBookings.count} pending consultation booking(s) for user.`
      );
    }
  }
}
