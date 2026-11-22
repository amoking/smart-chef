"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { MpesaModal } from "@/components/mpesa/MpesaModal";
import {
  Video,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  Sparkles,
  Loader2,
  ChevronRight,
  Timer,
  Smartphone,
  CreditCard,
} from "lucide-react";

import { BookingCalendar } from "./BookingCalendar";

interface BookingViewProps {
  onBookingCreated?: () => void;
  onOpenAuth: () => void;
}

const CONSULTATION_FEE_KES = 200;
const HOLD_DURATION_SECONDS = 15 * 60;

export const BookingView: React.FC<BookingViewProps> = ({
  onBookingCreated,
  onOpenAuth,
}) => {
  const { dbUser, refreshDbUser } = useAuth();
  const [bookingMode, setBookingMode] = useState<"CALENDAR" | "FORM">("CALENDAR");
  const [bookingType, setBookingType] = useState<"REMOTE" | "FACE_TO_FACE">("REMOTE");
  const [duration, setDuration] = useState<number>(1.0);
  const [title, setTitle] = useState("Kitchen Cost & 2% Wastage Turnaround");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("14:00");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Direct Form 15-Minute Hold & Payment Choice State
  const [formStep, setFormStep] = useState<"PICK_DATETIME" | "HOLD_PAYMENT">("PICK_DATETIME");
  const [holdSeconds, setHoldSeconds] = useState<number>(HOLD_DURATION_SECONDS);
  const [isMpesaOpen, setIsMpesaOpen] = useState(false);

  useEffect(() => {
    if (formStep !== "HOLD_PAYMENT") return;
    const timer = setInterval(() => {
      setHoldSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [formStep]);

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // Step 1: Secure Date & Time first (starts 15-minute lock timer)
  const handleSecureFormSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setHoldSeconds(HOLD_DURATION_SECONDS);
    setFormStep("HOLD_PAYMENT");
  };

  // Step 2: Finalize booking either via Upfront M-Pesa (Kshs. 200) or Pay Later
  const finalizeFormBooking = async (paymentOption: "UPFRONT" | "PAY_LATER") => {
    setLoading(true);
    try {
      const scheduledAt = new Date(`${date}T${time}:00Z`).toISOString();
      const paymentNote =
        paymentOption === "UPFRONT"
          ? `Paid Upfront: Kshs. ${CONSULTATION_FEE_KES} via M-Pesa`
          : `Pay Later: Kshs. ${CONSULTATION_FEE_KES} due before/at session`;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: dbUser?.id || null,
          type: bookingType,
          status: paymentOption === "UPFRONT" ? "CONFIRMED" : "PENDING_PAYMENT",
          title,
          durationHours: duration,
          scheduledAt,
          notes: notes ? `${notes} | ${paymentNote}` : paymentNote,
        }),
      });

      if (!res.ok) throw new Error("Failed to book consultation");

      setSuccessMsg(
        paymentOption === "UPFRONT"
          ? `Appointment locked in & paid (Kshs. ${CONSULTATION_FEE_KES}) for ${date} at ${time}!`
          : `Appointment locked in for ${date} at ${time}! You chose Pay Later (Kshs. ${CONSULTATION_FEE_KES}).`
      );
      setFormStep("PICK_DATETIME");
      if (onBookingCreated) onBookingCreated();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Booking error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-brand-400">
            Turnaround & Recruitment Consultations
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            Book a Chef Consultation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            1. Secure an available date & time first • 2. 15-min hold • 3. Pay Kshs. 200 upfront or later.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black shrink-0">
          Kshs. {CONSULTATION_FEE_KES}
        </span>
      </div>

      {/* Booking Mode Switcher */}
      <div className="flex rounded-2xl bg-chef-card border border-white/5 p-1">
        <button
          type="button"
          onClick={() => setBookingMode("CALENDAR")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            bookingMode === "CALENDAR"
              ? "bg-brand-500 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Interactive Slot Picker</span>
        </button>

        <button
          type="button"
          onClick={() => setBookingMode("FORM")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            bookingMode === "FORM"
              ? "bg-brand-500 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Custom Date & Time</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {bookingMode === "CALENDAR" ? (
        <BookingCalendar
          onOpenAuth={onOpenAuth}
          onBookingConfirmed={onBookingCreated}
        />
      ) : (
        <>
          {formStep === "PICK_DATETIME" ? (
            <form onSubmit={handleSecureFormSlot} className="space-y-4">
              {/* Remote vs Face-to-Face Switcher */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBookingType("REMOTE")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    bookingType === "REMOTE"
                      ? "bg-brand-500/15 border-brand-500 shadow-glow"
                      : "bg-chef-card border-white/5 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-brand-300">
                      Kshs. {CONSULTATION_FEE_KES}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Remote Video</h4>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingType("FACE_TO_FACE")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    bookingType === "FACE_TO_FACE"
                      ? "bg-emerald-500/15 border-emerald-500 shadow-lg"
                      : "bg-chef-card border-white/5 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-300">
                      Kshs. {CONSULTATION_FEE_KES}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">On-Site Audit</h4>
                </button>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Time Slot
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              {/* Focus Topic */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Focus Topic
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Venue / Turnaround Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your kitchen setup or staffing needs..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-xs shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Secure {date} @ {time} (Start 15-Min Hold)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-chef-card border border-amber-500/40 space-y-4"
            >
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Timer className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">
                    Slot Held for 15 Minutes ({date} @ {time})
                  </span>
                </div>
                <span className="font-mono font-black text-sm text-amber-300">
                  {formatCountdown(holdSeconds)}
                </span>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    if (!dbUser) {
                      onOpenAuth();
                      return;
                    }
                    setIsMpesaOpen(true);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Pay Upfront via M-Pesa
                  </span>
                  <span>Kshs. {CONSULTATION_FEE_KES}</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => finalizeFormBooking("PAY_LATER")}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    Lock In Slot & Pay Later
                  </span>
                  <span className="text-amber-300">
                    Kshs. {CONSULTATION_FEE_KES} Later →
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setFormStep("PICK_DATETIME")}
                className="text-[11px] text-slate-400 hover:text-white underline block mx-auto"
              >
                ← Change Date or Time
              </button>
            </motion.div>
          )}
        </>
      )}

      {isMpesaOpen && (
        <MpesaModal
          isOpen={isMpesaOpen}
          onClose={() => setIsMpesaOpen(false)}
          title={`${title} (${date} @ ${time})`}
          amount={CONSULTATION_FEE_KES}
          transactionType="CONSULTATION_BOOKING"
          onSuccess={async () => {
            setIsMpesaOpen(false);
            await refreshDbUser();
            await finalizeFormBooking("UPFRONT");
          }}
        />
      )}
    </div>
  );
};
