"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { MpesaModal } from "@/components/mpesa/MpesaModal";
import {
  ChefHat,
  Crown,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  Lock,
  Unlock,
  Building,
  TrendingDown,
  Scale,
  ShieldCheck,
  Download,
  X,
  Smartphone,
  Flame,
  ArrowRight,
  Layers,
  Utensils,
  ConciergeBell,
  Shirt,
  Warehouse,
  ExternalLink,
} from "lucide-react";

/**
 * FIREBASE STORAGE MEDIA CONFIGURATION
 * Swap these placeholder URLs with real Firebase Storage download URLs later:
 * e.g. "https://firebasestorage.googleapis.com/v0/b/smart-chef-app.appspot.com/o/courses%2Fkitchen_portion_control.mp4?alt=media"
 */
export const FIREBASE_STORAGE_MEDIA = {
  // Generic video placeholder for training modules
  DEFAULT_VIDEO_PLACEHOLDER:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  // Generic image placeholders categorized by department
  KITCHEN_PORTION_HERO_IMAGE:
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
  KITCHEN_SAUCE_IMAGE:
    "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=800&q=80",
  SERVICE_ETIQUETTE_IMAGE:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  SERVICE_WINE_IMAGE:
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
  HOUSEKEEPING_LINEN_IMAGE:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  HOUSEKEEPING_INSPECTION_IMAGE:
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
  STORES_FIFO_IMAGE:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
  STORES_STOCKTAKE_IMAGE:
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
};

type TrainingCategory = "ALL" | "KITCHEN" | "SERVICES" | "HOUSEKEEPING" | "STORES";

interface TrainingCourse {
  id: string;
  title: string;
  category: "KITCHEN" | "SERVICES" | "HOUSEKEEPING" | "STORES";
  duration: string;
  lessonCount: number;
  highlightBadge?: string;
  description: string;
  keyOutcomes: string[];
  thumbnailUrl: string;
  videoStorageUrl: string;
  sopDocumentName: string;
  isFeatured?: boolean;
}

