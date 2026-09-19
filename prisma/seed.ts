import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with initial users, bookings, and Daraja transactions...");

  // Clean previous records
  await prisma.raffleLedger.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users
  // Subscribed users (Not eligible for free raffle)
  const userChefSarah = await prisma.user.create({
    data: {
      firebaseUid: "firebase_uid_sarah_001",
      displayName: "Chef Sarah Wanjiku",
      email: "sarah.wanjiku@example.com",
      phoneNumber: "+254711223344",
      photoURL: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
      is_subscribed: true,
      has_course_access: true,
    },
  });

  const userDavid = await prisma.user.create({
    data: {
      firebaseUid: "firebase_uid_david_002",
      displayName: "David Kiprono",
      email: "david.kiprono@example.com",
      phoneNumber: "+254722334455",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      is_subscribed: true,
      has_course_access: true,
    },
  });

  // Non-subscribed registered users (ELIGIBLE for the 5% free 1-hour raffle)
  const userAmina = await prisma.user.create({
    data: {
      firebaseUid: "firebase_uid_amina_003",
      displayName: "Amina Hassan",
      email: "amina.hassan@example.com",
      phoneNumber: "+254733445566",
      photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      is_subscribed: false,
      has_course_access: false,
    },
  });

  const userBrian = await prisma.user.create({
    data: {
      firebaseUid: "firebase_uid_brian_004",
      displayName: "Brian Omondi",
      email: "brian.omondi@example.com",
      phoneNumber: "+254744556677",
      photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      is_subscribed: false,
      has_course_access: false,
    },
  });

  const userGrace = await prisma.user.create({
    data: {
      firebaseUid: "firebase_uid_grace_005",
      displayName: "Grace Muthoni",
      email: "grace.muthoni@example.com",
      phoneNumber: "+254755667788",
      photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      is_subscribed: false,
      has_course_access: false,
    },
  });

  console.log("Users created: 2 subscribed, 3 non-subscribed (eligible for raffle).");

  // 2. Create Previous Month Remote and Face-to-Face Consultation Bookings
  const now = new Date();
  const currentMonth = now.getUTCMonth();
  const currentYear = now.getUTCFullYear();
  let prevMonth = currentMonth === 0 ? 12 : currentMonth;
  let prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Mid of previous month
  const midPrevMonth = new Date(Date.UTC(prevYear, prevMonth - 1, 15, 14, 0, 0));
  const earlyPrevMonth = new Date(Date.UTC(prevYear, prevMonth - 1, 5, 10, 0, 0));
  const latePrevMonth = new Date(Date.UTC(prevYear, prevMonth - 1, 25, 16, 0, 0));

  // Remote consultations in previous month totaling 60 hours:
  // 5% of 60 hours = 3.0 pool hours
  const remoteBookings = [
    {
      userId: userChefSarah.id,
      type: "REMOTE",
      status: "COMPLETED",
      title: "French Pastry Masterclass Consultation",
      durationHours: 12.0,
      scheduledAt: earlyPrevMonth,
      completedAt: earlyPrevMonth,
      notes: "Remote 1-on-1 via Zoom. Gourmet macaron technique.",
    },
    {
      userId: userDavid.id,
      type: "REMOTE",
      status: "COMPLETED",
      title: "Swahili & Coastal Cuisine Menu Formulation",
      durationHours: 18.0,
      scheduledAt: midPrevMonth,
      completedAt: midPrevMonth,
      notes: "Remote consultation on spice layering and biryani.",
    },
    {
      userId: userChefSarah.id,
      type: "REMOTE",
      status: "COMPLETED",
      title: "Commercial Kitchen Optimization",
      durationHours: 20.0,
      scheduledAt: latePrevMonth,
      completedAt: latePrevMonth,
      notes: "Remote layout and supplier procurement review.",
    },
    {
      userId: userDavid.id,
      type: "REMOTE",
      status: "COMPLETED",
      title: "Farm-to-Table Knife Skills Mentorship",
      durationHours: 10.0,
      scheduledAt: midPrevMonth,
      completedAt: midPrevMonth,
      notes: "Remote video session on Japanese steel maintenance.",
    },
    // Face-to-face booking (should NOT count towards remote hours)
    {
      userId: userChefSarah.id,
      type: "FACE_TO_FACE",
      status: "COMPLETED",
      title: "In-Kitchen Private Tasting Event",
      durationHours: 25.0,
      scheduledAt: midPrevMonth,
      completedAt: midPrevMonth,
      notes: "In-person fine dining demonstration.",
    },
  ];

  for (const b of remoteBookings) {
    await prisma.booking.create({ data: b });
  }

  console.log("Bookings created: 60 total Remote hours in previous month + 25 Face-to-face hours.");

  // 3. Create M-Pesa Daraja Transactions
  await prisma.transaction.create({
    data: {
      userId: userChefSarah.id,
      merchantRequestId: "29115-1823901-1",
      checkoutRequestId: "ws_CO_190920261015309999",
      mpesaReceiptNumber: "QGH716TG3H",
      amount: 4999.0,
      phoneNumber: "254711223344",
      status: "SUCCESS",
      resultCode: 0,
      resultDesc: "The service request is processed successfully.",
      transactionType: "SUBSCRIPTION",
      rawCallbackData: JSON.stringify({
        Body: {
          stkCallback: {
            MerchantRequestID: "29115-1823901-1",
            CheckoutRequestID: "ws_CO_190920261015309999",
            ResultCode: 0,
            ResultDesc: "The service request is processed successfully.",
            CallbackMetadata: {
              Item: [
                { Name: "Amount", Value: 4999.0 },
                { Name: "MpesaReceiptNumber", Value: "QGH716TG3H" },
                { Name: "TransactionDate", Value: 20260919101530 },
                { Name: "PhoneNumber", Value: 254711223344 },
              ],
            },
          },
        },
      }),
    },
  });

  await prisma.transaction.create({
    data: {
      userId: userDavid.id,
      merchantRequestId: "29115-1823901-2",
      checkoutRequestId: "ws_CO_190920261120458888",
      mpesaReceiptNumber: "QGH982KL4R",
      amount: 2500.0,
      phoneNumber: "254722334455",
      status: "SUCCESS",
      resultCode: 0,
      resultDesc: "The service request is processed successfully.",
      transactionType: "COURSE_ACCESS",
      rawCallbackData: JSON.stringify({
        Body: {
          stkCallback: {
            MerchantRequestID: "29115-1823901-2",
            CheckoutRequestID: "ws_CO_190920261120458888",
            ResultCode: 0,
            ResultDesc: "The service request is processed successfully.",
          },
        },
      }),
    },
  });

  console.log("M-Pesa Daraja transactions seeded.");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
