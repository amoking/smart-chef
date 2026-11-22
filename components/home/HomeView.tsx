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
  ChefHat,
  UtensilsCrossed,
  Shirt,
  PackageCheck,
  CheckCircle2,
  Scale,
  TrendingDown,
  ClipboardList,
} from "lucide-react";

interface HomeViewProps {
  onNavigate: (
    tab: TabType,
    roleMode?: "employee" | "employer" | "admin"
  ) => void;
  onOpenAuth: () => void;
}

interface ManifestoDepartment {
  id: string;
  name: string;
  badge: string;
  icon: React.ElementType;
  image: string;
  accent: string;
  pills: string[];
}

const MANIFESTO_DEPARTMENTS: ManifestoDepartment[] = [
  {
    id: "kitchen",
    name: "1. Kitchen & Cost Control",
    badge: "≤ 2% Wastage in 3 Wks",
    icon: ChefHat,
    image: "/images/kenya-estate-catering.jpg",
    accent: "bg-brand-500 text-white border-brand-500/40",
    pills: [
      "Food Cost & Portion Control",
      "Curbing Wastage to ≤ 2%",
      "Standard Recipes",
      "Dead Stock & Overheads",
      "Stores-Kitchen Sync",
      "Food Analysis Reports",
    ],
  },
  {
    id: "services",
    name: "2. Service & Sales Staff",
    badge: "Speed & Standards",
    icon: UtensilsCrossed,
    image: "/images/kenya-estate-service.jpg",
    accent: "bg-emerald-500 text-slate-950 border-emerald-500/40",
    pills: [
      "Sales Tactics & Upselling",
      "Service Speed & Allocations",
      "Ambiance & Grooming",
      "Technical Table Skills",
      "Maintaining Standards",
      "Staff Work Plans",
    ],
  },
  {
    id: "housekeeping",
    name: "3. Housekeeping & Laundry",
    badge: "1-Day Ground Audit",
    icon: Shirt,
    image: "/images/kenya-housekeeping-linen.jpg",
    accent: "bg-sky-500 text-slate-950 border-sky-500/40",
    pills: [
      "Detergent Cost Control",
      "Linen & Bed Standards",
      "Floor & Public Area Care",
      "1-Day On-Ground Audit",
      "3-Week Live Training",
      "Room Turnaround Work Plan",
    ],
  },
  {
    id: "stores",
    name: "4. Stores & Accountability",
    badge: "Zero-Excuse Control",
    icon: PackageCheck,
    image: "/images/kenya-catering-stores.jpg",
    accent: "bg-amber-500 text-slate-950 border-amber-500/40",
    pills: [
      "Market Research & Purchases",
      "Receiving & Storing Controls",
      "Stock Levels & Re-Ordering",
      "Strict Issuing Accountability",
      "Zero Unexplained Shortages",
      "Permanent Solutions Report",
    ],
  },
];

interface SpotlightServiceSlide {
  id: string;
  title: string;
  badge: string;
  shortTag: string;
  icon: React.ElementType;
  image: string;
  accentClass: string;
  iconBgClass: string;
  onSelect: (onNavigate: HomeViewProps["onNavigate"]) => void;
}

const SPOTLIGHT_CAROUSEL_SERVICES: SpotlightServiceSlide[] = [
  {
    id: "talent-hub",
    title: "Prospective Employee Onboarding & Hub",
    badge: "Talent",
    shortTag: "KCSE/Diploma • Live Headshot • PE Training",
    icon: Briefcase,
    image: "/images/kenya-estate-catering.jpg",
    accentClass: "border-emerald-500/40 text-emerald-300",
    iconBgClass: "bg-emerald-500 text-slate-950",
    onSelect: (nav) => nav("careers", "employee"),
  },
  {
    id: "employer-hub",
    title: "Employer Hub & AI-Assisted Job Posting",
    badge: "5% Discount",
    shortTag: "AI Job Extractor • Map Pin • Hire Vetted Staff",
    icon: Building2,
    image: "/images/kenya-estate-service.jpg",
    accentClass: "border-amber-500/40 text-amber-300",
    iconBgClass: "bg-amber-500 text-slate-950",
    onSelect: (nav) => nav("careers", "employer"),
  },
  {
    id: "raffle-pool",
    title: "5% Remote Hours Community Raffle",
    badge: "Active Pool",
    shortTag: "Free Monthly 1-Hr Chef Session",
    icon: Sparkles,
    image: "/images/kenya-catering-stores.jpg",
    accentClass: "border-brand-500/40 text-brand-300",
    iconBgClass: "bg-brand-500 text-white",
    onSelect: (nav) => nav("raffle"),
  },
  {
    id: "admin-desk",
    title: "Admin Vetting & Placement Desk",
    badge: "Admin Only",
    shortTag: "CV Vetting • 5% Flags • Stage Pipeline",
    icon: ShieldCheck,
    image: "/images/kenya-housekeeping-linen.jpg",
    accentClass: "border-purple-500/40 text-purple-300",
    iconBgClass: "bg-purple-500 text-white",
    onSelect: (nav) => nav("careers", "admin"),
  },
];