export const TRAINING_COURSES: TrainingCourse[] = [
  // 1. KITCHEN CATEGORY
  {
    id: "kitchen-01",
    title: "Standard Portion Sizes & Reducing Food Waste to 2% in 3 Weeks",
    category: "KITCHEN",
    duration: "45 Mins",
    lessonCount: 6,
    highlightBadge: "Top Priority SOP",
    isFeatured: true,
    description:
      "A rigorous operational framework for commercial head chefs: calibrate gram-accurate portion control scales, enforce batch mise-en-place formulas, and deploy daily bin-audit logs to drop kitchen food waste from 8-12% down to 2% within 21 days.",
    keyOutcomes: [
      "Calibrate digital portion scales for prep station line checks",
      "Standardize edible yield percentages on high-cost proteins",
      "Execute daily scrap audits & calculate plate cost variances",
      "Staff retraining script for zero-overportioning tolerance",
    ],
    thumbnailUrl: FIREBASE_STORAGE_MEDIA.KITCHEN_PORTION_HERO_IMAGE,
    videoStorageUrl: FIREBASE_STORAGE_MEDIA.DEFAULT_VIDEO_PLACEHOLDER,
    sopDocumentName: "SOP-KITCHEN-WASTE-REDUCTION-V3.pdf",
  },
  {
    id: "kitchen-02",
    title: "Classical Sauce Emulsion Chemistry & Heat Stabilization",
    category: "KITCHEN",
    duration: "32 Mins",
    lessonCount: 4,
    description:
      "Eliminate broken hollandaise, split pan sauces, and burnt velouté through temperature-controlled holding and starch gelatinization.",
    keyOutcomes: [
      "Stabilize butter emulsions across high-volume banqueting",
      "Proper holding vessel temperatures between 58°C and 63°C",
    ],
    thumbnailUrl: FIREBASE_STORAGE_MEDIA.KITCHEN_SAUCE_IMAGE,
    videoStorageUrl: FIREBASE_STORAGE_MEDIA.DEFAULT_VIDEO_PLACEHOLDER,
    sopDocumentName: "SOP-SAUCE-STABILIZATION.pdf",
  },

  // 2. SERVICES CATEGORY
  {
    id: "service-01",
    title: "Fine Dining Sequence of Service & Table Etiquette Mastery",
    category: "SERVICES",
    duration: "38 Mins",
    lessonCount: 5,
    highlightBadge: "Front of House",
    description:
      "Standardize front-of-house hospitality: synchronized plate placement, silent clearing techniques, crumbing tables, and VIP recognition.",
    keyOutcomes: [
      "3-minute initial greeting and water pouring protocol",
      "Order of precedence: heads of state, elders, and host deference",
      "Silver service tray carrying and silent clearance",
    ],
    thumbnailUrl: FIREBASE_STORAGE_MEDIA.SERVICE_ETIQUETTE_IMAGE,
    videoStorageUrl: FIREBASE_STORAGE_MEDIA.DEFAULT_VIDEO_PLACEHOLDER,
    sopDocumentName: "SOP-FINE-DINING-SERVICE.pdf",
  },
  {
    id: "service-02",
    title: "High-Margin Beverage Upselling & Sommelier Pairing Scripts",
    category: "SERVICES",
    duration: "28 Mins",
    lessonCount: 3,
    description:
      "Train floor staff on suggestive pairing psychology to increase per-cover beverage spend by 25% without appearing pushy.",
    keyOutcomes: [
      "Tasting note vocabulary that stimulates appetite",
      "Non-alcoholic premium mocktail positioning",
    ],
    thumbnailUrl: FIREBASE_STORAGE_MEDIA.SERVICE_WINE_IMAGE,
    videoStorageUrl: FIREBASE_STORAGE_MEDIA.DEFAULT_VIDEO_PLACEHOLDER,
    sopDocumentName: "SOP-WINE-UPSELLING-SCRIPTS.pdf",
  },

  // 3. HOUSEKEEPING & LAUNDRY CATEGORY
  {
    id: "housekeeping-01",
    title: "Commercial Linen Sanitization & Chemical Dilution Standards",
    category: "HOUSEKEEPING",
    duration: "40 Mins",
    lessonCount: 5,
    highlightBadge: "COSHH Compliant",
    description:
      "Zero-compromise hygiene: automated peristaltic pump dosing, thermal wash cycles at 71°C, and linen life-cycle extension protocols.",
    keyOutcomes: [
      "Precise chemical titration to avoid fabric yellowing",
      "Blood, wine, and cosmetic stain chemical neutralizers",
      "Linen inventory circulation ratios (3-par minimum rule)",
    ],
    thumbnailUrl: FIREBASE_STORAGE_MEDIA.HOUSEKEEPING_LINEN_IMAGE,
    videoStorageUrl: FIREBASE_STORAGE_MEDIA.DEFAULT_VIDEO_PLACEHOLDER,
    sopDocumentName: "SOP-LAUNDRY-COSHH-STANDARDS.pdf",
  },
  {
    id: "housekeeping-02",
    title: "Executive Suite 42-Point Turn-Down Inspection Checklist",
    category: "HOUSEKEEPING",
    duration: "25 Mins",
    lessonCount: 4,
    description:
      "Room inspection methodology for floor supervisors: black-light hygiene verification, mattress protection, and pillow puffing standards.",
    keyOutcomes: [
      "Clockwise corner-to-center room audit workflow",
      "Minibar seal audit and replenishment verification",
    ],
    thumbnailUrl: FIREBASE_STORAGE_MEDIA.HOUSEKEEPING_INSPECTION_IMAGE,
    videoStorageUrl: FIREBASE_STORAGE_MEDIA.DEFAULT_VIDEO_PLACEHOLDER,
    sopDocumentName: "SOP-ROOM-INSPECTION-42PT.pdf",
  },

  // 4. STORES CATEGORY
  {
    id: "stores-01",
    title: "FIFO Inventory Rotation & Cold Room Temperature Audits",
    category: "STORES",
    duration: "35 Mins",
    lessonCount: 4,
    highlightBadge: "Loss Prevention",
    description:
      "Prevent spoilage and pilferage in commercial dry stores and chillers: color-coded date tagging, walk-in thermometer logbooks, and cross-contamination buffers.",
    keyOutcomes: [
      "Strict first-in-first-out physical bin placement",
      "Defrost cycle monitoring and temperature alarms",
      "Dry store relative humidity management below 60%",
    ],
    thumbnailUrl: FIREBASE_STORAGE_MEDIA.STORES_FIFO_IMAGE,
    videoStorageUrl: FIREBASE_STORAGE_MEDIA.DEFAULT_VIDEO_PLACEHOLDER,
    sopDocumentName: "SOP-STORES-FIFO-ROTATION.pdf",
  },
  {
    id: "stores-02",
    title: "Weekly Stocktake Variance Reduction & Par-Level Automation",
    category: "STORES",
    duration: "30 Mins",
    lessonCount: 3,
    description:
      "Cut stock take discrepancies below 1% using barcode spot-audits, blind counting sheets, and supplier invoice verification.",
    keyOutcomes: [
      "Weight-based liquor inventory calculations",
      "Discrepancy reconciliation before month-end closing",
    ],
    thumbnailUrl: FIREBASE_STORAGE_MEDIA.STORES_STOCKTAKE_IMAGE,
    videoStorageUrl: FIREBASE_STORAGE_MEDIA.DEFAULT_VIDEO_PLACEHOLDER,
    sopDocumentName: "SOP-STOCKTAKE-VARIANCE-CONTROL.pdf",
  },
];

