"use client";

import React, { useState, useEffect } from "react";
import { useAuth, DbUserProfile } from "@/context/AuthContext";
import {
  User as UserIcon,
  Crown,
  Sparkles,
  Phone,
  Mail,
  Receipt,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Users,
} from "lucide-react";

interface ProfileViewProps {
  onOpenAuth: () => void;
  availableDemoUsers?: DbUserProfile[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenAuth,
  availableDemoUsers = [],
}) => {
  const { dbUser, user, logout, setDemoUser, refreshDbUser } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (dbUser?.id) {
      fetch(`/api/users?id=${dbUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.transactions) {
            setTransactions(data.user.transactions);
          }
        })
        .catch((e) => console.error(e));
    }
  }, [dbUser?.id]);

  if (!dbUser && !user) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Not Signed In</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Sign in with Google, Facebook, or Phone OTP to access your personalized culinary dashboard.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/30"
        >
          Open Sign In Options
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Header Card */}
      <div className="p-5 rounded-3xl bg-chef-card border border-white/10 relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-xl font-black text-brand-300 overflow-hidden">
              {dbUser?.photoURL || user?.photoURL ? (
                <img
                  src={dbUser?.photoURL || user?.photoURL || ""}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                (dbUser?.displayName?.[0] || user?.displayName?.[0] || "U").toUpperCase()
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              {dbUser?.displayName || user?.displayName || "Smart Chef Member"}
            </h3>
            <p className="text-xs text-slate-400 flex items-center space-x-1.5">
              <Mail className="w-3 h-3 text-slate-500" />
              <span>{dbUser?.email || user?.email || "No email linked"}</span>
            </p>
            {dbUser?.phoneNumber && (
              <p className="text-xs text-slate-400 flex items-center space-x-1.5">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>{dbUser.phoneNumber}</span>
              </p>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-5 grid grid-cols-2 gap-2 pt-4 border-t border-white/5">
          <div
            className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
              dbUser?.is_subscribed
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-white/5 border-white/5 text-slate-400"
            }`}
          >
            <Crown className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] uppercase font-bold tracking-wider">
                Subscription
              </p>
              <p className="text-xs font-semibold truncate">
                {dbUser?.is_subscribed ? "PRO Subscribed" : "Non-Subscribed"}
              </p>
            </div>
          </div>

          <div
            className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
              dbUser?.has_course_access
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-white/5 border-white/5 text-slate-400"
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] uppercase font-bold tracking-wider">
                Masterclasses
              </p>
              <p className="text-xs font-semibold truncate">
                {dbUser?.has_course_access ? "Full Access" : "Not Enrolled"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Raffle Status Banner */}
      <div className="p-4 rounded-2xl bg-chef-card border border-white/5 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-brand-400">
            Monthly Raffle Eligibility
          </span>
          <p className="text-xs text-slate-300 mt-0.5">
            {!dbUser?.is_subscribed
              ? "✅ You are registered & non-subscribed — you are automatically eligible for the monthly 5% raffle!"
              : "⭐ You are a VIP Subscriber. The 5% free session raffle is reserved for non-subscribed members."}
          </p>
        </div>
      </div>

      {/* Switch Demo Profiles for pair-programming & verification */}
      {availableDemoUsers.length > 0 && (
        <div className="p-4 rounded-2xl bg-chef-card border border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <Users className="w-4 h-4 text-brand-400" />
            <span>Switch User Profile (Test Subscribed vs Non-Subscribed)</span>
          </div>
          <div className="space-y-1.5 pt-1">
            {availableDemoUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => setDemoUser(u)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                  dbUser?.id === u.id
                    ? "bg-brand-500/20 border border-brand-500/40 text-brand-300"
                    : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <span className="text-xs font-medium truncate">
                  {u.displayName} ({u.is_subscribed ? "Subscribed" : "Non-Subscribed"})
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    u.is_subscribed
                      ? "bg-amber-400/20 text-amber-300"
                      : "bg-emerald-400/20 text-emerald-300"
                  }`}
                >
                  {u.is_subscribed ? "PRO" : "Raffle Eligible"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* M-Pesa Daraja Transaction History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            <span>M-Pesa Daraja Transaction Logs</span>
          </h4>
          <span className="text-[11px] text-slate-500">
            {transactions.length} Logs
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-4 rounded-2xl bg-chef-card border border-white/5 text-center text-xs text-slate-400">
            No transactions found for this user. Initiate a payment from Masterclass tab.
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-2xl bg-chef-card border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-white">
                      {tx.transactionType}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        tx.status === "SUCCESS"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    Receipt: {tx.mpesaReceiptNumber || "Pending"} • Phone: {tx.phoneNumber}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-white">
                    KES {tx.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign Out Button */}
      <button
        onClick={() => logout()}
        className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-slate-300 hover:text-red-400 text-xs font-bold flex items-center justify-center space-x-2 transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};
