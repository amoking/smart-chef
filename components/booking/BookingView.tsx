"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Video,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  Sparkles,
  Loader2,
  ChevronRight,
} from "lucide-react";

import { BookingCalendar } from "./BookingCalendar";

interface BookingViewProps {
  onBookingCreated?: () => void;
  onOpenAuth: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  onBookingCreated,
  onOpenAuth,
}) => {
  const { dbUser } = useAuth();
  const [bookingMode, setBookingMode] = useState<"CALENDAR" | "FORM">("CALENDAR");
  const [bookingType, setBookingType] = useState<"REMOTE" | "FACE_TO_FACE">("REMOTE");
  const [duration, setDuration] = useState<number>(1.0);
  const [title, setTitle] = useState("Private Culinary Coaching");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("14:00");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser) {
      onOpenAuth();
      return;
    }

    setLoading(true);
    setSuccessMsg(null);

    try {
      const scheduledAt = new Date(`${date}T${time}:00Z`).toISOString();
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: dbUser.id,
          type: bookingType,
          title,
          durationHours: duration,
          scheduledAt,
          notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to book consultation");

      setSuccessMsg(
        bookingType === "REMOTE"
          ? `Remote consultation booked for ${duration}h! This will be included in the 5% monthly raffle pool.`
          : `Face-to-face consultation confirmed for ${duration}h.`
      );
      if (onBookingCreated) onBookingCreated();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Booking error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-widest font-bold text-brand-400">
          Personalized Mentorship
        </span>
        <h2 className="text-2xl font-black text-white mt-0.5">
          Book a Chef Consultation
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Select between live interactive remote video sessions or exclusive in-kitchen face-to-face masterclasses.
        </p>
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
          <span>Interactive Calendar</span>
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
          <span>Direct Form</span>
        </button>
      </div>

      {/* Interactive Google Appointment Schedule with Transparent Intercept Overlay */}
      {bookingMode === "CALENDAR" ? (
        <BookingCalendar
          onOpenAuth={onOpenAuth}
          onBookingConfirmed={onBookingCreated}
        />
      ) : (
        <>
          {/* Community Raffle Highlight Notice */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-950/70 to-chef-card border border-brand-500/30 flex items-start space-x-3 shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                <span>5% Community Giveback Policy</span>
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Every <strong>Remote consultation</strong> hour booked automatically adds <strong>5%</strong> towards our monthly community pool, gifting free 1-hour sessions to aspiring foodies!
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
        {/* Remote vs Face-to-Face Switcher */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Consultation Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Remote Card */}
            <button
              type="button"
              onClick={() => setBookingType("REMOTE")}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                bookingType === "REMOTE"
                  ? "bg-brand-500/15 border-brand-500 shadow-glow"
                  : "bg-chef-card border-white/5 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    bookingType === "REMOTE"
                      ? "bg-brand-500 text-white"
                      : "bg-white/5 text-slate-400"
                  }`}
                >
                  <Video className="w-4 h-4" />
                </div>
                {bookingType === "REMOTE" && (
                  <span className="text-[9px] font-black uppercase tracking-wider text-brand-400 bg-brand-500/20 px-1.5 py-0.5 rounded">
                    5% Raffle Pool
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white">Remote Video</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                1-on-1 HD Video & Recipe review
              </p>
            </button>

            {/* Face to Face Card */}
            <button
              type="button"
              onClick={() => setBookingType("FACE_TO_FACE")}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                bookingType === "FACE_TO_FACE"
                  ? "bg-emerald-500/15 border-emerald-500 shadow-lg"
                  : "bg-chef-card border-white/5 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    bookingType === "FACE_TO_FACE"
                      ? "bg-emerald-500 text-white"
                      : "bg-white/5 text-slate-400"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <h4 className="text-sm font-bold text-white">Face-to-Face</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                In-kitchen live chef demonstration
              </p>
            </button>
          </div>
        </div>

        {/* Duration Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Duration (Hours)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1.0, 1.5, 2.0, 3.0].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setDuration(h)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  duration === h
                    ? "bg-brand-500 text-white shadow-md"
                    : "bg-chef-card border border-white/5 text-slate-300 hover:bg-white/5"
                }`}
              >
                {h} {h === 1 ? "Hour" : "Hours"}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Preferred Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Time Slot
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              required
            />
          </div>
        </div>

        {/* Consultation Focus */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Focus Topic
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Pastry Lamination, Knife Skills, Sauce Chemistry"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Special Requests or Dietary Focus (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your kitchen setup, equipment, or culinary goals..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Confirming Consultation...</span>
            </>
          ) : (
            <>
              <span>Book {duration}h {bookingType === "REMOTE" ? "Remote" : "In-Person"} Session</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
        </>
      )}
    </div>
  );
};
