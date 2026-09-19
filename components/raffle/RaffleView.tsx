"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Trophy,
  Calendar,
  Users,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Flame,
  ArrowRight,
} from "lucide-react";

interface LedgerItem {
  id: string;
  month: number;
  year: number;
  totalRemoteHours: number;
  poolHours: number;
  awardedHours: number;
  status: string;
  createdAt: string;
  winner: {
    id: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    is_subscribed: boolean;
  };
}

interface CurrentMetrics {
  month: number;
  year: number;
  currentRemoteHours: number;
  liveEstimatedPoolHours: number;
  eligibleUsersCount: number;
}

export const RaffleView: React.FC = () => {
  const { dbUser } = useAuth();
  const [ledgers, setLedgers] = useState<LedgerItem[]>([]);
  const [metrics, setMetrics] = useState<CurrentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [cronRunning, setCronRunning] = useState(false);
  const [latestResult, setLatestResult] = useState<any | null>(null);

  const fetchLedgers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/raffle/ledger");
      if (res.ok) {
        const data = await res.json();
        setLedgers(data.ledgers || []);
        setMetrics(data.currentMonthMetrics || null);
      }
    } catch (err) {
      console.error("Failed to load raffle ledgers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  const triggerCronRun = async () => {
    try {
      setCronRunning(true);
      setLatestResult(null);

      // Trigger the background cron endpoint with force override
      const res = await fetch("/api/cron/raffle?force=true", {
        method: "POST",
      });
      const data = await res.json();
      setLatestResult(data);

      if (data.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#f37a2b", "#d4af37", "#10b981"],
        });
        await fetchLedgers();
      }
    } catch (err) {
      console.error("Cron trigger failed:", err);
    } finally {
      setCronRunning(false);
    }
  };

  const isCurrentUserEligible = dbUser && !dbUser.is_subscribed;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] uppercase tracking-widest font-bold text-brand-400">
            Automated Community Giveback
          </span>
          <span className="text-[9px] bg-brand-500/20 text-brand-300 font-bold px-1.5 py-0.5 rounded-full border border-brand-500/30">
            Cron Engine
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mt-0.5">
          5% Remote Consultation Raffle
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Every month, 5% of all completed remote hours are calculated by an automated background cron job, randomly awarding a 1-hour session to a non-subscribed user.
        </p>
      </div>

      {/* User Eligibility Card */}
      <div className="p-4 rounded-2xl bg-chef-card border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isCurrentUserEligible
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Your Raffle Status</p>
            <p className="text-[11px] text-slate-400">
              {dbUser ? (
                isCurrentUserEligible ? (
                  <span className="text-emerald-400 font-medium">
                    Eligible for next draw (Registered & Non-Subscribed)
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium">
                    Pro Subscriber (Raffle reserved for non-subscribed foodies)
                  </span>
                )
              ) : (
                "Sign in with Google, Facebook, or Phone to be eligible"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-chef-card border border-white/5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Formula Basis
            </span>
            <Clock className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-xl font-black text-white">
            {metrics ? `${metrics.currentRemoteHours}h` : "60h"}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Remote hours logged
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-chef-card border border-white/5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              5% Community Pool
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-black text-amber-400">
            {metrics ? `${metrics.liveEstimatedPoolHours}h` : "3.0h"}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Accumulated for rewards
          </p>
        </div>
      </div>

      {/* Interactive Cron Trigger Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-brand-950/80 to-chef-card border border-brand-500/30 shadow-xl space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-400">
              Live Background Job Dispatcher
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Execute Monthly Raffle Calculation
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Triggers the backend calculation: queries previous calendar month’s remote consultation hours, computes 5%, selects a registered non-subscribed winner, and issues a 1-hour session into <code className="text-brand-300">RaffleLedger</code>.
            </p>
          </div>
        </div>

        <button
          onClick={triggerCronRun}
          disabled={cronRunning}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-500/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {cronRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Calculating Remote Hours & Drawing Winner...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Cron Job Now (`/api/cron/raffle`)</span>
            </>
          )}
        </button>

        {/* Latest Execution Banner */}
        {latestResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3.5 rounded-2xl text-xs border ${
              latestResult.success
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/15 border-amber-500/30 text-amber-300"
            }`}
          >
            <div className="flex items-center space-x-2 mb-1.5 font-bold">
              {latestResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span>{latestResult.message}</span>
            </div>

            {latestResult.winner && (
              <div className="mt-2 pt-2 border-t border-white/10 space-y-1 text-[11px]">
                <p>
                  <strong>Lucky Winner:</strong>{" "}
                  {latestResult.winner.displayName || latestResult.winner.email}
                </p>
                <p>
                  <strong>Total Remote Hours Evaluated:</strong>{" "}
                  {latestResult.totalRemoteHours}h
                </p>
                <p>
                  <strong>5% Calculated Pool:</strong> {latestResult.poolHours}h
                </p>
                <p>
                  <strong>Awarded Session:</strong> {latestResult.awardedHours}h
                  Complimentary Remote Consultation
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Historical Raffle Ledger Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Raffle Ledger Audit Trail</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            {ledgers.length} Records
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <span className="text-xs">Loading audit ledger...</span>
          </div>
        ) : ledgers.length === 0 ? (
          <div className="p-6 rounded-2xl bg-chef-card border border-white/5 text-center text-slate-400 text-xs">
            No raffle runs logged yet. Click "Run Cron Job Now" above to trigger your first monthly draw.
          </div>
        ) : (
          <div className="space-y-2.5">
            {ledgers.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-chef-card border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-400" />
                    <span>
                      Month {item.month}/{item.year}
                    </span>
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 font-bold text-xs flex items-center justify-center">
                      {item.winner?.displayName?.[0] || "W"}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {item.winner?.displayName || "Anonymous Foodie"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {item.winner?.phoneNumber || item.winner?.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-brand-400">
                      +{item.awardedHours}h Free Session
                    </p>
                    <p className="text-[10px] text-slate-500">
                      5% of {item.totalRemoteHours}h ({item.poolHours}h pool)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
