"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  UtensilsCrossed,
  Tent,
  Sparkles,
  Quote,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  GalleryHorizontal,
  ShieldCheck,
  Bird,
} from "lucide-react";

export interface ExpeditionPhoto {
  src: string;
  title: string;
  tag: string;
  caption: string;
  spanClass?: string;
}

export const EXPEDITION_IMAGES: ExpeditionPhoto[] = [
  {
    src: "/images/jungle-tent.jpg",
    title: "Remote Basecamp Mess Tent & Field Kitchen",
    tag: "Camp Infrastructure",
    caption:
      "Full-scale canvas dining hall and off-grid field kitchen erected deep in the Kenyan bush.",
    spanClass: "col-span-2 row-span-1 h-44 sm:h-48",
  },
  {
    src: "/images/jungle-chef.jpg",
    title: "Lead Expedition Chef & Chafing Service Line",
    tag: "Sourced Bush Caterers",
    caption:
      "Uniformed Smart Chefs culinary lead managing hot buffet chafing service and hygiene protocols.",
    spanClass: "col-span-1 row-span-2 h-56 sm:h-60",
  },
  {
    src: "/images/jungle-night.jpg",
    title: "Fireside Evening Dining Under the Canopy",
    tag: "After-Hours Hospitality",
    caption:
      "Expat ornithology research team unwinding after dusk birding surveys with warm camp hospitality.",
    spanClass: "col-span-1 row-span-2 h-56 sm:h-60",
  },
];

