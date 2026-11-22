"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Store,
  Building2,
  Scale,
  ClipboardCheck,
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  GalleryHorizontal,
  Flame,
  Sprout,
  RefreshCw,
  Clock,
  ShieldCheck,
  FileCheck2,
  UtensilsCrossed,
} from "lucide-react";

export interface TurnaroundShowcasePhoto {
  src: string;
  title: string;
  tag: string;
  metric: string;
}

export const TURNAROUND_IMAGES: TurnaroundShowcasePhoto[] = [
  {
    src: "/images/kenya-estate-catering.jpg",
    title: "Estate Kitchens & Outside Caterers",
    tag: "Kitchen Control",
    metric: "≤ 2% Food Wastage",
  },
  {
    src: "/images/kenya-estate-service.jpg",
    title: "Local Cafés & Neighborhood Eateries",
    tag: "Service & Speed",
    metric: "3-Week Turnaround",
  },
  {
    src: "/images/kenya-catering-stores.jpg",
    title: "Unga, Oil & Market Stock Control",
    tag: "Zero-Excuse Stores",
    metric: "100% Accountability",
  },
];

export const EXPEDITION_IMAGES = TURNAROUND_IMAGES;

const BUSINESS_STAGES = [
  {
    icon: Flame,
    stage: "Struggling",
    fix: "Cut Waste & Leaks",
    accent: "text-red-400 bg-red-500/15 border-red-500/30",
  },
  {
    icon: Sprout,
    stage: "Establishing",
    fix: "Standardize Setup",
    accent: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  },
  {
    icon: RefreshCw,
    stage: "Stagnating",
    fix: "Boost Sales & Speed",
    accent: "text-amber-400 bg-amber-500/15 border-amber-500/30",
  },
];

const MANIFESTO_METRICS = [
  {
    icon: ShieldCheck,
    value: "18+ Yrs",
    label: "Kenyan Industry Pros",
    color: "text-brand-400",
  },
  {
    icon: Scale,
    value: "≤ 2%",
    label: "Wastage Target",
    color: "text-emerald-400",
  },
  {
    icon: Clock,
    value: "3 Weeks",
    label: "Full Implementation",
    color: "text-amber-400",
  },
  {
    icon: FileCheck2,
    value: "Kshs. 200",
    label: "Consultation Slot",
    color: "text-sky-400",
  },
];

