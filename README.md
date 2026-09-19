# Smart Chef 👨‍🍳🔥
### Mobile-First Next.js (App Router), Tailwind CSS, Framer Motion, Firebase & Prisma Architecture

A production-ready full-stack culinary application featuring:
- **Mobile-First UX**: Sleek mobile app shell with bottom dock navigation, spring animated page transitions via Framer Motion, and Tailwind CSS.
- **Firebase Authentication**: Multi-provider support for **Google**, **Facebook**, and **Phone (SMS OTP)** with invisible reCAPTCHA.
- **Prisma Database Layer**:
  - `User`: Tracks `is_subscribed` (VIP membership) and `has_course_access`.
  - `Transaction`: Audits Safaricom M-Pesa Daraja API logs (STK Push, checkout IDs, receipts).
  - `Booking`: Manages `REMOTE` (video call) vs `FACE_TO_FACE` (in-kitchen) consultations.
  - `RaffleLedger`: Records monthly calculations, pool allocations, and raffle winners.
- **Automated Monthly Background Cron Job**:
  - Automatically queries all completed **remote** consultation hours for the previous calendar month.
  - Computes exact **5%** pool.
  - Filters registered, non-subscribed users (`is_subscribed == false`).
  - Pseudo-randomly selects a winner, creates an immutable audit record in `RaffleLedger`, and schedules a free 1-hour consultation session.
- **Safaricom M-Pesa Daraja Integration**:
  - STK push initiator (`/api/mpesa/stkpush`).
  - Webhook callback listener (`/api/mpesa/callback`) that automatically activates subscriptions and course access upon verified payment.
  - Instant developer callback simulator (`/api/mpesa/simulate-callback`).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (already configured with local development defaults):
```bash
cp .env.example .env
```

### 3. Generate Database & Seed Mock Data
```bash
npm run prisma:push
npm run prisma:seed
```
This populates:
- 2 Subscribed chefs (Sarah, David)
- 3 Non-subscribed registered foodies (Amina, Brian, Grace) eligible for the raffle
- 60 hours of remote consultations from the previous month (yielding exactly 3.0 pool hours)
- Historical M-Pesa transactions

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your mobile browser or emulator.

---

## 🎲 Running the Monthly Raffle Cron Job

You can trigger the 5% remote consultation raffle calculation in 3 different ways:

### Method A: Standalone CLI Script
```bash
npm run cron:raffle
```
Optional flags:
- `--force` : Re-executes the calculation even if already recorded for the month.
- `--month=8` : Manually specify target month (1-12).
- `--year=2026` : Manually specify target year.

### Method B: Via API Route (Vercel Cron / Cloud Scheduler)
Make an authorized HTTP request:
```bash
curl -X POST "http://localhost:3000/api/cron/raffle?force=true&secret=smartchef_raffle_secure_cron_token_98765"
```
Or send header:
```bash
Authorization: Bearer smartchef_raffle_secure_cron_token_98765
```

### Method C: Directly in the UI
Navigate to the **5% Raffle** tab in the mobile app and tap **"Run Cron Job Now"**. An interactive celebration will display the calculation breakdown and the selected winner.

---

## 📱 Firebase Auth Setup

### Google & Facebook
1. In the [Firebase Console](https://console.firebase.google.com/), go to **Authentication > Sign-in method**.
2. Enable **Google** and **Facebook** providers.
3. Paste your web credentials into `.env`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   ```

### Phone (SMS OTP)
1. In the Firebase Console, enable the **Phone** provider.
2. The client uses `RecaptchaVerifier` on `<div id="recaptcha-container" />` with `signInWithPhoneNumber`.
3. Test with whitelisted numbers in the Firebase console during development.

---

## 💳 M-Pesa Daraja API Integration

The application supports Safaricom Daraja STK Push (Lipa Na M-Pesa Online):
1. User enters mobile number (`2547XXXXXXXX`).
2. `/api/mpesa/stkpush` dispatches request to Safaricom Daraja and creates a `PENDING` `Transaction` entry.
3. Safaricom sends webhook to `/api/mpesa/callback`.
4. The callback extracts `MpesaReceiptNumber` and `ResultCode`:
   - If `ResultCode === 0` and `transactionType === "SUBSCRIPTION"`, the user's `is_subscribed` flag is set to `true`.
   - If `transactionType === "COURSE_ACCESS"`, `has_course_access` is set to `true`.
