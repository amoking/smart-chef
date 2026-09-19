import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  normalizeKenyanPhoneNumber,
  getDarajaTimestamp,
  generateDarajaPassword,
  getDarajaAccessToken,
} from "@/lib/mpesa";

/**
 * Route 1: POST /api/mpesa/stkpush
 * Initiates an M-Pesa Daraja STK Push prompt on the customer's phone.
 *
 * Handles:
 * - Kshs. 2,000 flat fee (Remote Consultation + 1-month course access)
 * - Custom deposit for Face-to-Face On-Site consultations
 * - Automated Kenyan phone number cleaning to "2547XXXXXXXX" / "2541XXXXXXXX" format
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      phoneNumber,
      amount,
      consultationType = "REMOTE", // "REMOTE" | "FACE_TO_FACE" | "SUBSCRIPTION" | "COURSE_ACCESS"
      notes,
    } = body;

    // 1. Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: "User ID (userId) is required to associate this transaction." },
        { status: 400 }
      );
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: `User with id "${userId}" not found in database.` },
        { status: 404 }
      );
    }

    // 2. Automatically clean and normalize Kenyan phone number
    const phoneResult = normalizeKenyanPhoneNumber(phoneNumber);
    if (!phoneResult.valid) {
      return NextResponse.json(
        { error: phoneResult.error },
        { status: 400 }
      );
    }
    const formattedPhone = phoneResult.formatted;

    // 3. Resolve Amount: Flat Kshs. 2,000 or custom face-to-face deposit
    let payableAmount: number;
    let transactionType: "COURSE_ACCESS" | "SUBSCRIPTION" | "CONSULTATION_BOOKING" = "COURSE_ACCESS";
    let accountReference = "SmartChef";
    let transactionDesc = "Chef Consultation";

    if (consultationType === "REMOTE") {
      // Remote consultation flat fee is Kshs. 2,000
      payableAmount = amount ? Math.round(Number(amount)) : 2000;
      transactionType = "COURSE_ACCESS";
      accountReference = "SmartChefRemote";
      transactionDesc = "1hr Remote + Course Access";
    } else if (consultationType === "FACE_TO_FACE") {
      // Custom deposit for On-Site Face-to-Face visit
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        return NextResponse.json(
          { error: "A custom deposit amount is required for Face-to-Face consultations." },
          { status: 400 }
        );
      }
      payableAmount = Math.round(Number(amount));
      transactionType = "CONSULTATION_BOOKING";
      accountReference = "SmartChefOnSite";
      transactionDesc = notes ? notes.slice(0, 30) : "Face-to-Face Kitchen Deposit";
    } else if (consultationType === "SUBSCRIPTION") {
      payableAmount = amount ? Math.round(Number(amount)) : 4999;
      transactionType = "SUBSCRIPTION";
      accountReference = "SmartChefVIP";
      transactionDesc = "VIP Chef Subscription";
    } else {
      payableAmount = amount ? Math.round(Number(amount)) : 2000;
    }

    if (payableAmount < 1) {
      return NextResponse.json(
        { error: "Payable amount must be at least Kshs. 1." },
        { status: 400 }
      );
    }

    // 4. Prepare Daraja Credentials
    const shortCode = process.env.MPESA_SHORTCODE || "174379";
    const passkey =
      process.env.MPESA_PASSKEY ||
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const callbackUrl =
      process.env.MPESA_CALLBACK_URL ||
      new URL("/api/mpesa/callback", req.url).toString();

    const timestamp = getDarajaTimestamp();
    const password = generateDarajaPassword(shortCode, passkey, timestamp);

    // 5. Attempt Live Daraja STK Push or generate standard sandbox IDs
    let merchantRequestId: string;
    let checkoutRequestId: string;
    let customerMessage: string;

    const accessToken = await getDarajaAccessToken();

    if (accessToken) {
      const env = process.env.MPESA_ENVIRONMENT || "sandbox";
      const stkUrl =
        env === "production"
          ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
          : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

      const stkPayload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: payableAmount,
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      };

      console.log(`[Daraja STK] Dispatching live request to ${stkUrl} for ${formattedPhone}...`);

      const darajaRes = await fetch(stkUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPayload),
      });

      const darajaData = await darajaRes.json();

      if (!darajaRes.ok || darajaData.ResponseCode !== "0") {
        console.error("[Daraja STK Error]:", darajaData);
        return NextResponse.json(
          {
            error: darajaData.errorMessage || "Daraja STK Push rejected by Safaricom",
            darajaResponse: darajaData,
          },
          { status: 502 }
        );
      }

      merchantRequestId = darajaData.MerchantRequestID;
      checkoutRequestId = darajaData.CheckoutRequestID;
      customerMessage = darajaData.CustomerMessage;
    } else {
      // Local development / sandbox simulator mode
      checkoutRequestId = `ws_CO_${timestamp}_${Math.floor(100000 + Math.random() * 900000)}`;
      merchantRequestId = `REQ_${timestamp}_${Math.floor(1000 + Math.random() * 9000)}`;
      customerMessage = `Success. STK Push sent to ${formattedPhone}. Enter M-Pesa PIN to complete payment of Kshs. ${payableAmount.toLocaleString()}.`;
    }

    // 6. Record Pending Transaction in Database
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        merchantRequestId,
        checkoutRequestId,
        amount: payableAmount,
        phoneNumber: formattedPhone,
        status: "PENDING",
        transactionType,
      },
    });

    console.log(
      `[Daraja STK Push] Transaction recorded: ${transaction.id} | Amount: KES ${payableAmount} | Phone: ${formattedPhone} | Checkout: ${checkoutRequestId}`
    );

    return NextResponse.json({
      success: true,
      MerchantRequestID: merchantRequestId,
      CheckoutRequestID: checkoutRequestId,
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing",
      CustomerMessage: customerMessage,
      amount: payableAmount,
      formattedPhoneNumber: formattedPhone,
      transactionId: transaction.id,
    });
  } catch (error: unknown) {
    console.error("[Daraja STK Push Handler Error]:", error);
    const msg = error instanceof Error ? error.message : "Internal error initiating STK push";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
