"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ConfirmationResult } from "firebase/auth";
import { Phone, ShieldCheck, ArrowLeft, Loader2, KeyRound } from "lucide-react";

interface PhoneOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PhoneOtpModal: React.FC<PhoneOtpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { setupRecaptcha, sendPhoneOtp, confirmPhoneOtp, error: authError } = useAuth();

  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phoneNumber, setPhoneNumber] = useState("+254");
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      // Initialize invisible reCAPTCHA on the container
      const verifier = setupRecaptcha("recaptcha-container");
      const result = await sendPhoneOtp(phoneNumber.trim(), verifier);
      setConfirmationResult(result);
      setStep("OTP");
    } catch (err: unknown) {
      console.error("Phone OTP send failed:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Could not send SMS OTP. Check Firebase configuration.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setErrorMessage(null);
    setLoading(true);

    try {
      await confirmPhoneOtp(confirmationResult, otpCode.trim());
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("OTP verification failed:", err);
      const msg = err instanceof Error ? err.message : "Invalid or expired OTP.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm rounded-3xl bg-chef-dark border border-white/10 p-6 shadow-2xl z-10"
        >
          {/* Back / Close button */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                if (step === "OTP") setStep("PHONE");
                else onClose();
              }}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-400">
              Firebase Phone Authentication
            </span>
            <div className="w-6" />
          </div>

          {/* reCAPTCHA anchor container required by Firebase */}
          <div id="recaptcha-container" />

          {step === "PHONE" ? (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Phone Sign-In</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your mobile number to receive a 6-digit OTP via SMS
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Phone Number (E.164 format)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+254712345678"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Example: +2547XXXXXXXX or international format
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !phoneNumber}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Requesting OTP...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Send 6-Digit Code</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Enter OTP Code</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Sent to <span className="text-slate-200 font-medium">{phoneNumber}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.4em] font-mono text-xl bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    autoFocus
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otpCode.length < 6}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Confirm & Sign In</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
