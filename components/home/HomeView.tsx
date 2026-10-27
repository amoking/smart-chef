"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { TabType } from "@/components/layout/BottomNav";
import { CaseStudyHighlight } from "@/components/home/CaseStudyHighlight";
import {
  Video,
  MapPin,
  Sparkles,
  Crown,
  CheckCircle2,
  Calendar,
  Smartphone,
  Flame,
  ArrowUpRight,
  Clock,
  Briefcase,
  Building2,
  ShieldCheck,
} from "lucide-react";

interface HomeViewProps {
  onNavigate: (
    tab: TabType,
    roleMode?: "employee" | "employer" | "admin"
  ) => void;
  onOpenAuth: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenAuth,
}) => {
  const { user, dbUser } = useAuth();
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    // Load recent activity
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) setRecentBookings(data.bookings.slice(0, 3));
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#2a1710] via-chef-card to-chef-dark border border-brand-500/30 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest font-black text-brand-400 bg-brand-500/15 px-2 py-0.5 rounded-full border border-brand-500/20">
              Personal Culinary Concierge
            </span>
            <h2 className="text-xl font-black text-white">
              {dbUser ? `Welcome, ${dbUser.displayName || "Foodie"}` : "Welcome to Smart Chef"}
            </h2>
            <p className="text-xs text-slate-300">
              Master the kitchen with top-tier chefs, live remote coaching, and community perks.
            </p>
          </div>
        </div>

        {/* User Badges Strip */}
        <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-medium text-slate-300">
            <Crown
              className={`w-3.5 h-3.5 ${
                dbUser?.is_subscribed ? "text-amber-400 fill-amber-400" : "text-slate-500"
              }`}
            />
            <span>
              {dbUser?.is_subscribed ? "VIP Subscribed" : "Non-Subscribed Member"}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-medium text-slate-300">
            <Sparkles
              className={`w-3.5 h-3.5 ${
                dbUser?.has_course_access ? "text-emerald-400" : "text-slate-500"
              }`}
            />
            <span>
              {dbUser?.has_course_access ? "Course Pass: Active" : "Course Pass: None"}
            </span>
          </div>
        </div>
      </div>

      {/* 5% Community Raffle Callout */}
      <div
        onClick={() => onNavigate("raffle")}
        className="p-4 rounded-3xl bg-gradient-to-r from-brand-600/20 via-brand-500/15 to-transparent border border-brand-500/30 flex items-center justify-between cursor-pointer hover:border-brand-500/50 transition-all group shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                5% Remote Hours Community Raffle
              </h4>
              <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                Active Pool
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              5% of all previous month’s remote consultation hours are awarded to 1 non-subscribed user.
            </p>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-brand-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
      </div>

      {/* Prospective Employee Onboarding & Talent Hub Callout */}
      <div
        onClick={() => onNavigate("careers", "employee")}
        className="p-4 rounded-3xl bg-gradient-to-r from-emerald-600/20 via-teal-500/15 to-transparent border border-emerald-500/30 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition-all group shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                Prospective Employee Onboarding & Hub
              </h4>
              <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                Talent
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Register your Kenyan qualifications, capture a live headshot & access PE Training.
            </p>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
      </div>

      {/* Employer Recruitment Dashboard & AI Job Posting Callout */}
      <div
        onClick={() => onNavigate("careers", "employer")}
        className="p-4 rounded-3xl bg-gradient-to-r from-amber-600/20 via-brand-500/15 to-transparent border border-amber-500/30 flex items-center justify-between cursor-pointer hover:border-amber-500/50 transition-all group shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                Employer Hub & AI-Assisted Job Posting
              </h4>
              <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                5% Discount
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Onboard your facility, extract job requirements with AI & hire vetted staff.
            </p>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
      </div>

      {/* Admin Vetting & Placement Desk Callout */}
      <div
        onClick={() => onNavigate("careers", "admin")}
        className="p-4 rounded-3xl bg-gradient-to-r from-purple-600/20 via-indigo-500/15 to-transparent border border-purple-500/30 flex items-center justify-between cursor-pointer hover:border-purple-500/50 transition-all group shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                Admin Vetting & Placement Desk
              </h4>
              <span className="text-[9px] bg-purple-400/20 text-purple-300 px-1.5 py-0.2 rounded font-bold">
                Admin Only
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Verify CVs & references, approve 5% Work Placement jobs & manage pipeline stages.
            </p>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
      </div>

      {/* Expedition & Urban Consultancy Case Study Highlight */}
      <CaseStudyHighlight />

      {/* Quick Action Cards Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Quick Services
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Action 1: Remote Consultation */}
          <button
            onClick={() => onNavigate("consult")}
            className="p-4 rounded-2xl bg-chef-card border border-white/5 hover:border-brand-500/40 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-3 group-hover:bg-brand-500 group-hover:text-white transition-all">
              <Video className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Book Remote</h4>
            <p className="text-[10px] text-slate-400 mt-1">
              1-on-1 Live Chef Coaching (Counts towards 5% raffle)
            </p>
          </button>

          {/* Action 2: Face to Face */}
          <button
            onClick={() => onNavigate("consult")}
            className="p-4 rounded-2xl bg-chef-card border border-white/5 hover:border-emerald-500/40 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <MapPin className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Face-to-Face</h4>
            <p className="text-[10px] text-slate-400 mt-1">
              Private in-kitchen demonstration & dining
            </p>
          </button>

          {/* Action 3: Masterclasses & M-Pesa */}
          <button
            onClick={() => onNavigate("courses")}
            className="p-4 rounded-2xl bg-chef-card border border-white/5 hover:border-white/20 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              <Crown className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">VIP Subscription</h4>
            <p className="text-[10px] text-slate-400 mt-1">
              Safaricom Daraja STK Push integration
            </p>
          </button>

          {/* Action 4: Raffle Ledger */}
          <button
            onClick={() => onNavigate("raffle")}
            className="p-4 rounded-2xl bg-chef-card border border-white/5 hover:border-brand-500/40 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:bg-purple-500 group-hover:text-white transition-all">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Raffle Ledger</h4>
            <p className="text-[10px] text-slate-400 mt-1">
              Audit trail & automatic cron triggers
            </p>
          </button>
        </div>
      </div>

      {/* Recent Bookings Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Consultation Activity
          </h3>
          <button
            onClick={() => onNavigate("consult")}
            className="text-[11px] font-semibold text-brand-400 hover:text-brand-300"
          >
            Book Session +
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-4 rounded-2xl bg-chef-card border border-white/5 text-center text-xs text-slate-400">
            No active bookings yet. Book a remote or face-to-face session to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-2xl bg-chef-card border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      b.type === "REMOTE"
                        ? "bg-brand-500/20 text-brand-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {b.type === "REMOTE" ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{b.title}</h5>
                    <p className="text-[10px] text-slate-400">
                      {b.type === "REMOTE" ? "Remote Video" : "In-Person"} • {b.durationHours}h duration
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      b.isRaffleReward
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-white/5 text-slate-300"
                    }`}
                  >
                    {b.isRaffleReward ? "Raffle Prize" : b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