export const CaseStudyHighlight: React.FC = () => {
  const [galleryMode, setGalleryMode] = useState<"masonry" | "carousel">("masonry");
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const handlePrevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? TURNAROUND_IMAGES.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) =>
      prev === TURNAROUND_IMAGES.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      aria-labelledby="turnaround-heading"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b130e] via-chef-card to-[#0e1916] border border-brand-500/35 p-4 sm:p-5 shadow-2xl space-y-4"
    >
      {/* =====================================================================
          1. HERO HEADER & 3 BUSINESS STAGE BADGES (Minimal Text, Visual Icons)
         ===================================================================== */}
      <div className="space-y-3 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black text-brand-300 bg-brand-500/15 px-2.5 py-1 rounded-full border border-brand-500/30">
            <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
            <span>One-Stop Catering & Hotel Turnaround</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3 h-3" />
            <span>Businesses Large & Small • Kenya</span>
          </span>
        </div>

        <h2
          id="turnaround-heading"
          className="text-lg sm:text-xl font-black text-white leading-tight tracking-tight"
        >
          Helping{" "}
          <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
            Struggling, Establishing & Stagnating
          </span>{" "}
          Catering Businesses Thrive
        </h2>

        {/* 3 Stage Visual Pills: Struggling | Establishing | Stagnating */}
        <div className="grid grid-cols-3 gap-2">
          {BUSINESS_STAGES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.stage}
                className="p-2.5 rounded-2xl bg-black/45 border border-white/10 flex items-center space-x-2"
              >
                <div
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${item.accent}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-black text-white block truncate">
                    {item.stage}
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold block truncate">
                    {item.fix}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          2. SPLIT-SCREEN JUXTAPOSITION:
             Left: Local Kenyan Estate Catering & Small Food Outlets (Primary Focus)
             Right: One Upmarket Nairobi City Centre Showcase
         ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch relative z-10">
        {/* LEFT: LOCAL KENYAN ESTATE CATERING & SMALL BUSINESSES (Grid / Slider) */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-emerald-500/40 bg-black/45 p-3 flex flex-col justify-between space-y-2.5 shadow-xl"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-extrabold text-emerald-300">
              <Store className="w-3 h-3 text-emerald-400" />
              <span>Estate Caterers & Local Outlets</span>
            </span>

            <div className="flex items-center bg-black/60 p-0.5 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setGalleryMode("masonry")}
                className={`px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1 transition-all ${
                  galleryMode === "masonry"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setGalleryMode("carousel")}
                className={`px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1 transition-all ${
                  galleryMode === "carousel"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <GalleryHorizontal className="w-3 h-3" />
                <span>Slide</span>
              </button>
            </div>
          </div>

          {galleryMode === "masonry" ? (
            <div className="grid grid-cols-2 gap-2">
              {TURNAROUND_IMAGES.map((img, index) => (
                <div
                  key={img.src}
                  onClick={() => {
                    setActiveSlide(index);
                    setGalleryMode("carousel");
                  }}
                  className={`group relative rounded-xl overflow-hidden border border-white/15 cursor-pointer ${
                    index === 0 ? "col-span-2 h-32 sm:h-36" : "col-span-1 h-32 sm:h-36"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <span className="absolute top-1.5 left-1.5 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/75 text-emerald-300 border border-emerald-500/30">
                    {img.metric}
                  </span>
                  <div className="absolute bottom-1.5 left-2 right-2">
                    <h4 className="text-[10px] font-black text-white truncate">
                      {img.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-emerald-500/30 bg-black/60 h-64 sm:h-72 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.img
                  key={TURNAROUND_IMAGES[activeSlide].src}
                  src={TURNAROUND_IMAGES[activeSlide].src}
                  alt={TURNAROUND_IMAGES[activeSlide].title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

              <div className="relative z-10 p-2.5 flex items-center justify-between">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 backdrop-blur-sm">
                  {TURNAROUND_IMAGES[activeSlide].metric}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-200 bg-black/60 px-2 py-0.5 rounded">
                  {activeSlide + 1}/{TURNAROUND_IMAGES.length}
                </span>
              </div>

              <div className="relative z-10 px-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="w-7 h-7 rounded-full bg-black/70 hover:bg-emerald-500 text-white hover:text-slate-950 border border-white/20 flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="w-7 h-7 rounded-full bg-black/70 hover:bg-emerald-500 text-white hover:text-slate-950 border border-white/20 flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative z-10 p-3">
                <h4 className="text-xs font-black text-white">
                  {TURNAROUND_IMAGES[activeSlide].title}
                </h4>
                <span className="text-[10px] text-emerald-300 font-bold">
                  {TURNAROUND_IMAGES[activeSlide].tag}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* RIGHT: ONE UPMARKET (CITY CENTRE) SHOWCASE */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="group relative rounded-2xl overflow-hidden border border-amber-500/35 bg-black/50 flex flex-col justify-between min-h-[260px] sm:min-h-[300px] shadow-xl"
        >
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
            alt="Upmarket Nairobi City Centre restaurant and hotel dining showcase"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/25" />

          <div className="relative z-10 p-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-500/40 text-[10px] font-extrabold text-amber-300">
              <Building2 className="w-3 h-3 text-amber-400" />
              <span>Upmarket City Centre Showcase</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[9px] font-bold text-slate-200 border border-white/10">
              <MapPin className="w-2.5 h-2.5 text-amber-400" />
              Nairobi CBD & Hotels
            </span>
          </div>

          <div className="relative z-10 p-3.5 space-y-2">
            <h3 className="text-sm font-black text-white">
              City Centre Restaurants, Hotels & Large Establishments
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/25 text-amber-200 border border-amber-500/40">
                <UtensilsCrossed className="w-2.5 h-2.5" /> High-Volume Controls
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-lg bg-black/65 text-slate-200 border border-white/15">
                <ClipboardCheck className="w-2.5 h-2.5 text-emerald-400" /> Permanent Report
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-lg bg-black/65 text-slate-200 border border-white/15">
                Follow-Up Audits
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =====================================================================
          3. MANIFESTO METRICS BAR (18+ Yrs • ≤ 2% Wastage • 3 Weeks • Kshs. 200)
         ===================================================================== */}
      <div className="grid grid-cols-4 gap-2 relative z-10">
        {MANIFESTO_METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="p-2.5 rounded-2xl bg-black/50 border border-white/10 text-center flex flex-col items-center justify-center"
            >
              <Icon className={`w-4 h-4 mb-1 ${m.color}`} />
              <span className="text-xs sm:text-sm font-black text-white leading-none">
                {m.value}
              </span>
              <span className="text-[9px] font-bold text-slate-400 mt-1 truncate w-full">
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default CaseStudyHighlight;