const DELIVERABLES = [
  {
    title: "Bespoke Expedition Menu Creation",
    detail:
      "High-energy dawn birding breakfasts, packable field lunches, and multi-course fireside dinners tailored to international expat dietary profiles.",
  },
  {
    title: "Specialist Caterer Sourcing & Vetting",
    detail:
      "Recruited, vetted, and deployed wilderness-tested chefs and camp stewards equipped for zero-grid culinary production.",
  },
  {
    title: "End-to-End Supporting Camp Services",
    detail:
      "Managed potable water treatment, mobile cold-storage resupply runs, chafing fuel logistics, and daily camp housekeeping.",
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      aria-labelledby="case-study-heading"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17120e] via-chef-card to-[#0d1714] border border-brand-500/30 p-5 sm:p-6 shadow-2xl space-y-6"
    >
      {/* Ambient Decorative Glows */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-56 h-56 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* =====================================================================
          SECTION HEADER & CASE STUDY NARRATIVE
         ===================================================================== */}
      <div className="space-y-3 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Field Logistics Case Study • Expat Bird Study Project</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            <Bird className="w-3 h-3" />
            <span>Ornithological Expedition</span>
          </span>
        </div>

        <motion.h2
          id="case-study-heading"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-lg sm:text-xl font-black text-white leading-tight tracking-tight"
        >
          From the Concrete Jungle to the{" "}
          <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
            Great Rift Valley
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="text-xs text-slate-300 leading-relaxed"
        >
          When an international team of <strong className="text-white">expat ornithologists and avian researchers</strong>{" "}
          embarked on a multi-week bird study expedition deep in the Kenyan jungle,
          they needed five-star culinary reliability miles from the nearest tarmac road.{" "}
          <strong className="text-brand-300">Smart Chefs Consultants</strong> engineered the entire
          expedition dining operation from the ground up — designing nutrient-dense
          menus, sourcing and deploying vetted bush caterers, and coordinating all
          supporting off-grid camp hospitality services so the scientists could focus
          purely on their research.
        </motion.p>
      </div>

      {/* =====================================================================
          SPLIT-SCREEN / TWO-COLUMN JUXTAPOSITION GRID (Stacks on Mobile)
          Left: Sleek Modern Nairobi Restaurant
          Right: Remote Jungle Expedition Masonry / Carousel
         ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch relative z-10">
        {/* -------------------------------------------------------------------
            LEFT SIDE: HIGH-END INNER-CITY NAIROBI DINING SETTING
           ------------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="group relative rounded-2xl overflow-hidden border border-white/15 bg-black/50 flex flex-col justify-between min-h-[290px] sm:min-h-[340px] shadow-xl"
        >
          {/* Sleek Modern Nairobi Restaurant Placeholder Image */}
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
            alt="Sleek modern fine-dining restaurant in Nairobi"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/30" />

          {/* Top Urban Setting Badge */}
          <div className="relative z-10 p-3.5 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-brand-500/40 text-[10px] font-extrabold text-brand-300">
              <UtensilsCrossed className="w-3 h-3 text-brand-400" />
              <span>01 • The Concrete Jungle</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-semibold text-slate-300 border border-white/10">
              <MapPin className="w-2.5 h-2.5 text-brand-400" />
              Nairobi Fine Dining
            </span>
          </div>

          {/* Bottom Urban Description Overlay */}
          <div className="relative z-10 p-4 space-y-2">
            <h3 className="text-sm font-black text-white">
              Sleek Inner-City Restaurants & Executive Kitchens
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              In the heart of Nairobi—from Westlands rooftops to Karen boutique
              hotels—we audit commercial kitchens, curate contemporary à la carte menus,
              and place Utalii-trained culinary brigades.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Fine Dining Plating
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-200">
                HACCP Kitchen Audits
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-200">
                Executive Chef Placement
              </span>
            </div>
          </div>
        </motion.div>

        {/* -------------------------------------------------------------------
            RIGHT SIDE: REMOTE JUNGLE EXPEDITION MASONRY GRID / CAROUSEL
            (/images/jungle-tent.jpg, /images/jungle-chef.jpg, /images/jungle-night.jpg)
           ------------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="rounded-2xl border border-emerald-500/35 bg-black/45 p-3.5 flex flex-col justify-between space-y-3 shadow-xl"
        >
          {/* Expedition Header & Masonry / Carousel View Toggle */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-extrabold text-emerald-300">
              <Tent className="w-3 h-3 text-emerald-400" />
              <span>02 • Kenyan Jungle Bird Expedition</span>
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
                title="Masonry Grid View"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Masonry</span>
              </button>
              <button
                type="button"
                onClick={() => setGalleryMode("carousel")}
                className={`px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1 transition-all ${
                  galleryMode === "carousel"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Carousel View"
              >
                <GalleryHorizontal className="w-3 h-3" />
                <span>Carousel</span>
              </button>
            </div>
          </div>

          {/* MODE A: RESPONSIVE MASONRY BENTO GRID */}
          {galleryMode === "masonry" && (
            <div className="grid grid-cols-2 gap-2.5">
              {EXPEDITION_IMAGES.map((img, index) => (
                <motion.div
                  key={img.src}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  onClick={() => {
                    setActiveSlide(index);
                    setGalleryMode("carousel");
                  }}
                  className={`group relative rounded-xl overflow-hidden border border-white/15 cursor-pointer ${
                    index === 0 ? "col-span-2 h-36 sm:h-40" : "col-span-1 h-44 sm:h-48"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                  <span className="absolute top-2 left-2 text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/70 text-emerald-300 border border-emerald-500/30">
                    {img.tag}
                  </span>

                  <div className="absolute bottom-2 left-2 right-2">
                    <h4 className="text-[11px] font-bold text-white leading-snug">
                      {img.title}
                    </h4>
                    <p className="text-[9px] text-slate-300 line-clamp-2 mt-0.5">
                      {img.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* MODE B: INTERACTIVE EXPEDITION CAROUSEL */}
          {galleryMode === "carousel" && (
            <div className="relative rounded-xl overflow-hidden border border-emerald-500/30 bg-black/60 h-72 sm:h-80 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.img
                  key={EXPEDITION_IMAGES[activeSlide].src}
                  src={EXPEDITION_IMAGES[activeSlide].src}
                  alt={EXPEDITION_IMAGES[activeSlide].title}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

              {/* Top Slide Counter & Tag */}
              <div className="relative z-10 p-3 flex items-center justify-between">
                <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 backdrop-blur-sm">
                  {EXPEDITION_IMAGES[activeSlide].tag}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-200 bg-black/60 px-2 py-0.5 rounded-md">
                  {activeSlide + 1} / {EXPEDITION_IMAGES.length}
                </span>
              </div>

              {/* Prev / Next Controls */}
              <div className="relative z-10 px-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Previous expedition image"
                  className="w-8 h-8 rounded-full bg-black/70 hover:bg-emerald-500 text-white hover:text-slate-950 border border-white/20 flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Next expedition image"
                  className="w-8 h-8 rounded-full bg-black/70 hover:bg-emerald-500 text-white hover:text-slate-950 border border-white/20 flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Caption */}
              <div className="relative z-10 p-3.5 space-y-1">
                <h4 className="text-xs font-black text-white">
                  {EXPEDITION_IMAGES[activeSlide].title}
                </h4>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  {EXPEDITION_IMAGES[activeSlide].caption}
                </p>
              </div>
            </div>
          )}

          <p className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
            <span>Expat Bird Study Basecamp • Rift Valley & Jungle Corridor</span>
            <button
              type="button"
              onClick={() =>
                setGalleryMode((m) => (m === "masonry" ? "carousel" : "masonry"))
              }
              className="text-emerald-400 hover:underline font-bold"
            >
              Switch to {galleryMode === "masonry" ? "Carousel" : "Masonry"}
            </button>
          </p>
        </motion.div>
      </div>

      {/* =====================================================================
          EXPEDITION LOGISTICAL PILLARS (Menus, Caterers, Supporting Services)
         ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 relative z-10">
        {DELIVERABLES.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
            className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1"
          >
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <h4 className="text-[11px] font-extrabold text-white">{item.title}</h4>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {item.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {/* =====================================================================
          PROMINENT STYLIZED QUOTE BLOCK (EXACT REQUIRED QUOTE)
         ===================================================================== */}
      <motion.blockquote
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="relative z-10 p-5 rounded-2xl bg-gradient-to-r from-brand-500/20 via-amber-500/15 to-emerald-500/20 border-l-4 border-brand-400 shadow-lg"
      >
        <Quote className="w-7 h-7 text-brand-400/40 absolute top-3 right-3 pointer-events-none" />
        <p className="text-xs sm:text-sm font-black italic text-white leading-relaxed tracking-wide pr-6">
          &ldquo;Whether you need to eliminate all the stress of catering and
          hospitality in the heart of Nairobi or while on an adventure or working
          in the middle of the jungle, we have you covered.&rdquo;
        </p>
        <footer className="mt-2.5 flex items-center justify-between text-[10px] font-bold text-amber-300">
          <span>— Smart Chefs Hospitality & Expedition Consultancy</span>
          <span className="text-emerald-300 font-semibold">
            Urban • Bush • Institutional
          </span>
        </footer>
      </motion.blockquote>
    </motion.section>
  );
};

export default CaseStudyHighlight;

