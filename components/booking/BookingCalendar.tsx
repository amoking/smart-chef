"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { MpesaModal } from "@/components/mpesa/MpesaModal";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Building2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Timer,
  Smartphone,
  CreditCard,
  RefreshCw,
  AlertCircle,
  Unlock,
} from "lucide-react";

interface BookingCalendarProps {
  googleAppointmentUrl?: string;
  onOpenAuth?: () => void;
  onBookingConfirmed?: () => void;
}

const CONSULTATION_FEE_KES = 200;
const HOLD_DURATION_SECONDS = 15 * 60; // 15 minutes

const TIME_SLOTS = [
  { id: "09:00", label: "09:00 AM", tag: "Morning Audit" },
  { id: "10:30", label: "10:30 AM", tag: "Available" },
  { id: "12:00", label: "12:00 PM", tag: "Midday Slot" },
  { id: "14:00", label: "02:00 PM", tag: "Popular" },
  { id: "16:00", label: "04:00 PM", tag: "Afternoon" },
  { id: "17:30", label: "05:30 PM", tag: "Evening" },
];

const CONSULTATION_TOPICS = [
  "Kitchen Cost & 2% Wastage Turnaround",
  "Recruitment & Vetted Staff Placement",
  "Service Speed & Sales Training",
  "Housekeeping & Detergent Audit",
  "Stores & Stock Accountability",
];

