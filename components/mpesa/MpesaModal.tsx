"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { X, Smartphone, CheckCircle2, AlertCircle, Loader2, Zap } from "lucide-react";

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  transactionType: "SUBSCRIPTION" | "COURSE_ACCESS" | "CONSULTATION_BOOKING";
  onSuccess: () => void;
}

export const MpesaModal: React.FC<MpesaModalProps> = ({
  isOpen,
  onClose,
  title,
  amount,
  transactionType,
  onSuccess,
}) => {
  const { dbUser, refreshDbUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(
    dbUser?.phoneNumber || "254711223344"
  );
  const [loading, setLoading] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<
    "INPUT" | "PROMPTED" | "SUCCESS" | "FAILED"
  >("INPUT");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInitiateStk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser) {
      setErrorMessage("Please sign in or select a profile first.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: dbUser.id,
          phoneNumber,
          amount,
          transactionType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "STK push initiation failed");
      }

      setCheckoutRequestId(data.CheckoutRequestID);
      setStatusState("PROMPTED");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to initiate M-Pesa";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePinSuccess = async () => {
    if (!checkoutRequestId) return;
    setLoading(true);

    try {
      const res = await fetch("/api/mpesa/simulate-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutRequestId,
          success: true,
        }),
      });

      if (!res.ok) throw new Error("Simulation failed");

      setStatusState("SUCCESS");
      await refreshDbUser();
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Callback simulation failed";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm rounded-3xl bg-chef-dark border border-white/10 p-6 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <span className="text-[10px] font-black text-emerald-400">MP</span>
              </div>
              <span className="text-xs font-bold text-white">
                Safaricom Lipa Na M-Pesa
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {statusState === "INPUT" && (
            <div>
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/5 mb-5">
                <p className="text-xs text-slate-400 font-medium">Item to Pay</p>
                <h4 className="text-base font-bold text-white mt-0.5">{title}</h4>
                <div className="mt-3 flex items-baseline justify-between border-t border-white/5 pt-2">
                  <span className="text-xs text-slate-400">Total Payable:</span>
                  <span className="text-lg font-black text-emerald-400">
                    KES {amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <form onSubmit={handleInitiateStk} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    M-Pesa Safaricom Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="2547XXXXXXXX"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    An STK prompt will appear on this handset asking for your M-Pesa PIN.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !phoneNumber}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Dispatching STK Push...</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Send M-Pesa STK Prompt</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {statusState === "PROMPTED" && (
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Smartphone className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">
                STK Push Dispatched!
              </h4>
              <p className="text-xs text-slate-300 mt-2 px-2">
                Check phone <strong className="text-emerald-400">{phoneNumber}</strong> and enter your M-Pesa PIN.
              </p>

              <div className="my-5 p-3 rounded-2xl bg-white/5 border border-white/10 text-left">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Checkout Request ID:</span>
                  <span className="font-mono text-slate-300 truncate max-w-[150px]">
                    {checkoutRequestId}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Status:</span>
                  <span className="text-amber-400 font-medium">
                    Awaiting Safaricom Callback...
                  </span>
                </div>
              </div>

              {/* Instant Simulation Action */}
              <div className="space-y-2">
                <button
                  onClick={handleSimulatePinSuccess}
                  disabled={loading}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-xs shadow flex items-center justify-center space-x-1.5"
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>Simulate Customer Entered PIN (Daraja Callback)</span>
                </button>

                <button
                  onClick={() => setStatusState("INPUT")}
                  className="w-full py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel & Retry
                </button>
              </div>
            </div>
          )}

          {statusState === "SUCCESS" && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-white">Payment Confirmed!</h4>
              <p className="text-xs text-slate-300 mt-2">
                Daraja API callback successfully logged in the Transactions ledger.
              </p>
              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                {transactionType === "SUBSCRIPTION"
                  ? "PRO Subscription Activated"
                  : "Course Access Granted"}
              </div>

              <button
                onClick={onClose}
                className="mt-6 w-full py-3 rounded-xl bg-white text-slate-900 font-bold text-sm shadow hover:bg-slate-200 transition-all"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
