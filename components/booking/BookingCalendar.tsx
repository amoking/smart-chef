"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { MpesaModal } from "@/components/mpesa/MpesaModal";
import {
  Calendar,
  Lock,
  Unlock,
  Video,
  MapPin,
  Building2,
  Phone,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Users,
  Compass,
} from "lucide-react";

interface BookingCalendarProps {
  googleAppointmentUrl?: string;
  onOpenAuth?: () => void;
  onBookingConfirmed?: () => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  googleAppointmentUrl = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0W65vMockScheduleForDev?gv=true",
  onOpenAuth,
  onBookingConfirmed,
}) => {
  const { dbUser, refreshDbUser } = useAuth();

  // State
  const [hasConfirmedBooking, setHasConfirmedBooking] = useState(false);
  const [checkingBookings, setCheckingBookings] = useState(false);
  const [isInterceptModalOpen, setIsInterceptModalOpen] = useState(false);
  const [activeModalView, setActiveModalView] = useState<"CHOICES" | "ON_SITE_FORM">("CHOICES");
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);

  // On-Site Visit Form State
  const [establishmentName, setEstablishmentName] = useState("");
  const [establishmentType, setEstablishmentType] = useState("Restaurant");
  const [locationAddress, setLocationAddress] = useState("");
  const [contactPhone, setContactPhone] = useState(dbUser?.phoneNumber || "");
  const [staffSize, setStaffSize] = useState("1 - 5 staff");
  const [visitScope, setVisitScope] = useState("Menu Formulation & Kitchen Audit");
  const [submittingOnSite, setSubmittingOnSite] = useState(false);
  const [onSiteSuccess, setOnSiteSuccess] = useState(false);

  // 1. Check if user has an active subscription or a confirmed booking
  useEffect(() => {
    if (!dbUser?.id) {
      setHasConfirmedBooking(false);
      return;
    }

    const checkUserBookings = async () => {
      try {
        setCheckingBookings(true);
        const res = await fetch(`/api/bookings?userId=${dbUser.id}`);
        if (res.ok) {
          const data = await res.json();
          const confirmed = data.bookings?.some(
            (b: any) => b.status === "CONFIRMED" || b.status === "COMPLETED"
          );
          setHasConfirmedBooking(Boolean(confirmed));
        }
      } catch (err) {
        console.error("Failed to check user bookings:", err);
      } finally {
        setCheckingBookings(false);
      }
    };

    checkUserBookings();
  }, [dbUser?.id]);

  // Access Condition: User has active subscription OR has at least one confirmed booking
  const hasAccess = Boolean(dbUser?.is_subscribed || hasConfirmedBooking);

  // Handler when user taps on the transparent overlay
  const handleInterceptTap = () => {
    if (!hasAccess) {
      setActiveModalView("CHOICES");
      setIsInterceptModalOpen(true);
    }
  };

  // Handle M-Pesa Kshs 2,000 Payment Success
  const handleRemotePaymentSuccess = async () => {
    setIsMpesaModalOpen(false);
    setIsInterceptModalOpen(false);
    await refreshDbUser();

    // Create a confirmed 1-hour remote booking credit in database
    if (dbUser?.id) {
      try {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 3);
        await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: dbUser.id,
            type: "REMOTE",
            title: "1-Hour Remote Consultation & Monthly Course Access",
            durationHours: 1.0,
            scheduledAt: nextWeek.toISOString(),
            notes: "Paid via M-Pesa Kshs. 2,000 Daraja STK Push.",
          }),
        });
        setHasConfirmedBooking(true);
      } catch (e) {
        console.error("Error creating credit booking:", e);
      }
    }

    if (onBookingConfirmed) onBookingConfirmed();
  };

  // Submit On-Site Visit Request
  const handleOnSiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser?.id) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setSubmittingOnSite(true);
    try {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 5);

      const notesContent = `Establishment: ${establishmentName} (${establishmentType})\nLocation: ${locationAddress}\nContact: ${contactPhone}\nKitchen Staff Size: ${staffSize}\nScope: ${visitScope}`;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: dbUser.id,
          type: "FACE_TO_FACE",
          title: `On-Site Kitchen Visit: ${establishmentName}`,
          durationHours: 3.0,
          scheduledAt: scheduledDate.toISOString(),
          notes: notesContent,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit on-site visit request");

      setOnSiteSuccess(true);
      setHasConfirmedBooking(true);
      if (onBookingConfirmed) onBookingConfirmed();

      setTimeout(() => {
        setIsInterceptModalOpen(false);
        setOnSiteSuccess(false);
      }, 2500);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error submitting request");
    } finally {
      setSubmittingOnSite(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-bold text-white">
            Google Appointment Schedule
          </span>
        </div>

        {hasAccess ? (
          <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <Unlock className="w-3 h-3" />
            <span>Unlocked</span>
          </span>
        ) : (
          <span className="flex items-center space-x-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
            <Lock className="w-3 h-3" />
            <span>Tap to Unlock</span>
          </span>
        )}
      </div>

      {/* Access Explanation Pill */}
      {!hasAccess && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-brand-950/80 via-chef-card to-chef-dark border border-brand-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-[11px]">
                Pre-Booking Verification Required
              </p>
              <p className="text-[10px] text-slate-400">
                Tap calendar to select Remote (Kshs. 2,000) or request an On-Site Visit.
              </p>
            </div>
          </div>
          <button
            onClick={handleInterceptTap}
            className="text-[10px] font-bold bg-brand-500 hover:bg-brand-600 text-white px-2.5 py-1.5 rounded-xl shadow shrink-0"
          >
            Options
          </button>
        </div>
      )}

      {/* Calendar Frame Container with Transparent Intercept Overlay */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-chef-card shadow-2xl">
        {/* Transparent Overlay: Intercepts clicks if user does not have active subscription or confirmed booking */}
        {!hasAccess && (
          <div
            onClick={handleInterceptTap}
            className="absolute inset-0 z-20 cursor-pointer bg-black/10 hover:bg-black/20 backdrop-blur-[1px] transition-all flex flex-col items-center justify-center p-4 text-center group"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-3 rounded-2xl bg-chef-dark/95 border border-brand-500/50 shadow-2xl flex items-center space-x-3 pointer-events-none"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-glow">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                  Tap to Unlock Appointment Slots
                </p>
                <p className="text-[10px] text-slate-400">
                  Remote Consultation (Kshs. 2,000) • On-Site Request
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Embedded Google Appointment Schedule iframe */}
        <div className="w-full h-[480px] bg-slate-900 relative">
          <iframe
            src={googleAppointmentUrl}
            className="w-full h-full border-0 rounded-3xl"
            title="Google Appointment Schedule"
            loading="lazy"
          />

          {/* Fallback simulation graphic if Google Calendar iframe is in sandbox/local preview */}
          <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#141620] to-[#0c0d12]">
            <Calendar className="w-12 h-12 text-brand-400/50 mb-3" />
            <h4 className="text-sm font-bold text-white">Google Appointment Schedule</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Live calendar slots loaded via Google Appointment Scheduling iframe.
            </p>
          </div>
        </div>
      </div>

      {/* Intercept Modal */}
      <AnimatePresence>
        {isInterceptModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInterceptModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-chef-dark border border-white/10 p-6 shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-black tracking-wider text-brand-400">
                  Chef Consultation Access
                </span>
                <button
                  onClick={() => setIsInterceptModalOpen(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {activeModalView === "CHOICES" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-white">
                      Select Consultation Format
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      To schedule a session on the calendar, choose your consultation format below:
                    </p>
                  </div>

                  {/* Choice 1: Remote Consultation */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#241710] to-chef-card border border-brand-500/40 shadow-xl space-y-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h4 className="text-sm font-bold text-white">
                              Remote Consultation
                            </h4>
                            <span className="text-[9px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 px-1.5 py-0.2 rounded">
                              Instant
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            1-Hour Live Video Call + 1-Month Course Access
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-1 border-t border-white/5">
                      <span className="text-xs text-slate-400">Total Fee:</span>
                      <span className="text-lg font-black text-brand-400">
                        Kshs. 2,000
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (!dbUser && onOpenAuth) {
                          onOpenAuth();
                          return;
                        }
                        setIsMpesaModalOpen(true);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Pay Kshs. 2,000 via M-Pesa & Unlock</span>
                    </button>
                  </div>

                  {/* Choice 2: On-Site Visit Request */}
                  <div className="p-4 rounded-2xl bg-chef-card border border-white/10 hover:border-emerald-500/40 shadow-xl space-y-3 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h4 className="text-sm font-bold text-white">
                              On-Site Visit Request
                            </h4>
                            <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                              In-Kitchen
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            Kitchen Layout Audit, Menu Formulation & Staff Training
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Ideal for restaurants, hotels, bakeries, or private culinary setups. Provide your location and establishment profile to schedule.
                    </p>

                    <button
                      onClick={() => setActiveModalView("ON_SITE_FORM")}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
                    >
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Submit Establishment Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* View 2: On-Site Visit Details Form */}
              {activeModalView === "ON_SITE_FORM" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveModalView("CHOICES")}
                      className="text-xs font-semibold text-brand-400 hover:text-brand-300"
                    >
                      ← Back to choices
                    </button>
                    <span className="text-[10px] text-slate-400">
                      Step 2 of 2
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">
                      Establishment Details
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tell our Executive Chef about your venue and location.
                    </p>
                  </div>

                  {onSiteSuccess ? (
                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                      <h4 className="text-sm font-bold text-white">
                        On-Site Request Submitted!
                      </h4>
                      <p className="text-xs text-slate-300">
                        Our culinary team will review your location details and contact you. Calendar unlocked!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleOnSiteSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Establishment Name
                        </label>
                        <input
                          type="text"
                          value={establishmentName}
                          onChange={(e) => setEstablishmentName(e.target.value)}
                          placeholder="e.g. Sankara Bistro / Karen Villa"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Venue Type
                          </label>
                          <select
                            value={establishmentType}
                            onChange={(e) => setEstablishmentType(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="Restaurant">Restaurant</option>
                            <option value="Hotel & Resort">Hotel & Resort</option>
                            <option value="Cloud Kitchen">Cloud Kitchen</option>
                            <option value="Bakery & Cafe">Bakery & Cafe</option>
                            <option value="Private Villa">Private Villa</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Staff Count
                          </label>
                          <select
                            value={staffSize}
                            onChange={(e) => setStaffSize(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="1 - 5 staff">1 - 5 staff</option>
                            <option value="6 - 15 staff">6 - 15 staff</option>
                            <option value="16+ staff">16+ staff</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Location & Physical Address
                        </label>
                        <input
                          type="text"
                          value={locationAddress}
                          onChange={(e) => setLocationAddress(e.target.value)}
                          placeholder="e.g. Westlands, Mpaka Road, Nairobi"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Direct Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+2547XXXXXXXX"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Primary Scope of Work
                        </label>
                        <input
                          type="text"
                          value={visitScope}
                          onChange={(e) => setVisitScope(e.target.value)}
                          placeholder="e.g. Swahili fusion menu redesign and chef coaching"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingOnSite}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                      >
                        {submittingOnSite ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Details...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm On-Site Request & Unlock Calendar</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* M-Pesa Kshs. 2,000 Checkout Modal */}
      {isMpesaModalOpen && (
        <MpesaModal
          isOpen={isMpesaModalOpen}
          onClose={() => setIsMpesaModalOpen(false)}
          title="1-Hour Remote Consultation + 1-Month Course Access"
          amount={2000}
          transactionType="COURSE_ACCESS"
          onSuccess={handleRemotePaymentSuccess}
        />
      )}
    </div>
  );
};
