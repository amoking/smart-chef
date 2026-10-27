"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  ChefHat,
  UtensilsCrossed,
  BellRing,
  Shirt,
  Truck,
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  UserCheck,
  GraduationCap,
  FileText,
  Sparkles,
  Video,
  Calendar,
  MapPin,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  BookOpen,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Award,
  Briefcase,
} from "lucide-react";

export type KenyanEducation = "KCPE" | "KCSE" | "Certificate" | "Diploma" | "Degree";

export interface JobCategoryOption {
  id: string;
  label: string;
  caption: string;
  department: string;
  requiresCv: boolean;
  badgeText: string;
  icon: React.ElementType;
  accentColor: string;
}

export const JOB_CATEGORIES: JobCategoryOption[] = [
  {
    id: "Chef",
    label: "Chef",
    caption: "Hot kitchen, pastry, commissary prep, menu execution & HACCP food safety.",
    department: "Kitchen",
    requiresCv: true,
    badgeText: "CV Required",
    icon: ChefHat,
    accentColor: "from-brand-500/25 to-amber-500/10 border-brand-500/40 text-brand-400",
  },
  {
    id: "Waitstaff",
    label: "Waitstaff",
    caption: "Fine dining table service, banquet hosting, mixology & guest relations.",
    department: "Services",
    requiresCv: false,
    badgeText: "Practical Assessment",
    icon: UtensilsCrossed,
    accentColor: "from-emerald-500/25 to-teal-500/10 border-emerald-500/40 text-emerald-400",
  },
  {
    id: "Receptionist",
    label: "Receptionist",
    caption: "Front desk check-in, reservations, PMS billing & concierge communication.",
    department: "Front Office",
    requiresCv: true,
    badgeText: "CV Required",
    icon: BellRing,
    accentColor: "from-sky-500/25 to-blue-500/10 border-sky-500/40 text-sky-400",
  },
  {
    id: "Laundry",
    label: "Laundry",
    caption: "Commercial linen care, uniform pressing, stain treatment & housekeeping.",
    department: "Housekeeping",
    requiresCv: false,
    badgeText: "Practical Assessment",
    icon: Shirt,
    accentColor: "from-purple-500/25 to-indigo-500/10 border-purple-500/40 text-purple-400",
  },
  {
    id: "Transport",
    label: "Transport",
    caption: "VIP guest transfers, cold-chain ingredient logistics & fleet dispatch.",
    department: "Logistics & Stores",
    requiresCv: true,
    badgeText: "CV + Valid DL Required",
    icon: Truck,
    accentColor: "from-amber-500/25 to-orange-500/10 border-amber-500/40 text-amber-400",
  },
];

const EDUCATION_LEVELS: {
  level: KenyanEducation;
  title: string;
  subtitle: string;
}[] = [
  {
    level: "KCPE",
    title: "KCPE",
    subtitle: "Kenya Certificate of Primary Education",
  },
  {
    level: "KCSE",
    title: "KCSE",
    subtitle: "Kenya Certificate of Secondary Education",
  },
  {
    level: "Certificate",
    title: "Certificate",
    subtitle: "TVET / Utalii / Craft or Artisan Certificate",
  },
  {
    level: "Diploma",
    title: "Diploma",
    subtitle: "Culinary, Hospitality or Institutional Diploma",
  },
  {
    level: "Degree",
    title: "Degree",
    subtitle: "BSc / BA in Hospitality, Culinary or Management",
  },
];

interface SelfStudyMaterial {
  id: string;
  title: string;
  roleTag: string;
  duration: string;
  format: string;
  summary: string;
}

