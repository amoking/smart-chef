"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { TabType } from "@/components/layout/BottomNav";
import { CaseStudyHighlight } from "@/components/home/CaseStudyHighlight";
import {
  Video,
  MapPin,
  Sparkles,
  Crown,
  ArrowUpRight,
  Briefcase,
  Building2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";

interface HomeViewProps {
  onNavigate: (
    tab: TabType,
    roleMode?: "employee" | "employer" | "admin"
  ) => void;
  onOpenAuth: () => void;
}

interface SpotlightServiceSlide {
  id: string;
  title: string;
  badge: string;
  shortTag: string;
  icon: React.ElementType;
  image: string;
  accentClass: string;
  iconBgClass: string;
  onSelect: (
    onNavigate: HomeViewProps["onNavigate"]
  ) => void;
}

const SPOTLIGHT_CAROUSEL_SERVICES: SpotlightServiceSlide[] = [
  {
    id: "talent-hub",
    title: "Talent Onboarding & Hub",
    badge: "Talent",
    shortTag: "KCSE/Diploma • Live Headshot • Training",
    icon: Briefcase,
    image: "/images/jungle-chef.jpg",
    accentClass: "border-emerald-500/40 text-emerald-300",
    iconBgClass: "bg-emerald-500 text-slate-950",
    onSelect: (nav) => nav("careers", "employee"),
  },
  {
    id: "employer-hub",
    title: "Employer & AI Job Hub",
    badge: "5% Discount",
    shortTag: "AI Job Extractor • Map Pin • Hire Staff",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80",
    accentClass: "border-amber-500/40 text-amber-300",
    iconBgClass: "bg-amber-500 text-slate-950",
    onSelect: (nav) => nav("careers", "employer"),
  },
  {
    id: "raffle-pool",
    title: "5% Remote Hours Raffle",
    badge: "Active Pool",
    shortTag: "Free Monthly 1-Hr Chef Session",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=700&q=80",
    accentClass: "border-brand-500/40 text-brand-300",
    iconBgClass: "bg-brand-500 text-white",
    onSelect: (nav) => nav("raffle"),
  },
  {
    id: "admin-desk",
    title: "Admin Placement Desk",
    badge: "Admin Only",
    shortTag: "CV Vetting • 5% Flags • Stage Pipeline",
    icon: ShieldCheck,
    image: "/images/jungle_action.jpg",
    accentClass: "border-purple-500/40 text-purple-300",
    iconBgClass: "bg-purple-500 text-white",
    onSelect: (nav) => nav("careers", "admin"),
  },
];

const VISUAL_ACTION_CARDS = [
  {
    id: "remote",
    title: "Remote Chef",
    badge: "Live Video",
    icon: Video,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
    color: "bg-brand-500 text-white",
    tab: "consult" as TabType,
  },
  {
    id: "in-person",
    title: "In-Person Dining",
    badge: "On-Site",
    icon: MapPin,
    image: "/images/jungle-night.jpg",
    color: "bg-emerald-500 text-slate-950",
    tab: "consult" as TabType,
  },
  {
    id: "vip",
    title: "VIP & Courses",
    badge: "M-Pesa STK",
    icon: Crown,
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
    color: "bg-amber-500 text-slate-950",
    tab: "courses" as TabType,
  },
  {
    id: "raffle",
    title: "5% Free Raffle",
    badge: "Monthly Draw",
    icon: Sparkles,
    image: "/images/jungle-tent.jpg",
    color: "bg-purple-500 text-white",
    tab: "raffle" as TabType,
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
}) => {
  const { dbUser } = useAuth();
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [carouselIdx, setCarouselIdx] = useState<number>(0);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) setRecentBookings(data.bookings.slice(0, 2));
      })
      .catch((e) => console.error(e));
  }, []);

  // Auto-advance the compact Spotlight Services Carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx((prev) =>
        prev === SPOTLIGHT_CAROUSEL_SERVICES.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentService = SPOTLIGHT_CAROUSEL_SERVICES[carouselIdx];
  const CurrentServiceIcon = currentService.icon;

  return (
    <div className="space-y-5 pb-24">
      {/* =====================================================================
          1. COMPACT VISUAL STATUS BAR (Minimal text, icon-driven)
         ===================================================================== */}
      <div className="px-4 py-3 rounded-2xl bg-chef-card/90 border border-white/10 flex items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/40 text-brand-400 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h1 className="text-xs sm:text-sm font-black text-white truncate">
              {dbUser ? `Chef ${dbUser.displayName || "Member"}` : "Smart Chefs Consultancy"}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[10px] font-bold ${
              dbUser?.is_subscribed
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                : "bg-white/5 border-white/10 text-slate-400"
            }`}
          >
            <Crown className="w-3 h-3" />
            <span>{dbUser?.is_subscribed ? "VIP" : "Free Tier"}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[10px] font-bold ${
              dbUser?.has_course_access
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-white/5 border-white/10 text-slate-400"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{dbUser?.has_course_access ? "Courses ✓" : "No Pass"}</span>
          </span>
        </div>
      </div>

      {/* =====================================================================
          2. HERO ACTION SHOWCASE: CASE STUDY HIGHLIGHT (Moved to Top!)
         ===================================================================== */}
      <CaseStudyHighlight />

      {/* =====================================================================
          3. IMAGE-BACKED QUICK ACTION GRID (Images + Icons, Minimal Text)
         ===================================================================== */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
            Book & Explore
          </h3>
          <span className="text-[10px] text-slate-500 font-semibold">
            Tap to launch
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {VISUAL_ACTION_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onNavigate(card.tab)}
                className="group relative h-28 sm:h-32 rounded-2xl overflow-hidden border border-white/10 hover:border-brand-500/50 text-left flex flex-col justify-between p-3 shadow-lg transition-all"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />

                <div className="relative z-10 flex items-center justify-between w-full">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shadow-md ${card.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/65 text-slate-200 border border-white/15">
                    {card.badge}
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="text-xs font-black text-white group-hover:text-brand-300 transition-colors">
                    {card.title}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          4. COMPACT MARKETPLACE & PERKS CAROUSEL
             (Replaces the 4 tall stacked banners with a sleek visual slider)
         ===================================================================== */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
            Recruitment & Community Portals
          </h3>

          {/* Carousel Dots & Prev/Next */}
          <div className="flex items-center space-x-1.5">
            {SPOTLIGHT_CAROUSEL_SERVICES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Slide ${idx + 1}: ${s.title}`}
                onClick={() => setCarouselIdx(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  carouselIdx === idx
                    ? "w-5 bg-brand-400"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
            <button
              type="button"
              aria-label="Previous portal slide"
              onClick={() =>
                setCarouselIdx((prev) =>
                  prev === 0 ? SPOTLIGHT_CAROUSEL_SERVICES.length - 1 : prev - 1
                )
              }
              className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              aria-label="Next portal slide"
              onClick={() =>
                setCarouselIdx((prev) =>
                  prev === SPOTLIGHT_CAROUSEL_SERVICES.length - 1 ? 0 : prev + 1
                )
              }
              className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Compact Single-Card Carousel + Quick Icon Strip */}
        <div className="relative h-24 rounded-2xl overflow-hidden border border-white/15 shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentService.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              onClick={() => currentService.onSelect(onNavigate)}
              className="relative w-full h-full flex items-center justify-between px-4 cursor-pointer group"
            >
              <img
                src={currentService.image}
                alt={currentService.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/45" />

              <div className="relative z-10 flex items-center space-x-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${currentService.iconBgClass}`}
                >
                  <CurrentServiceIcon className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs sm:text-sm font-black text-white truncate">
                      {currentService.title}
                    </h4>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-black/60 border shrink-0 ${currentService.accentClass}`}
                    >
                      {currentService.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-medium truncate mt-0.5">
                    {currentService.shortTag}
                  </p>
                </div>
              </div>

              <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 group-hover:bg-brand-500 text-white flex items-center justify-center transition-all shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mini 4-Icon Quick Selector Pill Bar under the Carousel */}
        <div className="grid grid-cols-4 gap-1.5">
          {SPOTLIGHT_CAROUSEL_SERVICES.map((item, idx) => {
            const Icon = item.icon;
            const isActive = carouselIdx === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCarouselIdx(idx);
                  item.onSelect(onNavigate);
                }}
                className={`py-2 px-2 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-white/15 border-white/30 text-white"
                    : "bg-chef-card border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          5. COMPACT RECENT BOOKINGS STRIP
         ===================================================================== */}
      {recentBookings.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Recent Sessions
            </h3>
            <button
              onClick={() => onNavigate("consult")}
              className="text-[10px] font-bold text-brand-400 hover:text-brand-300"
            >
              + Book
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="p-2.5 rounded-2xl bg-chef-card border border-white/5 flex items-center justify-between gap-2"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      b.type === "REMOTE"
                        ? "bg-brand-500/20 text-brand-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {b.type === "REMOTE" ? (
                      <Video className="w-3.5 h-3.5" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="truncate">
                    <h5 className="text-[11px] font-bold text-white truncate">
                      {b.title}
                    </h5>
                    <p className="text-[9px] text-slate-400">
                      {b.durationHours}h • {b.type === "REMOTE" ? "Remote" : "On-Site"}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-300 shrink-0">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