const VISUAL_ACTION_CARDS = [
  {
    id: "ground-audit",
    title: "1-Day Ground Audit",
    badge: "Kshs. 200",
    icon: MapPin,
    image: "/images/kenya-estate-catering.jpg",
    color: "bg-emerald-500 text-slate-950",
    tab: "consult" as TabType,
  },
  {
    id: "remote-consult",
    title: "Remote Advisory",
    badge: "Kshs. 200",
    icon: Video,
    image: "/images/kenya-estate-service.jpg",
    color: "bg-brand-500 text-white",
    tab: "consult" as TabType,
  },
  {
    id: "refresher",
    title: "3-Week Training",
    badge: "Affordable",
    icon: Crown,
    image: "/images/kenya-catering-stores.jpg",
    color: "bg-amber-500 text-slate-950",
    tab: "courses" as TabType,
  },
  {
    id: "raffle",
    title: "5% Free Raffle",
    badge: "Estate SMEs",
    icon: Sparkles,
    image: "/images/kenya-housekeeping-linen.jpg",
    color: "bg-purple-500 text-white",
    tab: "raffle" as TabType,
  },
];

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { dbUser } = useAuth();
  const [selectedDeptId, setSelectedDeptId] = useState<string>("kitchen");
  const [carouselIdx, setCarouselIdx] = useState<number>(0);

  // Auto-advance the compact Spotlight Services Carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx((prev) =>
        prev === SPOTLIGHT_CAROUSEL_SERVICES.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeDept =
    MANIFESTO_DEPARTMENTS.find((d) => d.id === selectedDeptId) ||
    MANIFESTO_DEPARTMENTS[0];
  const ActiveDeptIcon = activeDept.icon;

  const currentService = SPOTLIGHT_CAROUSEL_SERVICES[carouselIdx];
  const CurrentServiceIcon = currentService.icon;

  return (
    <div className="space-y-5 pb-24">
      {/* =====================================================================
          1. HERO TURNAROUND SHOWCASE (Struggling / Establishing / Stagnating,
             Large & Small Kenyan Catering Businesses)
         ===================================================================== */}
      <CaseStudyHighlight />

      {/* =====================================================================
          2. 4-DEPARTMENT MANIFESTO TURNAROUND EXPLORER
             (Kitchen • Services • Housekeeping/Laundry • Stores)
         ===================================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
            4-Pillar Turnaround Areas (3-Week Program)
          </h3>
          <span className="text-[10px] font-bold text-emerald-400">
            Affordable Rates
          </span>
        </div>

        {/* 4 Department Selector Tabs with Icons */}
        <div className="grid grid-cols-4 gap-1.5">
          {MANIFESTO_DEPARTMENTS.map((dept) => {
            const Icon = dept.icon;
            const isSelected = dept.id === selectedDeptId;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDeptId(dept.id)}
                className={`p-2 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all ${
                  isSelected
                    ? "bg-brand-500/20 border-brand-400 text-white shadow-md"
                    : "bg-chef-card border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? "text-brand-400" : "text-slate-400"
                  }`}
                />
                <span className="text-[10px] font-extrabold truncate w-full">
                  {dept.name.replace(/^[0-9]+\.\s*/, "").split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Visual Department Card (Stock Image + Scannable Icon Pills) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDept.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="relative rounded-3xl overflow-hidden border border-white/15 bg-chef-card shadow-xl"
          >
            {/* Top Stock Image Banner */}
            <div className="relative h-32 sm:h-36 w-full overflow-hidden">
              <img
                src={activeDept.image}
                alt={activeDept.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-chef-card via-black/50 to-black/30" />

              <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${activeDept.accent}`}
                  >
                    <ActiveDeptIcon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-white">
                    {activeDept.name}
                  </h4>
                </div>
                <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-full bg-black/75 text-emerald-300 border border-emerald-500/40 shrink-0">
                  {activeDept.badge}
                </span>
              </div>
            </div>

            {/* 6 Compact Manifesto Solution Pills (Replaces long numbered lists) */}
            <div className="p-3.5 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeDept.pills.map((pill) => (
                <div
                  key={pill}
                  className="px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[10px] font-bold text-slate-200 truncate">
                    {pill}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =====================================================================
          3. IMAGE-BACKED QUICK ACTION GRID (Book Audit • Advisory • Training)
         ===================================================================== */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
            Book Turnaround & Training
          </h3>
          <span className="text-[10px] text-slate-400 font-semibold">
            Report + Follow-Ups Included
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
          4. COMPACT RECRUITMENT & COMMUNITY CAROUSEL
         ===================================================================== */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
            Staffing & Community Portals
          </h3>

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
              aria-label="Previous slide"
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
              aria-label="Next slide"
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
    </div>
  );
};