const SELF_STUDY_MATERIALS: SelfStudyMaterial[] = [
  {
    id: "food-safety-haccp",
    title: "HACCP Level 2 & Kenyan Commercial Kitchen Hygiene",
    roleTag: "Chef • Waitstaff",
    duration: "45 mins",
    format: "Interactive Module + PDF Checklist",
    summary:
      "Temperature danger zones, cross-contamination prevention, cold-room FIFO labeling, and KEBS hygiene standards.",
  },
  {
    id: "silver-service-etiquette",
    title: "Five-Star Banquet & Silver Service Etiquette",
    roleTag: "Waitstaff",
    duration: "35 mins",
    format: "Video Walkthrough + Workbook",
    summary:
      "Table setting geometry, allergen communication, wine presentation, and high-volume conference plating.",
  },
  {
    id: "front-office-pms",
    title: "Front Desk Excellence, Guest Check-In & Opera PMS Basics",
    roleTag: "Receptionist",
    duration: "50 mins",
    format: "Self-Paced Simulation",
    summary:
      "Handling VIP arrivals, overbooking resolution, corporate billing folios, and professional telephone etiquette.",
  },
  {
    id: "commercial-laundry-care",
    title: "Commercial Linen Care, Fabric Chemistry & Stain Protocol",
    roleTag: "Laundry",
    duration: "30 mins",
    format: "Illustrated SOP Guide",
    summary:
      "Sorting hospitality textiles, chemical dosing safety, industrial calender pressing, and room-turnaround speed.",
  },
  {
    id: "cold-chain-transport",
    title: "Defensive Driving, Guest Chauffeur & Cold-Chain Delivery",
    roleTag: "Transport",
    duration: "40 mins",
    format: "Audio + Assessment Quiz",
    summary:
      "NTSA compliance, refrigerated van temperature logs, route optimization, and executive guest protocol.",
  },
];

const REMOTE_SESSIONS = [
  {
    id: "rem-01",
    title: "Live CV Clinic & Culinary Interview Prep",
    instructor: "Chef Sarah Wanjiku (Lead Consultant)",
    schedule: "Every Tuesday & Thursday • 3:00 PM EAT",
    platform: "Google Meet",
    meetingLink: "https://meet.google.com/smart-chefs-cv-prep",
    status: "Live Room Ready",
  },
  {
    id: "rem-02",
    title: "Hospitality Hygiene & Guest Service Q&A",
    instructor: "David Kiprono (F&B Operations Director)",
    schedule: "Fridays • 11:00 AM EAT",
    platform: "Zoom Coaching Room",
    meetingLink: "https://zoom.us/j/smartchefs-hospitality-qa",
    status: "Upcoming",
  },
  {
    id: "rem-03",
    title: "Work Placement Orientation (5% Employer Discount Track)",
    instructor: "Smart Chefs Placement Admin Desk",
    schedule: "Mondays • 10:00 AM EAT",
    platform: "Google Meet",
    meetingLink: "https://meet.google.com/smart-chefs-placement",
    status: "Open to All PEs",
  },
];

const IN_PERSON_CALENDAR = [
  {
    id: "live-01",
    date: "Sat, Nov 07, 2026",
    time: "09:00 AM – 01:00 PM",
    title: "Practical Knife Skills & Hot Line Assessment",
    venue: "Smart Chefs Westlands Culinary Lab, Nairobi",
    targetRoles: ["Chef", "Waitstaff"],
    seatsLeft: 6,
  },
  {
    id: "live-02",
    date: "Wed, Nov 11, 2026",
    time: "10:00 AM – 02:00 PM",
    title: "Front Office, Housekeeping & Laundry Practical Day",
    venue: "Nyali Hospitality Training Hub, Mombasa",
    targetRoles: ["Receptionist", "Laundry"],
    seatsLeft: 9,
  },
  {
    id: "live-03",
    date: "Sat, Nov 14, 2026",
    time: "08:30 AM – 12:30 PM",
    title: "Institutional Catering, Stores & Fleet Logistics Drill",
    venue: "Rift Valley Conferencing Center, Nakuru",
    targetRoles: ["Chef", "Transport"],
    seatsLeft: 4,
  },
];

