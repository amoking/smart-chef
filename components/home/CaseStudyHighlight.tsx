"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  UtensilsCrossed,
  Tent,
  Quote,
  MapPin,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  GalleryHorizontal,
  Bird,
  ChefHat,
  Truck,
  Flame,
  Sparkles,
} from "lucide-react";

export interface ExpeditionPhoto {
  src: string;
  title: string;
  tag: string;
  caption: string;
}

export const EXPEDITION_IMAGES: ExpeditionPhoto[] = [
  {
    src: "/images/jungle-tent.jpg",
    title: "Off-Grid Mess Tent",
    tag: "Basecamp",
    caption: "Full canvas kitchen & dining hall in the bush.",
  },
  {
    src: "/images/jungle-chef.jpg",
    title: "Bush Chef Brigade",
    tag: "Catering",
    caption: "Hot buffet chafing line deep in the wild.",
  },
  {
    src: "/images/jungle-night.jpg",
    title: "Campfire Hospitality",
    tag: "Expat Team",
    caption: "Evening dining for the bird study expedition.",
  },
];

const VISUAL_PILLARS = [
  {
    icon: UtensilsCrossed,
    label: "Custom Menus",
    sub: "Field & Fine Dining",
    color: "text-brand-400 bg-brand-500/15 border-brand-500/30",
  },
  {
    icon: ChefHat,
    label: "Sourced Caterers",
    sub: "Vetted Bush Chefs",
    color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  },
  {
    icon: Truck,
    label: "Camp Logistics",
    sub: "Off-Grid Support",
    color: "text-amber-400 bg-amber-500/15 border-amber-500/30",
  },
  {
    icon: Bird,
    label: "Expat Bird Study",
    sub: "Kenyan Jungle",
    color: "text-sky-400 bg-sky-500/15 border-sky-500/30",
  },
];

export const CaseStudyHighlight: React.FC = () => {
  const [galleryMode, setGalleryMode] = useState<"masonry" | "carousel">("masonry");
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const handlePrevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? EXPEDITION_IMAGES.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) =>
      prev === EXPEDITION_IMAGES.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      aria-labelledby="case-study-heading"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17120e] via-chef-card to-[#0d1714] border border-brand-500/30 p-4 sm:p-5 shadow-2xl space-y-4"
    >
      {/* Compact Header + Visual Icon Strip */}
      <div className="space-y-2.5 relative z-10">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Action Showcase</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <Bird className="w-3.5 h-3.5" />
            <span>Expat Bird Expedition</span>
          </span>
        </div>

        <h2
          id="case-study-heading"
          className="text-lg sm:text-xl font-black text-white leading-tight tracking-tight"
        >
          From the Concrete Jungle to the{" "}
          <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
            Great Rift Valley
          </span>
        </h2>

        {/* Icon-Driven Capability Pills (Replaces heavy paragraph text) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
          {VISUAL_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.label}
                className="flex items-center space-x-2 p-2 rounded-2xl bg-black/40 border border-white/10"
              >
                <div
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${pillar.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-extrabold text-white block truncate">
                    {pillar.label}
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate">
                    {pillar.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          SPLIT-SCREEN VISUAL JUXTAPOSITION (Stacks on Mobile, 2-Col on Desktop)
         ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch relative z-10">
        {/* LEFT: SLEEK MODERN NAIROBI RESTAURANT */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="group relative rounded-2xl overflow-hidden border border-white/15 bg-black/50 flex flex-col justify-between min-h-[260px] sm:min-h-[300px] shadow-xl"
        >
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
            alt="Sleek modern fine-dining restaurant in Nairobi"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/20" />

          <div className="relative z-10 p-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-brand-500/40 text-[10px] font-extrabold text-brand-300">
              <UtensilsCrossed className="w-3 h-3 text-brand-400" />
              <span>Nairobi Luxury</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[9px] font-bold text-slate-200 border border-white/10">
              <MapPin className="w-2.5 h-2.5 text-brand-400" />
              City Center
            </span>
          </div>

          <div className="relative z-10 p-3.5 space-y-2">
            <h3 className="text-sm font-black text-white">
              Executive City Dining
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-lg bg-brand-500/25 text-brand-200 border border-brand-500/40">
                <Sparkles className="w-2.5 h-2.5" /> Fine Plating
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-lg bg-black/60 text-slate-200 border border-white/15">
                <ChefHat className="w-2.5 h-2.5 text-amber-400" /> Chef Brigades
              </span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: EXPEDITION MASONRY / CAROUSEL (/images/jungle-tent.jpg, /images/jungle-chef.jpg, /images/jungle-night.jpg) */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="rounded-2xl border border-emerald-500/35 bg-black/45 p-3 flex flex-col justify-between space-y-2.5 shadow-xl"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-extrabold text-emerald-300">
              <Tent className="w-3 h-3 text-emerald-400" />
              <span>Jungle Expedition</span>
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
                aria-label="Masonry Grid View"
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
                aria-label="Carousel View"
              >
                <GalleryHorizontal className="w-3 h-3" />
                <span>Slide</span>
              </button>
            </div>
          </div>

          {galleryMode === "masonry" ? (
            <div className="grid grid-cols-2 gap-2">
              {EXPEDITION_IMAGES.map((img, index) => (
                <div
                  key={img.src}
                  onClick={() => {
                    setActiveSlide(index);
                    setGalleryMode("carousel");
                  }}
                  className={`group relative rounded-xl overflow-hidden border border-white/15 cursor-pointer ${
                    index === 0 ? "col-span-2 h-32 sm:h-36" : "col-span-1 h-36 sm:h-40"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  <span className="absolute top-1.5 left-1.5 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/70 text-emerald-300 border border-emerald-500/30">
                    {img.tag}
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
                  key={EXPEDITION_IMAGES[activeSlide].src}
                  src={EXPEDITION_IMAGES[activeSlide].src}
                  alt={EXPEDITION_IMAGES[activeSlide].title}
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
                  {EXPEDITION_IMAGES[activeSlide].tag}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-200 bg-black/60 px-2 py-0.5 rounded">
                  {activeSlide + 1}/{EXPEDITION_IMAGES.length}
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
                  {EXPEDITION_IMAGES[activeSlide].title}
                </h4>
                <p className="text-[10px] text-slate-300 truncate">
                  {EXPEDITION_IMAGES[activeSlide].caption}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* =====================================================================
          PROMINENT STYLIZED QUOTE BLOCK (EXACT REQUIRED QUOTE)
         ===================================================================== */}
      <motion.blockquote
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="relative z-10 p-4 rounded-2xl bg-gradient-to-r from-brand-500/20 via-amber-500/15 to-emerald-500/20 border-l-4 border-brand-400 shadow-lg"
      >
        <Quote className="w-6 h-6 text-brand-400/40 absolute top-2.5 right-3 pointer-events-none" />
        <p className="text-xs sm:text-sm font-black italic text-white leading-relaxed pr-5">
          &ldquo;Whether you need to eliminate all the stress of catering and
          hospitality in the heart of Nairobi or while on an adventure or working
          in the middle of the jungle, we have you covered.&rdquo;
        </p>
      </motion.blockquote>
    </motion.section>
  );
};

export default CaseStudyHighlight;
