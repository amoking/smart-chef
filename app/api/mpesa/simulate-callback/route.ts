import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { checkoutRequestId, success = true } = await req.json();

    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: "checkoutRequestId is required" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.findUnique({
      where: { checkoutRequestId },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const receipt = "MP" + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Mock Daraja callback body
    const callbackPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: transaction.merchantRequestId,
          CheckoutRequestID: transaction.checkoutRequestId,
          ResultCode: success ? 0 : 1032,
          ResultDesc: success
            ? "The service request is processed successfully."
            : "Request cancelled by user.",
          CallbackMetadata: success
            ? {
                Item: [
                  { Name: "Amount", Value: transaction.amount },
                  { Name: "MpesaReceiptNumber", Value: receipt },
                  { Name: "PhoneNumber", Value: transaction.phoneNumber },
                ],
              }
            : undefined,
        },
      },
    };

    // Forward to internal callback route handler
    const callbackRes = await fetch(new URL("/api/mpesa/callback", req.url).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(callbackPayload),
    });

    const callbackData = await callbackRes.json();
    return NextResponse.json({
      success: true,
      simulatedCallback: callbackPayload,
      result: callbackData,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Simulation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