export const ProspectiveEmployeeHub: React.FC = () => {
  const { dbUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mode: "onboarding" or "dashboard"
  const [viewMode, setViewMode] = useState<"onboarding" | "dashboard">("onboarding");
  const [dashboardTab, setDashboardTab] = useState<"status" | "training">("status");

  // Multi-step onboarding state (1 to 4)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 fields
  const [fullName, setFullName] = useState(dbUser?.displayName || "");
  const [phone, setPhone] = useState(dbUser?.phoneNumber || "+2547");
  const [email, setEmail] = useState(dbUser?.email || "");
  const [educationLevel, setEducationLevel] = useState<KenyanEducation>("Diploma");
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState("");
  const [refereeName, setRefereeName] = useState("");
  const [refereePhone, setRefereePhone] = useState("");
  const [refereeEmail, setRefereeEmail] = useState("");

  // Step 2 fields
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Chef"]);

  // Step 3 fields (Headshot)
  const [headshotPreview, setHeadshotPreview] = useState<string | null>(null);
  const [headshotFileName, setHeadshotFileName] = useState<string>("");

  // Step 4 & Dashboard state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [peProfile, setPeProfile] = useState<any | null>(null);
  const [ackEmail, setAckEmail] = useState<any | null>(null);
  const [rsvpedSessionIds, setRsvpedSessionIds] = useState<string[]>([]);

  // Load existing PE profile on mount
  useEffect(() => {
    fetch("/api/prospective-employees")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setPeProfile(data.profile);
        }
      })
      .catch((err) => console.error("Error loading PE profile:", err));
  }, []);

  // Pre-fill user details when dbUser changes
  useEffect(() => {
    if (dbUser) {
      if (!fullName && dbUser.displayName) setFullName(dbUser.displayName);
      if ((phone === "+2547" || !phone) && dbUser.phoneNumber) setPhone(dbUser.phoneNumber);
      if (!email && dbUser.email) setEmail(dbUser.email);
    }
  }, [dbUser]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleHeadshotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHeadshotFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress & crop to square thumbnail for fast storage
        const canvas = document.createElement("canvas");
        const maxDim = 480;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
          setHeadshotPreview(dataUrl);
        } else {
          setHeadshotPreview(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const requiresCvForSelection =
    selectedCategories.some((catId) => {
      const found = JOB_CATEGORIES.find((c) => c.id === catId);
      return found?.requiresCv;
    }) ||
    educationLevel === "Diploma" ||
    educationLevel === "Degree";

  const validateStep = (currentStep: number): boolean => {
    setErrorMsg(null);
    if (currentStep === 1) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setErrorMsg("Please enter your full name.");
        return false;
      }
      if (!phone.trim() || phone.trim().length < 9) {
        setErrorMsg("Please enter a valid Kenyan phone number (e.g. +254712345678).");
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (selectedCategories.length === 0) {
        setErrorMsg("Please select at least one job category.");
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (!headshotPreview) {
        setErrorMsg("Please capture a live headshot or upload a profile photo to continue.");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4);
  };

  const handleSubmitOnboarding = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const referencesPayload =
        refereeName || refereePhone || refereeEmail
          ? [
              {
                name: refereeName || "Provided Reference",
                phone: refereePhone || "N/A",
                email: refereeEmail || "N/A",
              },
            ]
          : [];

      const response = await fetch("/api/prospective-employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: dbUser?.id || null,
          full_name: fullName,
          education_level: educationLevel,
          phone,
          email,
          qualifications:
            qualifications ||
            `${educationLevel} holder trained in ${selectedCategories.join(", ")}`,
          experience:
            experience ||
            `Practical hospitality experience in ${selectedCategories.join(", ")}`,
          references: referencesPayload,
          selected_job_categories: selectedCategories,
          headshot_url: headshotPreview,
          linked_training_modules: ["food-safety-haccp"],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setPeProfile(data.profile);
      setAckEmail(data.acknowledgmentEmail);
      setViewMode("dashboard");
      setDashboardTab("status");
    } catch (err: any) {
      setErrorMsg(err.message || "Could not submit onboarding profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleModuleCompletion = async (moduleId: string) => {
    if (!peProfile) return;
    const currentModules: string[] = peProfile.linked_training_modules || [];
    const updatedModules = currentModules.includes(moduleId)
      ? currentModules.filter((m) => m !== moduleId)
      : [...currentModules, moduleId];

    setPeProfile({
      ...peProfile,
      linked_training_modules: updatedModules,
    });

    try {
      await fetch("/api/prospective-employees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: peProfile.id,
          linked_training_modules: updatedModules,
        }),
      });
    } catch (e) {
      console.error("Failed to sync module completion:", e);
    }
  };

  const handleToggleApprovalSimulation = async () => {
    if (!peProfile) return;
    const nextStatus = peProfile.approval_status === "live" ? "pending" : "live";
    setPeProfile({ ...peProfile, approval_status: nextStatus });

    try {
      await fetch("/api/prospective-employees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: peProfile.id,
          approval_status: nextStatus,
        }),
      });
    } catch (e) {
      console.error("Failed to toggle status:", e);
    }
  };

  const toggleRsvp = (sessionId: string) => {
    setRsvpedSessionIds((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  return (
    <div className="space-y-5 pb-28">
      {/* Top Mode Switcher Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#231510] via-chef-card to-chef-dark border border-brand-500/30 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-brand-400 bg-brand-500/15 px-2.5 py-0.5 rounded-full border border-brand-500/30">
              Hospitality Talent Marketplace
            </span>
            <h1 className="text-lg font-black text-white mt-1">
              Prospective Employee Portal
            </h1>
          </div>

          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("onboarding")}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                viewMode === "onboarding"
                  ? "bg-brand-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Onboarding
            </button>
            <button
              type="button"
              onClick={() => setViewMode("dashboard")}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                viewMode === "dashboard"
                  ? "bg-brand-500 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>PE Dashboard</span>
              {peProfile && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    peProfile.approval_status === "live"
                      ? "bg-emerald-400"
                      : "bg-amber-400 animate-pulse"
                  }`}
                />
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {viewMode === "onboarding"
            ? "Complete the 4-step hospitality onboarding to get vetted by Smart Chefs Admins and matched with verified employers."
            : "Track your Admin verification status, CV submission requirements, and hospitality training modules."}
        </p>
      </div>

      {/* =====================================================================
          MODE 1: 4-STEP ONBOARDING FLOW
         ===================================================================== */}
      {viewMode === "onboarding" && (
        <div className="space-y-4">
          {/* Accessible Step Progress Bar */}
          <div
            role="navigation"
            aria-label="Onboarding Progress"
            className="grid grid-cols-4 gap-2 bg-chef-card p-3 rounded-2xl border border-white/10"
          >
            {[
              { num: 1, title: "1. Bio & KCSE" },
              { num: 2, title: "2. Job Roles" },
              { num: 3, title: "3. Headshot" },
              { num: 4, title: "4. Submit" },
            ].map((item) => {
              const isCurrent = step === item.num;
              const isDone = step > item.num;
              return (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => {
                    if (item.num < step || validateStep(step)) {
                      setStep(item.num as 1 | 2 | 3 | 4);
                    }
                  }}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex flex-col items-center p-2 rounded-xl text-center transition-all ${
                    isCurrent
                      ? "bg-brand-500/20 border border-brand-500/50 text-brand-300"
                      : isDone
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                      : "bg-white/5 border border-transparent text-slate-500"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mb-1 bg-black/30">
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : item.num}
                  </div>
                  <span className="text-[10px] font-bold leading-tight">{item.title}</span>
                </button>
              );
            })}
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-3 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ---------------------------------------------------------------
                STEP 1: BASIC INFO & KENYAN EDUCATION LEVEL
               --------------------------------------------------------------- */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="p-5 rounded-3xl bg-chef-card border border-white/10 space-y-4"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Step 1: Basic Info & Kenyan Education Level
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Provide your contact details, highest Kenyan qualification, and referee.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="pe-full-name"
                      className="block text-[11px] font-bold text-slate-300 mb-1"
                    >
                      Full Name (as on National ID) *
                    </label>
                    <input
                      id="pe-full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Amina Hassan Wanjiru"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="pe-phone"
                        className="block text-[11px] font-bold text-slate-300 mb-1"
                      >
                        Phone Number (M-Pesa / WhatsApp) *
                      </label>
                      <input
                        id="pe-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254712345678"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="pe-email"
                        className="block text-[11px] font-bold text-slate-300 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        id="pe-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  {/* Kenyan Education Level Selector */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-300 mb-1.5">
                      Highest Kenyan Education Level *
                    </span>
                    <div
                      role="radiogroup"
                      aria-label="Kenyan Education Level"
                      className="grid grid-cols-1 gap-2"
                    >
                      {EDUCATION_LEVELS.map((item) => {
                        const isSelected = educationLevel === item.level;
                        return (
                          <button
                            key={item.level}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setEducationLevel(item.level)}
                            className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                              isSelected
                                ? "bg-brand-500/20 border-brand-500 text-white shadow-md"
                                : "bg-black/30 border-white/10 text-slate-300 hover:border-white/25"
                            }`}
                          >
                            <div>
                              <span className="text-xs font-extrabold block">
                                {item.title}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {item.subtitle}
                              </span>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-brand-400 bg-brand-500 text-white"
                                  : "border-slate-600"
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="pe-qualifications"
                      className="block text-[11px] font-bold text-slate-300 mb-1"
                    >
                      Certifications & Trade Qualifications
                    </label>
                    <input
                      id="pe-qualifications"
                      type="text"
                      value={qualifications}
                      onChange={(e) => setQualifications(e.target.value)}
                      placeholder="e.g. Utalii College Food Production, Food Handler's Certificate, BCE Driving License"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="pe-experience"
                      className="block text-[11px] font-bold text-slate-300 mb-1"
                    >
                      Work Experience Summary
                    </label>
                    <textarea
                      id="pe-experience"
                      rows={2}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Briefly describe your years of experience and previous hotels, schools, or restaurants worked at..."
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  {/* Reference sub-card */}
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
                    <span className="text-[11px] font-bold text-brand-300 block">
                      Primary Reference (Former Employer / Tutor)
                    </span>
                    <input
                      type="text"
                      value={refereeName}
                      onChange={(e) => setRefereeName(e.target.value)}
                      placeholder="Referee Name & Role (e.g. Chef Bakari - Head Chef)"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="tel"
                        value={refereePhone}
                        onChange={(e) => setRefereePhone(e.target.value)}
                        placeholder="Referee Phone (+254...)"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500"
                      />
                      <input
                        type="email"
                        value={refereeEmail}
                        onChange={(e) => setRefereeEmail(e.target.value)}
                        placeholder="Referee Email"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-glow transition-all"
                  >
                    <span>Continue to Job Categories</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ---------------------------------------------------------------
                STEP 2: VISUAL, ACCESSIBLE JOB CATEGORY SELECTOR
               --------------------------------------------------------------- */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="p-5 rounded-3xl bg-chef-card border border-white/10 space-y-4"
              >
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Step 2: Select Your Hospitality Job Categories
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tap one or more roles you are qualified for. Roles marked{" "}
                    <span className="text-amber-300 font-semibold">CV Required</span> will
                    trigger CV submission instructions upon completion.
                  </p>
                </div>

                <div
                  role="group"
                  aria-label="Hospitality Job Categories"
                  className="grid grid-cols-1 gap-3"
                >
                  {JOB_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategories.includes(cat.id);

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start space-x-3.5 focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                          isSelected
                            ? `bg-gradient-to-r ${cat.accentColor} shadow-lg scale-[1.01]`
                            : "bg-black/30 border-white/10 hover:border-white/25"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-brand-500 text-white shadow-md"
                              : "bg-white/5 text-slate-400"
                          }`}
                        >
                          <Icon className="w-6 h-6" aria-hidden="true" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-black text-white">
                              {cat.label}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                cat.requiresCv
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              }`}
                            >
                              {cat.badgeText}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                            {cat.caption}
                          </p>
                          <span className="inline-block text-[10px] text-slate-400 mt-1.5 font-medium">
                            Department: {cat.department}
                          </span>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                            isSelected
                              ? "bg-brand-500 border-brand-400 text-white"
                              : "border-slate-600"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center space-x-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-glow transition-all"
                  >
                    <span>Continue to Live Headshot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ---------------------------------------------------------------
                STEP 3: HTML5 CAMERA / HEADSHOT MEDIA UPLOAD
               --------------------------------------------------------------- */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="p-5 rounded-3xl bg-chef-card border border-white/10 space-y-4"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Step 3: Live Headshot Capture or Upload
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Mobile users can snap a live front-camera portrait or select a clear photo.
                    </p>
                  </div>
                </div>

                {/* Portrait Framing Area */}
                <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-black/40 border-2 border-dashed border-brand-500/40 text-center space-y-4">
                  <div className="relative w-36 h-36 rounded-full overflow-hidden bg-chef-dark border-2 border-brand-400/60 flex items-center justify-center shadow-2xl">
                    {headshotPreview ? (
                      <img
                        src={headshotPreview}
                        alt="Candidate Headshot Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-500 p-3">
                        <Camera className="w-9 h-9 mb-1 text-brand-400/70" />
                        <span className="text-[10px] font-semibold">
                          Center Face in Oval
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Exact HTML5 Camera Input specified in prompt */}
                  <div className="w-full max-w-xs space-y-2">
                    <label
                      htmlFor="pe-headshot-input"
                      className="cursor-pointer w-full py-3 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-glow transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>
                        {headshotPreview ? "Retake / Replace Headshot" : "Take Live Headshot / Upload"}
                      </span>
                    </label>
                    <input
                      ref={fileInputRef}
                      id="pe-headshot-input"
                      type="file"
                      accept="image/*;capture=camera"
                      capture="user"
                      onChange={handleHeadshotFileChange}
                      className="sr-only"
                    />

                    {headshotFileName && (
                      <p className="text-[10px] text-emerald-400 font-medium truncate">
                        Selected: {headshotFileName}
                      </p>
                    )}

                    {!headshotPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setHeadshotPreview(
                            "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80"
                          );
                          setHeadshotFileName("demo-chef-portrait.jpg");
                        }}
                        className="text-[11px] text-brand-300 hover:text-brand-200 underline block mx-auto pt-1"
                      >
                        Testing on desktop without a webcam? Use sample portrait
                      </button>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 bg-white/5 px-3 py-2 rounded-xl border border-white/5 text-left w-full">
                    <strong className="text-slate-200 block mb-0.5">
                      Smart Chefs Photo Standards:
                    </strong>
                    • Face the camera directly in a well-lit area.
                    <br />• Chef whites, neat collared shirt, or professional attire recommended.
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center space-x-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-glow transition-all"
                  >
                    <span>Review & Submit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ---------------------------------------------------------------
                STEP 4: REVIEW & AUTOMATED ACKNOWLEDGMENT EMAIL SUBMISSION
               --------------------------------------------------------------- */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="p-5 rounded-3xl bg-chef-card border border-white/10 space-y-4"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Step 4: Confirm & Trigger Admin Review
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Submitting places your profile in{" "}
                      <span className="text-amber-300 font-semibold">Pending Admin Review</span>{" "}
                      and sends your automated acknowledgment email.
                    </p>
                  </div>
                </div>

                {/* Candidate Summary Card */}
                <div className="p-4 rounded-2xl bg-black/35 border border-white/10 flex items-center space-x-3.5">
                  {headshotPreview && (
                    <img
                      src={headshotPreview}
                      alt={fullName}
                      className="w-16 h-16 rounded-2xl object-cover border border-brand-400/50 shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white truncate">
                        {fullName}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        {educationLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {phone} {email ? `• ${email}` : ""}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedCategories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/10 text-slate-200"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Automated Email Notice */}
                <div
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    requiresCvForSelection
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-100"
                      : "bg-sky-500/15 border-sky-500/30 text-sky-100"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    <Mail className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>
                      {requiresCvForSelection
                        ? "Automated Email Notice: CV Submission Required"
                        : "Automated Email Confirmation Included"}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    {requiresCvForSelection
                      ? `Because you selected ${selectedCategories.join(
                          ", "
                        )} (${educationLevel}), our system will immediately email you a Reference Code with instructions to send your CV & certificates to careers@smartchefs.co.ke.`
                      : "Upon submission, you will receive an automated acknowledgment email confirming your Pending Admin Review status and unlocking your Training & Development portal."}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center space-x-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitOnboarding}
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-glow transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? "Submitting & Sending Email..."
                        : "Submit Profile for Admin Review"}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* =====================================================================
          MODE 2: PROSPECTIVE EMPLOYEE (PE) DASHBOARD VIEW
         ===================================================================== */}
      {viewMode === "dashboard" && (
        <div className="space-y-4">
          {/* Automated Acknowledgment Email Dispatch Banner (if just submitted or viewing) */}
          {ackEmail && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/90 via-chef-card to-chef-dark border border-emerald-500/40 shadow-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                      Automated Acknowledgment Dispatched
                    </span>
                    <h3 className="text-xs font-bold text-white">
                      {ackEmail.subject}
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {ackEmail.referenceCode}
                </span>
              </div>

              <pre className="text-[10px] text-slate-300 whitespace-pre-wrap font-sans bg-black/40 p-3 rounded-2xl border border-white/10 leading-relaxed">
                {ackEmail.bodyPreview}
              </pre>

              {ackEmail.requiresCvEmail && (
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-amber-300 font-semibold">
                    Role requires CV attachment via email:
                  </span>
                  <a
                    href={`mailto:careers@smartchefs.co.ke?subject=${encodeURIComponent(
                      `${ackEmail.referenceCode} - ${peProfile?.full_name || "Candidate"} CV`
                    )}`}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-[10px] flex items-center space-x-1 hover:bg-amber-400 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email CV Now</span>
                  </a>
                </div>
              )}
            </motion.div>
          )}

          {/* Candidate Profile Status Header Card */}
          {peProfile && (
            <div className="p-4 rounded-3xl bg-chef-card border border-white/10 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      peProfile.headshot_url ||
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={peProfile.full_name}
                    className="w-14 h-14 rounded-2xl object-cover border border-brand-500/40"
                  />
                  <div>
                    <h2 className="text-sm font-black text-white">
                      {peProfile.full_name}
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      {peProfile.education_level} • {peProfile.phone}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(peProfile.selected_job_categories || []).map((role: string) => (
                        <span
                          key={role}
                          className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-brand-500/15 text-brand-300 border border-brand-500/30"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                      peProfile.approval_status === "live"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        peProfile.approval_status === "live"
                          ? "bg-emerald-400"
                          : "bg-amber-400 animate-pulse"
                      }`}
                    />
                    <span>
                      {peProfile.approval_status === "live"
                        ? "Live in Marketplace"
                        : "Pending Admin Review"}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={handleToggleApprovalSimulation}
                    className="block mt-1.5 ml-auto text-[9px] text-slate-400 hover:text-brand-300 underline"
                    title="Demo control: Toggle between Pending Admin Review and Live status"
                  >
                    Simulate {peProfile.approval_status === "live" ? "Pending" : "Live"} Status
                  </button>
                </div>
              </div>

              {/* Dashboard Sub-Navigation Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setDashboardTab("status")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                    dashboardTab === "status"
                      ? "bg-brand-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Profile Status</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardTab("training")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                    dashboardTab === "training"
                      ? "bg-brand-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Training & Development</span>
                </button>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              SUB-TAB 1: PROFILE STATUS & ADMIN PLACEMENT PIPELINE
             ----------------------------------------------------------------- */}
          {dashboardTab === "status" && peProfile && (
            <div className="space-y-4">
              {/* Verification Pipeline Tracker */}
              <div className="p-4 rounded-3xl bg-chef-card border border-white/10 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Vetting & Marketplace Visibility Pipeline
                </h3>

                <div className="space-y-2.5">
                  <div className="flex items-start space-x-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        1. Onboarding & Headshot Submitted
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Basic bio, Kenyan education level ({peProfile.education_level}), and
                        live headshot recorded.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 p-3 rounded-2xl border ${
                      peProfile.approval_status === "live"
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-amber-500/15 border-amber-500/40"
                    }`}
                  >
                    <Clock
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        peProfile.approval_status === "live"
                          ? "text-emerald-400"
                          : "text-amber-400 animate-spin"
                      }`}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        2. Admin Vetting, Reference & CV Check
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Smart Chefs Admins verify your references and CV (required for Chef,
                        Receptionist & Diploma/Degree roles) via{" "}
                        <span className="text-brand-300 font-semibold">
                          careers@smartchefs.co.ke
                        </span>
                        .
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 p-3 rounded-2xl border ${
                      peProfile.approval_status === "live"
                        ? "bg-emerald-500/15 border-emerald-500/40"
                        : "bg-white/5 border-white/10 opacity-60"
                    }`}
                  >
                    <Award
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        peProfile.approval_status === "live"
                          ? "text-emerald-400"
                          : "text-slate-500"
                      }`}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        3. Live in Employer Recruitment Pool
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Verified employers can view your profile and request Admin-managed
                        interviews and work placements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin-Managed Job Applications Section */}
              <div className="p-4 rounded-3xl bg-chef-card border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-brand-400" />
                    <span>Admin-Managed Job Placements</span>
                  </h3>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Managed Strictly by Admin
                  </span>
                </div>

                {peProfile.applications && peProfile.applications.length > 0 ? (
                  <div className="space-y-2.5">
                    {peProfile.applications.map((app: any) => (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-2xl bg-black/35 border border-white/10 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-white">
                            {app.job_listing?.title || "Hospitality Placement"}
                          </h4>
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                            {app.stage}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {app.job_listing?.location} • {app.job_listing?.salary_range}
                        </p>
                        {app.admin_notes && (
                          <p className="text-[10px] text-slate-300 bg-white/5 p-2 rounded-xl border border-white/5">
                            <strong>Admin Note:</strong> {app.admin_notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-center space-y-1">
                    <p className="text-xs font-semibold text-slate-300">
                      No Active Employer Placements Yet
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Complete modules in the{" "}
                      <button
                        type="button"
                        onClick={() => setDashboardTab("training")}
                        className="text-brand-400 underline font-semibold"
                      >
                        Training & Development
                      </button>{" "}
                      tab to boost your placement priority!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              SUB-TAB 2: TRAINING & DEVELOPMENT TAB
              (Self-Study Materials, Remote Session Links, In-Person Calendar)
             ----------------------------------------------------------------- */}
          {dashboardTab === "training" && (
            <div className="space-y-5">
              {/* 1. Self-Study Materials */}
              <div className="p-4 rounded-3xl bg-chef-card border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-white">
                        1. Self-Study Materials
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Role-specific hospitality SOPs, study guides & certification prep
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {(peProfile?.linked_training_modules || []).length} Linked
                  </span>
                </div>

                <div className="space-y-2.5">
                  {SELF_STUDY_MATERIALS.map((mat) => {
                    const isCompleted = (
                      peProfile?.linked_training_modules || []
                    ).includes(mat.id);

                    return (
                      <div
                        key={mat.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isCompleted
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-black/35 border-white/10"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                                {mat.roleTag}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {mat.format} • {mat.duration}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white mt-1">
                              {mat.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                              {mat.summary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                          <span className="text-[10px] text-slate-400">
                            {isCompleted
                              ? "Linked to your PE profile badge"
                              : "Self-paced module placeholder"}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleModuleCompletion(mat.id)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center space-x-1 transition-all ${
                              isCompleted
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-white/10 hover:bg-brand-500 text-white"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>
                              {isCompleted ? "Completed & Linked" : "Mark Complete"}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Remote Session Links */}
              <div className="p-4 rounded-3xl bg-chef-card border border-white/10 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-white">
                      2. Remote Session Links
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Live virtual coaching rooms, CV clinics & placement orientations
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {REMOTE_SESSIONS.map((session) => (
                    <div
                      key={session.id}
                      className="p-3.5 rounded-2xl bg-black/35 border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            {session.platform}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            • {session.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">
                          {session.title}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {session.instructor}
                        </p>
                        <p className="text-[10px] text-brand-300 font-medium">
                          {session.schedule}
                        </p>
                      </div>

                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/40 text-[10px] font-bold flex items-center space-x-1 shrink-0 transition-all"
                      >
                        <span>Join Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. In-Person Live Sessions Calendar */}
              <div className="p-4 rounded-3xl bg-chef-card border border-white/10 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-white">
                      3. In-Person Live Sessions Calendar
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Hands-on culinary, service, housekeeping & logistics practical hubs
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {IN_PERSON_CALENDAR.map((event) => {
                    const isBooked = rsvpedSessionIds.includes(event.id);
                    return (
                      <div
                        key={event.id}
                        className="p-3.5 rounded-2xl bg-black/35 border border-white/10 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                            {event.date} • {event.time}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {isBooked ? "Seat Reserved" : `${event.seatsLeft} seats left`}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white">{event.title}</h4>

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex items-center space-x-1.5 text-[10px] text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                            <span>{event.venue}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleRsvp(event.id)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold shrink-0 transition-all ${
                              isBooked
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-brand-500/20 hover:bg-brand-500 text-brand-300 hover:text-white border border-brand-500/40"
                            }`}
                          >
                            {isBooked ? "✓ RSVP Confirmed" : "Reserve Practical Slot"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