interface MemberDashboardProps {
  onOpenAuth?: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ onOpenAuth }) => {
  const { dbUser, refreshDbUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<TrainingCategory>("ALL");
  const [activeCourse, setActiveCourse] = useState<TrainingCourse | null>(null);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [metrics, setMetrics] = useState<{
    donated5PercentHours: number;
    totalFaceToFaceHours: number;
    businessesBenefited: number;
    month: string;
  }>({
    donated5PercentHours: 4.25,
    totalFaceToFaceHours: 85,
    businessesBenefited: 8,
    month: "Current Month",
  });

  // Load live dynamic 5% face-to-face giveback metrics
  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) {
          setMetrics({
            donated5PercentHours: data.metrics.donated5PercentHours,
            totalFaceToFaceHours: data.metrics.totalFaceToFaceHours,
            businessesBenefited: data.metrics.businessesBenefited,
            month: data.month || "Current Month",
          });
        }
      })
      .catch((err) => console.warn("Failed to load metrics:", err));
  }, []);

  const isSubscribed = Boolean(dbUser?.is_subscribed);

  const filteredCourses =
    selectedCategory === "ALL"
      ? TRAINING_COURSES
      : TRAINING_COURSES.filter((c) => c.category === selectedCategory);

  const categories = [
    { id: "ALL" as TrainingCategory, label: "All Modules", icon: Layers },
    { id: "KITCHEN" as TrainingCategory, label: "Kitchen", icon: Utensils },
    { id: "SERVICES" as TrainingCategory, label: "Services", icon: ConciergeBell },
    { id: "HOUSEKEEPING" as TrainingCategory, label: "Housekeeping", icon: Shirt },
    { id: "STORES" as TrainingCategory, label: "Stores", icon: Warehouse },
  ];

  return (
    <div className="space-y-6 pb-28">
      {/* Brand Top Identifier */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-black text-brand-400">
            Enterprise Member Portal
          </span>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <span>Smart Chefs Consultants</span>
          </h2>
        </div>
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Member Hub</span>
        </div>
      </div>

      {/* 1. HERO SECTION: ACTIVE SUBSCRIPTION STATUS TRACKING */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden rounded-3xl p-5 border shadow-2xl ${
          isSubscribed
            ? "bg-gradient-to-br from-[#2a1b10] via-[#1a130e] to-chef-card border-brand-500/50 shadow-brand-500/10"
            : "bg-gradient-to-br from-[#1c1d26] via-chef-card to-chef-dark border-white/10"
        }`}
      >
        {/* Glow ambient circle */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-brand-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                isSubscribed
                  ? "bg-amber-400 text-slate-950 shadow-amber-500/30 font-black"
                  : "bg-white/10 text-slate-400"
              }`}
            >
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Subscription Status
              </span>
              <h3 className="text-base font-black text-white">
                {isSubscribed
                  ? "Active VIP Executive Member"
                  : "Community Preview Member"}
              </h3>
            </div>
          </div>

          <span
            className={`text-[9px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full border ${
              isSubscribed
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
            }`}
          >
            {isSubscribed ? "● ACTIVE & UNLOCKED" : "UPGRADE REQUIRED"}
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {isSubscribed
            ? "Your hospitality membership includes full HD access to all 4 consulting departments: Kitchen Portion Control, Service Etiquette, Laundry/Housekeeping, and Stores."
            : "Unlock all standard operating procedures (SOPs), high-yield portion control modules, and downloadable PDF checklists with an active membership."}
        </p>

        {/* Member Details Strip */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px]">
          <div className="flex items-center space-x-3 text-slate-300">
            <span className="font-mono text-slate-400">
              ID: {dbUser?.id ? `SCC-${dbUser.id.slice(-6).toUpperCase()}` : "GUEST-SCC"}
            </span>
            <span>•</span>
            <span className="text-slate-300">
              {isSubscribed ? "Auto-Renew Active" : "Trial Access"}
            </span>
          </div>

          {!isSubscribed ? (
            <button
              onClick={() => {
                if (!dbUser && onOpenAuth) {
                  onOpenAuth();
                  return;
                }
                setIsMpesaModalOpen(true);
              }}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Unlock Full Access</span>
            </button>
          ) : (
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All 8 Modules Unlocked</span>
            </span>
          )}
        </div>
      </motion.div>

      {/* 2. DYNAMIC BANNER: 5% FACE-TO-FACE HOURS DONATED TO LOCAL BUSINESSES */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-r from-emerald-950/80 via-chef-card to-chef-dark border border-emerald-500/40 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Community Impact
                </span>
                <span className="text-[10px] text-slate-400">
                  {metrics.month}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">
                5% Face-to-Face Hours Donated to Local Businesses
              </h4>
            </div>
          </div>
        </div>

        {/* Dynamic Giveback Metrics Grid */}
        <div className="mt-3.5 grid grid-cols-3 gap-2 bg-black/30 rounded-2xl p-3 border border-white/5">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400">
              5% Donated Pool
            </span>
            <p className="text-base font-black text-emerald-400 mt-0.5">
              {metrics.donated5PercentHours} Hours
            </p>
            <p className="text-[9px] text-slate-500">Free Chef Mentorship</p>
          </div>

          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400">
              Total F2F Hours
            </span>
            <p className="text-base font-black text-white mt-0.5">
              {metrics.totalFaceToFaceHours}h
            </p>
            <p className="text-[9px] text-slate-500">On-Site Logged</p>
          </div>

          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400">
              SMEs Supported
            </span>
            <p className="text-base font-black text-amber-400 mt-0.5">
              {metrics.businessesBenefited} Venues
            </p>
            <p className="text-[9px] text-slate-500">Local Eateries</p>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-2.5 px-1">
          🤝 Every in-kitchen consultation booked contributes 5% pro-bono hours directly to local Kenyan SMEs, street bistros, and vocational youth kitchens.
        </p>
      </motion.div>

      {/* 3. MEDIA-RICH TRAINING LIBRARY GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400">
              Consulting Curriculums
            </span>
            <h3 className="text-lg font-black text-white">
              Media-Rich Training Library
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {filteredCourses.length} Curriculums
          </span>
        </div>

        {/* Category Tabs Switcher with Spring Indicator */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative px-3 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200 bg-chef-card border border-white/5"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="category-tab-pill"
                    className="absolute inset-0 bg-brand-500 rounded-2xl shadow-glow"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Courses Grid with Stagger Animation */}
        <div className="grid grid-cols-1 gap-4 pt-1">
          {filteredCourses.map((course) => {
            const isFeaturedPortionCourse = course.id === "kitchen-01";

            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={() => setActiveCourse(course)}
                className={`rounded-3xl border overflow-hidden cursor-pointer group transition-all duration-300 ${
                  isFeaturedPortionCourse
                    ? "bg-gradient-to-b from-[#2a1810] to-chef-card border-brand-500 shadow-xl shadow-brand-500/10"
                    : "bg-chef-card border-white/5 hover:border-white/20"
                }`}
              >
                {/* Thumbnail Image Container with Video Play Overlay */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chef-card via-black/40 to-transparent" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Badges Top Strip */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {course.category}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      {course.highlightBadge && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-brand-500 text-white shadow">
                          {course.highlightBadge}
                        </span>
                      )}
                      <div className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-slate-200 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-brand-400" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Food Waste 2% Target Callout Banner on Featured Card */}
                  {isFeaturedPortionCourse && (
                    <div className="absolute bottom-2.5 left-3 right-3 p-2 rounded-xl bg-brand-950/90 border border-brand-500/40 backdrop-blur-md flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-[11px] font-bold text-white">
                          Target: Drop Food Waste to 2% within 3 Weeks
                        </span>
                      </div>
                      <Scale className="w-3.5 h-3.5 text-brand-300" />
                    </div>
                  )}
                </div>

                {/* Course Content Information */}
                <div className="p-4 space-y-2.5">
                  <h4 className="text-base font-black text-white group-hover:text-brand-300 transition-colors leading-snug">
                    {course.title}
                  </h4>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Key Operational Outcomes */}
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    {course.keyOutcomes.slice(0, 2).map((outcome, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-1.5 text-[11px] text-slate-400"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{outcome}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-3 flex items-center justify-between border-t border-white/5">
                    <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{course.lessonCount} Modules + SOP PDF</span>
                    </span>

                    <div className="flex items-center space-x-1 text-xs font-bold text-brand-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Launch Training</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. MODAL: MEDIA PLAYER & SOP VIEWER */}
      <AnimatePresence>
        {activeCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCourse(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-chef-dark border border-white/10 p-5 shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {activeCourse.category}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {activeCourse.duration}
                  </span>
                </div>
                <button
                  onClick={() => setActiveCourse(null)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Media Video Player Placeholder */}
              <div className="rounded-2xl overflow-hidden bg-black border border-white/10 relative mb-4 shadow-xl">
                <video
                  controls
                  poster={activeCourse.thumbnailUrl}
                  className="w-full max-h-56 object-cover"
                >
                  <source src={activeCourse.videoStorageUrl} type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
              </div>

              {/* Course Meta */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-white">
                  {activeCourse.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeCourse.description}
                </p>

                {/* All Learning Outcomes */}
                <div className="p-3.5 rounded-2xl bg-chef-card border border-white/5 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Operational Deliverables & Standards:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {activeCourse.keyOutcomes.map((k, i) => (
                      <li
                        key={i}
                        className="text-[11px] text-slate-300 flex items-start space-x-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SOP Document Download Trigger */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 truncate">
                    <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">
                        {activeCourse.sopDocumentName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Official SOP Checklist (PDF Template)
                      </p>
                    </div>
                  </div>

                  <a
                    href={activeCourse.videoStorageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shrink-0 shadow"
                  >
                    Download
                  </a>
                </div>

                {/* Firebase Storage URL swap notice for developers */}
                <p className="text-[9px] text-slate-500 text-center font-mono">
                  Media Source: Swappable with real Firebase Storage bucket URLs in{" "}
                  <code>FIREBASE_STORAGE_MEDIA</code>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* M-Pesa Subscription Modal */}
      {isMpesaModalOpen && (
        <MpesaModal
          isOpen={isMpesaModalOpen}
          onClose={() => setIsMpesaModalOpen(false)}
          title="Smart Chefs Consultants - VIP Hospitality Membership"
          amount={4999}
          transactionType="SUBSCRIPTION"
          onSuccess={async () => {
            await refreshDbUser();
            setIsMpesaModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
