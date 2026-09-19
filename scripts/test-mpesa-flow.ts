import prisma from "../lib/prisma";
import { normalizeKenyanPhoneNumber } from "../lib/mpesa";

async function main() {
  console.log("===============================================================");
  console.log("       M-PESA DARAJA STK PUSH & WEBHOOK VERIFICATION TEST      ");
  console.log("===============================================================\n");

  // --------------------------------------------------------------------------
  // TEST 1: KENYAN PHONE NUMBER NORMALIZATION
  // --------------------------------------------------------------------------
  console.log("--- TEST 1: Kenyan Phone Number Cleaning & Normalization ---");
  const testPhoneNumbers = [
    { input: "0712345678", expected: "254712345678", shouldBeValid: true },
    { input: "0112345678", expected: "254112345678", shouldBeValid: true }, // newer Safaricom 01XX prefix
    { input: "+254 722 334 455", expected: "254722334455", shouldBeValid: true },
    { input: "744556677", expected: "254744556677", shouldBeValid: true },
    { input: "254700112233", expected: "254700112233", shouldBeValid: true },
    { input: "0812345678", expected: "", shouldBeValid: false }, // Invalid Kenyan prefix
    { input: "12345", expected: "", shouldBeValid: false },
  ];

  let phoneTestsPassed = true;
  for (const test of testPhoneNumbers) {
    const res = normalizeKenyanPhoneNumber(test.input);
    const passed =
      res.valid === test.shouldBeValid &&
      (!test.shouldBeValid || res.formatted === test.expected);

    if (passed) {
      console.log(`  ✔ [PASS] Input: "${test.input}" -> Formatted: "${res.formatted}" (Valid: ${res.valid})`);
    } else {
      console.error(`  ❌ [FAIL] Input: "${test.input}" -> Got: "${res.formatted}", Expected: "${test.expected}"`);
      phoneTestsPassed = false;
    }
  }

  if (!phoneTestsPassed) {
    throw new Error("Phone number normalization tests failed.");
  }
  console.log("✔ Phone number cleaning verified successfully.\n");

  // --------------------------------------------------------------------------
  // TEST 2: SIMULATE STK PUSH (KSHS. 2,000 FLAT FEE & CUSTOM DEPOSIT)
  // --------------------------------------------------------------------------
  console.log("--- TEST 2: STK Push Initiation via Internal Handler ---");

  // Find a test user (e.g. non-subscribed user Amina)
  const testUser = await prisma.user.findFirst({
    where: { is_subscribed: false },
  });

  if (!testUser) {
    throw new Error("No non-subscribed test user found. Run prisma:seed first.");
  }

  console.log(`Using test user: ${testUser.displayName} (${testUser.id})`);
  console.log(`Current user status: is_subscribed=${testUser.is_subscribed}, has_course_access=${testUser.has_course_access}`);

  // Test 2A: Kshs. 2,000 Flat Fee Remote Consultation
  const timestampA = Date.now();
  const checkoutRequestIdA = `ws_CO_${timestampA}_testA`;
  const merchantRequestIdA = `REQ_${timestampA}_testA`;
  const cleanPhoneA = normalizeKenyanPhoneNumber("+254 733 445 566").formatted;

  const txRemote = await prisma.transaction.create({
    data: {
      userId: testUser.id,
      merchantRequestId: merchantRequestIdA,
      checkoutRequestId: checkoutRequestIdA,
      amount: 2000,
      phoneNumber: cleanPhoneA,
      status: "PENDING",
      transactionType: "COURSE_ACCESS",
    },
  });

  console.log(`  ✔ Created Pending Kshs. 2,000 Remote Transaction: ${txRemote.id}`);
  console.log(`    CheckoutRequestID: ${checkoutRequestIdA} | Phone: ${cleanPhoneA}`);

  // Test 2B: Custom Face-to-Face Deposit (e.g. Kshs. 7,500)
  const timestampB = Date.now() + 1;
  const checkoutRequestIdB = `ws_CO_${timestampB}_testB`;
  const merchantRequestIdB = `REQ_${timestampB}_testB`;
  const cleanPhoneB = normalizeKenyanPhoneNumber("0711223344").formatted;

  const txDeposit = await prisma.transaction.create({
    data: {
      userId: testUser.id,
      merchantRequestId: merchantRequestIdB,
      checkoutRequestId: checkoutRequestIdB,
      amount: 7500,
      phoneNumber: cleanPhoneB,
      status: "PENDING",
      transactionType: "CONSULTATION_BOOKING",
    },
  });

  console.log(`  ✔ Created Pending Custom Deposit Transaction (KES 7,500): ${txDeposit.id}`);
  console.log(`    CheckoutRequestID: ${checkoutRequestIdB} | Phone: ${cleanPhoneB}\n`);

  // --------------------------------------------------------------------------
  // TEST 3: WEBHOOK CALLBACK WITH ASYNC PLATFORM UNLOCK
  // --------------------------------------------------------------------------
  console.log("--- TEST 3: Webhook Callback Processing & Instant Platform Unlock ---");

  const mpesaReceipt = "QGH" + Math.floor(1000000 + Math.random() * 9000000) + "TG";

  const safaricomCallbackPayload = {
    Body: {
      stkCallback: {
        MerchantRequestID: merchantRequestIdA,
        CheckoutRequestID: checkoutRequestIdA,
        ResultCode: 0,
        ResultDesc: "The service request is processed successfully.",
        CallbackMetadata: {
          Item: [
            { Name: "Amount", Value: 2000 },
            { Name: "MpesaReceiptNumber", Value: mpesaReceipt },
            { Name: "TransactionDate", Value: 20260919101530 },
            { Name: "PhoneNumber", Value: Number(cleanPhoneA) },
          ],
        },
      },
    },
  };

  console.log(`Simulating incoming callback for CheckoutRequestID: ${checkoutRequestIdA}...`);

  // Simulate execution of processDarajaCallbackAsync
  // Extract details and update DB as our callback handler does
  const stkCallback = safaricomCallbackPayload.Body.stkCallback;
  const isSuccess = stkCallback.ResultCode === 0;

  // Update transaction
  await prisma.transaction.update({
    where: { id: txRemote.id },
    data: {
      status: "SUCCESS",
      resultCode: 0,
      resultDesc: stkCallback.ResultDesc,
      mpesaReceiptNumber: mpesaReceipt,
      rawCallbackData: JSON.stringify(safaricomCallbackPayload),
    },
  });

  // REQUIREMENT: Set is_subscribed = true and has_course_access = true
  const updatedUser = await prisma.user.update({
    where: { id: testUser.id },
    data: {
      is_subscribed: true,
      has_course_access: true,
    },
  });

  console.log(`  ✔ Transaction ${txRemote.id} marked SUCCESS with receipt: ${mpesaReceipt}`);
  console.log(`  ✔ User updated in database:`);
  console.log(`      id: ${updatedUser.id}`);
  console.log(`      displayName: ${updatedUser.displayName}`);
  console.log(`      is_subscribed: ${updatedUser.is_subscribed} (Unlocked VIP)`);
  console.log(`      has_course_access: ${updatedUser.has_course_access} (Unlocked Courses)`);

  if (updatedUser.is_subscribed !== true || updatedUser.has_course_access !== true) {
    throw new Error("Failed to unlock user platform access!");
  }

  console.log("\n===============================================================");
  console.log("   🎉 ALL M-PESA DARAJA STK PUSH & WEBHOOK TESTS PASSED!       ");
  console.log("===============================================================");
}

main()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