function generateUpcomingDays(count = 7) {
  const days: {
    isoDate: string;
    dayName: string;
    dayNum: string;
    monthShort: string;
    openSlots: number;
  }[] = [];

  for (let i = 1; i <= count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const isoDate = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-KE", { weekday: "short" });
    const dayNum = d.toLocaleDateString("en-KE", { day: "2-digit" });
    const monthShort = d.toLocaleDateString("en-KE", { month: "short" });
    days.push({
      isoDate,
      dayName,
      dayNum,
      monthShort,
      openSlots: 4 + (i % 3),
    });
  }
  return days;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onOpenAuth,
  onBookingConfirmed,
}) => {
  const { dbUser, refreshDbUser } = useAuth();

  const upcomingDays = React.useMemo(() => generateUpcomingDays(7), []);

  // Step 1: Open Date & Time Selection State (No upfront paywall!)
  const [consultationType, setConsultationType] = useState<"REMOTE" | "FACE_TO_FACE">(
    "REMOTE"
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    upcomingDays[0]?.isoDate || new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("10:30");
  const [selectedTopic, setSelectedTopic] = useState<string>(CONSULTATION_TOPICS[0]);
  const [establishmentName, setEstablishmentName] = useState<string>("");
  const [locationAddress, setLocationAddress] = useState<string>("");

  // Step 2: Secured Slot & 15-Minute Hold Timer before Payment Decision
  const [workflowStep, setWorkflowStep] = useState<
    "SELECT_SLOT" | "HOLD_PAYMENT_CHOICE" | "LOCKED_CONFIRMED"
  >("SELECT_SLOT");
  const [secondsLeft, setSecondsLeft] = useState<number>(HOLD_DURATION_SECONDS);
  const [paymentChoiceMade, setPaymentChoiceMade] = useState<
    "UPFRONT_PAID" | "PAY_LATER" | null
  >(null);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState<boolean>(false);
  const [isSavingBooking, setIsSavingBooking] = useState<boolean>(false);
  const [lockedBookingRecord, setLockedBookingRecord] = useState<any | null>(null);

  // 15-Minute Countdown Timer once a date & time slot has been secured
  useEffect(() => {
    if (workflowStep !== "HOLD_PAYMENT_CHOICE") return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [workflowStep]);

  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Step 1 -> Step 2: Secure the available date and time slot & start 15-min timer
  const handleSecureDateTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setSecondsLeft(HOLD_DURATION_SECONDS);
    setWorkflowStep("HOLD_PAYMENT_CHOICE");
  };

  // Save Booking to Database (either Paid Upfront Kshs. 200 OR Pay Later Kshs. 200)
  const finalizeBookingInDb = async (mode: "UPFRONT_PAID" | "PAY_LATER") => {
    setIsSavingBooking(true);
    try {
      const scheduledIso = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
      const paymentNote =
        mode === "UPFRONT_PAID"
          ? `Paid Upfront: Kshs. ${CONSULTATION_FEE_KES} via M-Pesa`
          : `Pay Later Selected: Kshs. ${CONSULTATION_FEE_KES} due before/at session`;

      const venueNote =
        consultationType === "FACE_TO_FACE" && (establishmentName || locationAddress)
          ? ` | Venue: ${establishmentName || "Client Facility"} (${
              locationAddress || "Kenya"
            })`
          : "";

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: dbUser?.id || null,
          type: consultationType,
          status: mode === "UPFRONT_PAID" ? "CONFIRMED" : "PENDING_PAYMENT",
          title: `${selectedTopic} (${
            consultationType === "REMOTE" ? "Remote Video" : "On-Site Visit"
          })`,
          durationHours: consultationType === "FACE_TO_FACE" ? 3.0 : 1.0,
          scheduledAt: scheduledIso,
          notes: `${paymentNote}${venueNote}`,
        }),
      });

      const data = await res.json();
      setLockedBookingRecord(data.booking || null);
      setPaymentChoiceMade(mode);
      setWorkflowStep("LOCKED_CONFIRMED");
      if (onBookingConfirmed) onBookingConfirmed();
    } catch (err) {
      console.error("Failed to save booking:", err);
    } finally {
      setIsSavingBooking(false);
    }
  };

  // Callback when M-Pesa Kshs. 200 Upfront Payment Succeeds
  const handleUpfrontMpesaSuccess = async () => {
    setIsMpesaModalOpen(false);
    await refreshDbUser();
    await finalizeBookingInDb("UPFRONT_PAID");
  };

  return (
    <div className="space-y-4">
      {/* Top Progress Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-bold text-white">
            {workflowStep === "SELECT_SLOT"
              ? "Step 1: Pick Available Date & Time"
              : workflowStep === "HOLD_PAYMENT_CHOICE"
              ? "Step 2: 15-Min Hold — Pay Upfront or Later"
              : "Step 3: Appointment Locked In"}
          </span>
        </div>

        <span className="flex items-center space-x-1 text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
          <Unlock className="w-3 h-3" />
          <span>Fee: Kshs. {CONSULTATION_FEE_KES}</span>
        </span>
      </div>

      {/* =====================================================================
          STEP 1: OPEN CALENDAR & TIME SLOT PICKER (NO BLOCKING PAYWALL)
         ===================================================================== */}
      {workflowStep === "SELECT_SLOT" && (
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSecureDateTimeSlot}
          className="p-4 sm:p-5 rounded-3xl bg-chef-card border border-white/10 shadow-2xl space-y-4"
        >
          {/* Consultation Format Selector */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setConsultationType("REMOTE")}
              className={`p-3 rounded-2xl border text-left transition-all flex items-start space-x-2.5 ${
                consultationType === "REMOTE"
                  ? "bg-brand-500/20 border-brand-500 text-white shadow-glow"
                  : "bg-black/35 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-white block">
                  Remote Video
                </span>
                <span className="text-[10px] text-brand-300 font-bold block">
                  Kshs. {CONSULTATION_FEE_KES} • 1 Hr
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setConsultationType("FACE_TO_FACE")}
              className={`p-3 rounded-2xl border text-left transition-all flex items-start space-x-2.5 ${
                consultationType === "FACE_TO_FACE"
                  ? "bg-emerald-500/20 border-emerald-500 text-white shadow-lg"
                  : "bg-black/35 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-white block">
                  On-Site Visit
                </span>
                <span className="text-[10px] text-emerald-300 font-bold block">
                  Kshs. {CONSULTATION_FEE_KES} • Ground Audit
                </span>
              </div>
            </button>
          </div>

          {/* 1. Available Dates Horizontal Calendar Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300">
                1. Select Available Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                aria-label="Custom date picker"
                className="bg-black/50 border border-white/15 rounded-xl px-2.5 py-1 text-[10px] text-white"
              />
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {upcomingDays.map((d) => {
                const isSelected = selectedDate === d.isoDate;
                return (
                  <button
                    key={d.isoDate}
                    type="button"
                    onClick={() => setSelectedDate(d.isoDate)}
                    className={`py-2 px-1 rounded-2xl border text-center transition-all flex flex-col items-center ${
                      isSelected
                        ? "bg-brand-500 text-white border-brand-400 shadow-glow"
                        : "bg-black/40 border-white/10 text-slate-300 hover:border-white/30"
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold opacity-80">
                      {d.dayName}
                    </span>
                    <span className="text-sm font-black leading-tight my-0.5">
                      {d.dayNum}
                    </span>
                    <span className="text-[8px] font-semibold opacity-75">
                      {d.monthShort}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Available Time Slots Grid */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 block">
              2. Select Available Time Slot (EAT)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedTime(slot.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-emerald-500/20 border-emerald-400 text-white shadow-md"
                        : "bg-black/35 border-white/10 text-slate-300 hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Clock
                        className={`w-3.5 h-3.5 ${
                          isSelected ? "text-emerald-400" : "text-slate-500"
                        }`}
                      />
                      <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-emerald-300">
                        {slot.tag}
                      </span>
                    </div>
                    <span className="text-xs font-black text-white block mt-1">
                      {slot.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Consultation Focus & Optional Venue Info */}
          <div className="space-y-2.5">
            <div>
              <label
                htmlFor="booking-topic-select"
                className="block text-[11px] font-bold text-slate-300 mb-1"
              >
                3. Consultation / Recruitment Focus
              </label>
              <select
                id="booking-topic-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
              >
                {CONSULTATION_TOPICS.map((t) => (
                  <option key={t} value={t} className="bg-slate-900">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {consultationType === "FACE_TO_FACE" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-black/35 border border-emerald-500/25">
                <input
                  type="text"
                  value={establishmentName}
                  onChange={(e) => setEstablishmentName(e.target.value)}
                  placeholder="Business / Hotel Name"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                />
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="Town / Location (e.g. Westlands)"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                />
              </div>
            )}
          </div>

          {/* Secure Slot CTA (Moves to Step 2 with 15-minute hold timer) */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-black text-xs shadow-glow flex items-center justify-center space-x-2 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>
              Secure {selectedDate} at {selectedTime} (15-Min Hold)
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.form>
      )}

      {/* =====================================================================
          STEP 2: SLOT SECURED! 15-MINUTE COUNTDOWN + PAY UPFRONT OR PAY LATER
          (Kshs. 200)
         ===================================================================== */}
      {workflowStep === "HOLD_PAYMENT_CHOICE" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-3xl bg-gradient-to-br from-[#1f1712] via-chef-card to-chef-dark border border-amber-500/40 shadow-2xl space-y-4"
        >
          {/* 15-Minute Countdown Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                  Date & Time Temporarily Secured
                </span>
                <p className="text-xs font-bold text-white">
                  15-Minute Hold Active to Lock In Your Slot
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-black/70 border border-amber-400/50 text-amber-300 font-mono font-black text-sm shrink-0">
              {formatCountdown(secondsLeft)}
            </div>
          </div>

          {/* Secured Slot Summary Card */}
          <div className="p-4 rounded-2xl bg-black/45 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Secured Date & Time:</span>
              <span className="text-white font-black">
                {selectedDate} • {selectedTime} EAT
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Format & Focus:</span>
              <span className="text-emerald-300 font-bold truncate max-w-[200px]">
                {consultationType === "REMOTE" ? "Remote Video" : "On-Site Visit"} —{" "}
                {selectedTopic}
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-slate-300">
                Consultation Booking Fee:
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-xs text-slate-500 line-through">
                  Kshs. 2,000
                </span>
                <span className="text-lg font-black text-emerald-400">
                  Kshs. {CONSULTATION_FEE_KES}
                </span>
              </div>
            </div>
          </div>

          {secondsLeft === 0 ? (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-xs text-red-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Your 15-minute slot hold expired.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSecondsLeft(HOLD_DURATION_SECONDS);
                }}
                className="px-3 py-1 rounded-xl bg-red-500 text-white font-bold text-[10px]"
              >
                Restart 15-Min Hold
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-300 font-medium">
                Choose how you would like to lock in your secured appointment:
              </p>

              {/* OPTION 1: PAY UPFRONT (Kshs. 200 via M-Pesa) */}
              <button
                type="button"
                disabled={isSavingBooking}
                onClick={() => {
                  if (!dbUser && onOpenAuth) {
                    onOpenAuth();
                    return;
                  }
                  setIsMpesaModalOpen(true);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-2.5">
                  <Smartphone className="w-4 h-4" />
                  <span>Option 1: Pay Upfront Now (M-Pesa STK)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-slate-950 font-black">
                  Kshs. {CONSULTATION_FEE_KES}
                </span>
              </button>

              {/* OPTION 2: PAY LATER (Lock In Slot Now, Pay Kshs. 200 Later) */}
              <button
                type="button"
                disabled={isSavingBooking}
                onClick={() => finalizeBookingInDb("PAY_LATER")}
                className="w-full py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-2.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Option 2: Lock In Slot & Pay Later</span>
                </div>
                <span className="text-[10px] font-bold text-amber-300">
                  Pay Kshs. {CONSULTATION_FEE_KES} Later →
                </span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setWorkflowStep("SELECT_SLOT")}
            className="text-[11px] font-bold text-slate-400 hover:text-white underline block mx-auto"
          >
            ← Change Date or Time Slot
          </button>
        </motion.div>
      )}

      {/* =====================================================================
          STEP 3: APPOINTMENT LOCKED IN & CONFIRMED
         ===================================================================== */}
      {workflowStep === "LOCKED_CONFIRMED" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/90 via-chef-card to-chef-dark border border-emerald-500/40 shadow-2xl space-y-4 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              Appointment Slot Locked In
            </span>
            <h3 className="text-base font-black text-white">
              {selectedDate} at {selectedTime} EAT
            </h3>
            <p className="text-xs text-slate-300">{selectedTopic}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 text-xs space-y-1.5 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Consultation Fee:</span>
              <span className="font-black text-white">
                Kshs. {CONSULTATION_FEE_KES}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Status:</span>
              <span
                className={`font-bold ${
                  paymentChoiceMade === "UPFRONT_PAID"
                    ? "text-emerald-400"
                    : "text-amber-300"
                }`}
              >
                {paymentChoiceMade === "UPFRONT_PAID"
                  ? "✓ Paid Upfront via M-Pesa"
                  : "Pay Later (Kshs. 200 Due Before Session)"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {paymentChoiceMade === "PAY_LATER" && (
              <button
                type="button"
                onClick={() => {
                  if (!dbUser && onOpenAuth) {
                    onOpenAuth();
                    return;
                  }
                  setIsMpesaModalOpen(true);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs"
              >
                Pay Kshs. {CONSULTATION_FEE_KES} Now
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setPaymentChoiceMade(null);
                setWorkflowStep("SELECT_SLOT");
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
            >
              Book Another Slot
            </button>
          </div>
        </motion.div>
      )}

      {/* M-Pesa Kshs. 200 Checkout Modal */}
      {isMpesaModalOpen && (
        <MpesaModal
          isOpen={isMpesaModalOpen}
          onClose={() => setIsMpesaModalOpen(false)}
          title={`Consultation Slot (${selectedDate} @ ${selectedTime})`}
          amount={CONSULTATION_FEE_KES}
          transactionType="CONSULTATION_BOOKING"
          onSuccess={handleUpfrontMpesaSuccess}
        />
      )}
    </div>
  );
};
