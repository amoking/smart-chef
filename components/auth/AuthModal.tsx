"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, DbUserProfile } from "@/context/AuthContext";
import { PhoneOtpModal } from "./PhoneOtpModal";
import { X, Phone, Users, CheckCircle2, Shield } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableDemoUsers?: DbUserProfile[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  availableDemoUsers = [],
}) => {
  const { loginWithGoogle, loginWithFacebook, setDemoUser, error } = useAuth();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogle = async () => {
    try {
      setSocialLoading("google");
      setLocalError(null);
      await loginWithGoogle();
      onClose();
    } catch (err: unknown) {
      console.warn("Google sign-in exception:", err);
      setLocalError("Google sign-in initialized. Configure Firebase credentials in .env to complete production OAuth.");
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFacebook = async () => {
    try {
      setSocialLoading("facebook");
      setLocalError(null);
      await loginWithFacebook();
      onClose();
    } catch (err: unknown) {
      console.warn("Facebook sign-in exception:", err);
      setLocalError("Facebook sign-in initialized. Configure Facebook App ID in Firebase Console to complete production OAuth.");
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <>
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
            className="relative w-full max-w-sm rounded-3xl bg-chef-dark border border-white/10 p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                Welcome to Smart Chef
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              Sign In to Your Account
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Access culinary consultations, masterclasses, and enter the monthly 5% raffle.
            </p>

            {/* Error Message */}
            {(localError || error) && (
              <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                {localError || error}
              </div>
            )}

            {/* Social & Phone Buttons */}
            <div className="space-y-3">
              {/* Google Button */}
              <button
                onClick={handleGoogle}
                disabled={!!socialLoading}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all shadow-md active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Facebook Button */}
              <button
                onClick={handleFacebook}
                disabled={!!socialLoading}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-sm transition-all shadow-md active:scale-[0.98]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Continue with Facebook</span>
              </button>

              {/* Phone OTP Button */}
              <button
                onClick={() => setShowPhoneModal(true)}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm transition-all shadow-md active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Sign in with Phone (SMS OTP)</span>
              </button>
            </div>

            {/* Quick Demo Test Accounts */}
            {availableDemoUsers.length > 0 && (
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-3">
                  <Users className="w-3.5 h-3.5 text-brand-400" />
                  <span>Quick Demo Switcher (Simulate Any User):</span>
                </div>
                <div className="space-y-1.5">
                  {availableDemoUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setDemoUser(u);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-brand-500/10 border border-white/5 hover:border-brand-500/30 text-left transition-all group"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                          {u.displayName?.[0] || "U"}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-medium text-slate-200 group-hover:text-brand-300 truncate">
                            {u.displayName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {u.phoneNumber || u.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          u.is_subscribed
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {u.is_subscribed ? "Subscribed" : "Raffle Eligible"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Phone OTP Sub-modal */}
      <PhoneOtpModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSuccess={() => {
          setShowPhoneModal(false);
          onClose();
        }}
      />
    </>
  );
};
