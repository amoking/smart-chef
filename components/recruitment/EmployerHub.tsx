"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Building2,
  MapPin,
  Users,
  BedDouble,
  Sparkles,
  CheckSquare,
  Square,
  Calendar,
  Clock,
  Briefcase,
  CreditCard,
  MessageSquareWarning,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  Navigation,
  Globe,
  Laptop,
  ShieldAlert,
  Award,
  ArrowRight,
  RefreshCw,
  Phone,
  Mail,
  UserCheck,
  Tag,
  ChevronRight,
} from "lucide-react";

export interface SuggestedRequirementCheckbox {
  id: string;
  label: string;
  category: string;
  checked: boolean;
}

const FACILITY_TYPES = [
  "Hotel & Conference Resort",
  "Fine Dining & Casual Restaurant",
  "Boarding School / University",
  "Hospital & Clinical Catering",
  "Outside & Event Catering",
  "Corporate / Industrial Cafeteria",
];

const BOARDING_TYPES = [
  {
    id: "Residential Hospitality & Full-Board",
    title: "Residential Hospitality & Full-Board",
    subtitle: "Hotels, lodges, and resorts with live-in guest & staff quarters",
  },
  {
    id: "Full Boarding Institution",
    title: "Full Boarding Institution",
    subtitle: "Boarding schools, colleges, or residential training campuses",
  },
  {
    id: "Mixed Boarding & Day",
    title: "Mixed Boarding & Day Facility",
    subtitle: "Institutions serving both day commuters and residential boarders",
  },
  {
    id: "Day & Non-Residential",
    title: "Day & Non-Residential Operations",
    subtitle: "Standalone restaurants, cafes, and corporate day cafeterias",
  },
  {
    id: "24-Hour Shift / Clinical",
    title: "24-Hour Clinical / Shift Facility",
    subtitle: "Hospitals and round-the-clock institutional catering units",
  },
];

const CAPACITY_PRESETS = [50, 150, 300, 600, 850, 1500];

const KENYA_MAP_HUBS = [
  {
    name: "Nairobi (Westlands / CBD)",
    address: "Westlands Commercial Hub, Nairobi, Kenya",
    lat: -1.2648,
    lng: 36.8049,
    x: 54,
    y: 62,
  },
  {
    name: "Naivasha (Lake Road Resorts)",
    address: "Moi South Lake Road, Naivasha, Kenya",
    lat: -0.7852,
    lng: 36.3534,
    x: 47,
    y: 56,
  },
  {
    name: "Mombasa (Nyali / North Coast)",
    address: "Links Road, Nyali, Mombasa, Kenya",
    lat: -4.0435,
    lng: 39.6682,
    x: 82,
    y: 86,
  },
  {
    name: "Nakuru (Milimani / Rift Valley)",
    address: "Kenyatta Avenue, Nakuru City, Kenya",
    lat: -0.3031,
    lng: 36.08,
    x: 43,
    y: 49,
  },
  {
    name: "Kisumu (Dunga / Lakefront)",
    address: "Dunga Beach Road, Kisumu, Kenya",
    lat: -0.0917,
    lng: 34.768,
    x: 26,
    y: 48,
  },
  {
    name: "Diani Beach (South Coast)",
    address: "Diani Beach Road, Kwale County, Kenya",
    lat: -4.2798,
    lng: 39.5947,
    x: 79,
    y: 92,
  },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SCHEDULE_PRESETS = [
  {
    label: "Mon-Fri 9-5 (Standard)",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    start: "09:00",
    end: "17:00",
    shiftType: "Standard Day Shift",
  },
  {
    label: "Mon-Sat 6-Day Hospitality",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    start: "08:00",
    end: "17:00",
    shiftType: "6-Day Rotating Shift",
  },
  {
    label: "Split Shift (Prep & Dinner)",
    days: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    start: "06:30",
    end: "21:30",
    shiftType: "Split Shift (3hr afternoon break)",
  },
  {
    label: "Fri-Sun Banquet & Events",
    days: ["Fri", "Sat", "Sun"],
    start: "10:00",
    end: "22:00",
    shiftType: "Weekend Event Crew",
  },
];

const SAMPLE_JOB_TEMPLATES = [
  {
    label: "Sous Chef (Banquet & Fine Dining)",
    title: "Junior Sous Chef & Banquet Line Lead",
    salary: "KES 55,000 - 75,000 / month",
    description:
      "We are seeking a qualified Junior Sous Chef with a Diploma from Kenya Utalii College or TVET institution. Must hold a valid County Food Handler's Certificate and HACCP Level 2 training. Will supervise a brigade of 8 chefs, execute high-volume conference buffets (up to 600 covers), manage menu costing & FIFO cold-room stock, and prepare à la carte fine dining service. Staff accommodation and duty meals provided. Must be flexible for weekend and public holiday shifts.",
  },
  {
    label: "Boarding School Head Cook / Cateress",
    title: "Institutional Cateress & Boarding Kitchen Supervisor",
    salary: "KES 40,000 - 55,000 / month",
    description:
      "Seeking an experienced Institutional Cateress / Head Cook for an 800-student boarding school. Candidates must have strong hygiene & sanitation standards, valid medical certificate, portion control & dry-store FIFO inventory skills, and experience preparing balanced dietary menus. Live-in staff housing provided.",
  },
  {
    label: "Front Office Receptionist",
    title: "Front Desk Guest Relations & PMS Receptionist",
    salary: "KES 35,000 - 48,000 / month",
    description:
      "Looking for a hospitable Front Desk Receptionist experienced in Opera PMS reservation check-in, corporate folio billing, and VIP guest concierge communication. Diploma or Certificate in Front Office Operations required. Rotating shift schedule.",
  },
];

const RECRUITMENT_STAGES_META = [
  { id: "SHORTLISTED", label: "Shortlisted", step: 1 },
  { id: "ADMIN_VETTING", label: "Admin Vetting", step: 2 },
  { id: "EMPLOYER_REVIEW", label: "Employer Review", step: 3 },
  { id: "INTERVIEW_SCHEDULED", label: "Interview Set", step: 4 },
  { id: "TRIAL_SHIFT", label: "Trial Shift", step: 5 },
  { id: "OFFER_EXTENDED", label: "Offer Extended", step: 6 },
  { id: "PLACED", label: "Placed", step: 7 },
];

export const EmployerHub: React.FC = () => {
  const { dbUser } = useAuth();

  // Top-level view mode: "dashboard" | "post-job" | "onboarding"
  const [viewMode, setViewMode] = useState<"dashboard" | "post-job" | "onboarding">(
    "dashboard"
  );
  // Sub-tabs within Dashboard: "stages" | "fees" | "feedback"
  const [dashboardTab, setDashboardTab] = useState<"stages" | "fees" | "feedback">(
    "stages"
  );

  // Loaded Employer Data & Tickets
  const [employer, setEmployer] = useState<any | null>(null);
  const [feedbackTickets, setFeedbackTickets] = useState<any[]>([]);
  const [statusBanner, setStatusBanner] = useState<{
    type: "success" | "info" | "error";
    text: string;
  } | null>(null);

  // =========================================================================
  // 1. EMPLOYER ONBOARDING STATE
  // =========================================================================
  const [businessName, setBusinessName] = useState(
    "Rift Valley Grand Lodge & Conferencing"
  );
  const [facilityType, setFacilityType] = useState(FACILITY_TYPES[0]);
  const [maxCapacity, setMaxCapacity] = useState<number>(850);
  const [boardingType, setBoardingType] = useState(BOARDING_TYPES[0].id);
  const [businessLocation, setBusinessLocation] = useState(
    "Moi South Lake Road, Naivasha, Nakuru County"
  );
  const [contactName, setContactName] = useState(
    dbUser?.displayName || "Chef Sarah Wanjiku"
  );
  const [contactPhone, setContactPhone] = useState(
    dbUser?.phoneNumber || "+254711223344"
  );
  const [contactEmail, setContactEmail] = useState(
    dbUser?.email || "hr@riftvalleygrand-example.co.ke"
  );
  const [contactRole, setContactRole] = useState("Culinary Operations Director");
  const [isSavingOnboarding, setIsSavingOnboarding] = useState(false);

  // =========================================================================
  // 2. 'POST A JOB' WIZARD STATE (AI Extraction, Map, Schedule Calendar, 5% Flag)
  // =========================================================================
  const [jobTitle, setJobTitle] = useState("");
  const [salaryRange, setSalaryRange] = useState("KES 45,000 - 65,000 / month");
  const [jobDescription, setJobDescription] = useState("");
  const [isExtractingAi, setIsExtractingAi] = useState(false);
  const [aiCheckboxes, setAiCheckboxes] = useState<SuggestedRequirementCheckbox[]>([
    {
      id: "haccp-cert",
      label: "HACCP & Food Safety Compliance",
      category: "Certification",
      checked: true,
    },
    {
      id: "food-handlers-cert",
      label: "Valid County Food Handler's Medical Certificate",
      category: "Certification",
      checked: true,
    },
    {
      id: "high-volume-banquet",
      label: "High-Volume Banquet & Buffet Execution (300+ Covers)",
      category: "Operations & Capacity",
      checked: true,
    },
    {
      id: "menu-costing-fifo",
      label: "Menu Costing, Portion Control & BOH FIFO Waste Reduction",
      category: "Operations & Capacity",
      checked: false,
    },
  ]);
  const [customReqInput, setCustomReqInput] = useState("");

  // Location & Interactive Map State
  const [locationType, setLocationType] = useState<"coords" | "hybrid" | "remote">(
    "coords"
  );
  const [jobLocationAddress, setJobLocationAddress] = useState(
    "Moi South Lake Road, Naivasha, Kenya"
  );
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: -0.7852,
    lng: 36.3534,
  });
  const [pinPos, setPinPos] = useState<{ x: number; y: number }>({ x: 47, y: 56 });

  // Calendar UI for Work Schedule State
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
  const [shiftStart, setShiftStart] = useState("09:00");
  const [shiftEnd, setShiftEnd] = useState("17:00");
  const [shiftPattern, setShiftPattern] = useState("Standard Day Shift");

  // Prominent 5% Work Placement Discount Checkbox
  const [acceptsWorkPlacement, setAcceptsWorkPlacement] = useState<boolean>(true);
  const [isPostingJob, setIsPostingJob] = useState(false);

  // =========================================================================
  // 3. FEEDBACK / ISSUE SUBMISSION STATE & FEE SETTLEMENT STATE
  // =========================================================================
  const [feedbackCategory, setFeedbackCategory] = useState(
    "Candidate Performance & Placement"
  );
  const [feedbackPriority, setFeedbackPriority] = useState("Normal");
  const [feedbackRelatedJob, setFeedbackRelatedJob] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isProcessingFeePayment, setIsProcessingFeePayment] = useState(false);

  // Load initial employer profile, job listings, and feedback tickets
  useEffect(() => {
    fetch("/api/employers")
      .then((res) => res.json())
      .then((data) => {
        if (data.employer) {
          const emp = data.employer;
          setEmployer(emp);
          if (emp.business_name) setBusinessName(emp.business_name);
          if (emp.type) setFacilityType(emp.type);
          if (emp.max_catering_capacity) setMaxCapacity(emp.max_catering_capacity);
          if (emp.boarding_type) setBoardingType(emp.boarding_type);
          if (emp.business_location) setBusinessLocation(emp.business_location);
          if (emp.contact_name) setContactName(emp.contact_name);
          if (emp.contact_details?.phone) setContactPhone(emp.contact_details.phone);
          if (emp.contact_details?.email) setContactEmail(emp.contact_details.email);
          if (emp.contact_details?.role) setContactRole(emp.contact_details.role);
          if (emp.job_listings?.[0]?.title) {
            setFeedbackRelatedJob(emp.job_listings[0].title);
          }
        }
        if (data.feedbackTickets) {
          setFeedbackTickets(data.feedbackTickets);
        }
      })
      .catch((err) => console.error("Error loading employer data:", err));
  }, []);

  // Computed formatted work schedule string from Calendar UI
  const formattedWorkSchedule = (() => {
    if (selectedDays.length === 0) return `Flexible Schedule (${shiftStart}-${shiftEnd})`;
    const isMonToFri =
      selectedDays.length === 5 &&
      ["Mon", "Tue", "Wed", "Thu", "Fri"].every((d) => selectedDays.includes(d));
    const isMonToSat =
      selectedDays.length === 6 &&
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].every((d) => selectedDays.includes(d));
    const dayPrefix = isMonToFri
      ? "Mon-Fri"
      : isMonToSat
      ? "Mon-Sat"
      : selectedDays.join(", ");
    return `${dayPrefix} ${shiftStart}-${shiftEnd} (${shiftPattern})`;
  })();

  // Handler: Save Employer Onboarding
  const handleSaveOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusBanner(null);
    setIsSavingOnboarding(true);

    try {
      const res = await fetch("/api/employers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "onboard_employer",
          userId: dbUser?.id || null,
          business_name: businessName,
          business_location: businessLocation,
          type: facilityType,
          max_catering_capacity: Number(maxCapacity) || 100,
          boarding_type: boardingType,
          contact_name: contactName,
          contact_details: {
            phone: contactPhone,
            email: contactEmail,
            role: contactRole,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save onboarding");

      setEmployer(data.employer);
      setStatusBanner({
        type: "success",
        text: `Employer profile saved (${data.employer.max_catering_capacity} covers capacity • ${data.employer.boarding_type}).`,
      });
      setViewMode("dashboard");
    } catch (err: any) {
      setStatusBanner({
        type: "error",
        text: err.message || "Could not save employer onboarding profile.",
      });
    } finally {
      setIsSavingOnboarding(false);
    }
  };

  // Handler: AI Requirement Extraction from Job Description
  const handleRunAiExtraction = async (descOverride?: string, titleOverride?: string) => {
    const textToAnalyze = descOverride ?? jobDescription;
    const titleToAnalyze = titleOverride ?? jobTitle;

    if (!textToAnalyze.trim()) {
      setStatusBanner({
        type: "error",
        text: "Please paste a job description first (or select a sample template) to run AI extraction.",
      });
      return;
    }

    setStatusBanner(null);
    setIsExtractingAi(true);

    try {
      const res = await fetch("/api/employers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ai_extract",
          description: textToAnalyze,
          title: titleToAnalyze,
          facilityType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI extraction failed");

      const mapped: SuggestedRequirementCheckbox[] = (
        data.suggestedRequirements || []
      ).map((item: any) => ({
        id: item.id,
        label: item.label,
        category: item.category || "Standardized Requirement",
        checked: Boolean(item.recommended),
      }));

      setAiCheckboxes(mapped);
      setStatusBanner({
        type: "info",
        text: `AI Assistant extracted ${mapped.length} standardized hospitality requirements. Review and toggle checkboxes below.`,
      });
    } catch (err: any) {
      setStatusBanner({
        type: "error",
        text: err.message || "AI extraction failed.",
      });
    } finally {
      setIsExtractingAi(false);
    }
  };

  const toggleAiCheckbox = (id: string) => {
    setAiCheckboxes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddCustomRequirement = () => {
    if (!customReqInput.trim()) return;
    const newItem: SuggestedRequirementCheckbox = {
      id: `custom-${Date.now()}`,
      label: customReqInput.trim(),
      category: "Custom Employer Requirement",
      checked: true,
    };
    setAiCheckboxes((prev) => [newItem, ...prev]);
    setCustomReqInput("");
  };

  // Interactive Map Click Handler (converts X/Y % on Kenya map canvas to Lat/Lng)
  const handleMapCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const clickY = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));

    // Map Kenya bounds roughly: Lat +4.5 (North) to -4.7 (South), Lng 33.9 (West) to 41.9 (East)
    const computedLat = Number((4.5 - (clickY / 100) * 9.2).toFixed(4));
    const computedLng = Number((33.9 + (clickX / 100) * 8.0).toFixed(4));

    setPinPos({ x: Math.round(clickX), y: Math.round(clickY) });
    setCoords({ lat: computedLat, lng: computedLng });
  };

  const handleSelectMapHub = (hub: (typeof KENYA_MAP_HUBS)[number]) => {
    setPinPos({ x: hub.x, y: hub.y });
    setCoords({ lat: hub.lat, lng: hub.lng });
    setJobLocationAddress(hub.address);
  };

  const handleUseBrowserGps = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
          });
          setPinPos({ x: 52, y: 60 });
          setJobLocationAddress(
            `GPS Pin (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`
          );
        },
        () => {
          // Fallback to Nairobi CBD if permission denied in sandbox
          handleSelectMapHub(KENYA_MAP_HUBS[0]);
        }
      );
    } else {
      handleSelectMapHub(KENYA_MAP_HUBS[0]);
    }
  };

  const toggleWeekDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Handler: Submit 'Post a Job' Wizard
  const handlePostJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusBanner(null);

    if (!jobTitle.trim() || !jobDescription.trim()) {
      setStatusBanner({
        type: "error",
        text: "Please enter a job title and job description before posting.",
      });
      return;
    }

    setIsPostingJob(true);

    try {
      const selectedFeatures = aiCheckboxes
        .filter((c) => c.checked)
        .map((c) => c.label);

      const finalLocation =
        locationType === "remote"
          ? "Remote (Kenya)"
          : locationType === "hybrid"
          ? `Hybrid — ${jobLocationAddress}`
          : jobLocationAddress;

      const res = await fetch("/api/employers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_job",
          employer_id: employer?.id,
          title: jobTitle,
          description: jobDescription,
          AI_suggested_features: selectedFeatures,
          location_type: locationType,
          location: finalLocation,
          location_coords: locationType === "remote" ? null : coords,
          salary_range: salaryRange,
          work_schedule: formattedWorkSchedule,
          accepts_work_placement: acceptsWorkPlacement,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post job");

      // Prepend new job listing to employer state
      setEmployer((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          job_listings: [data.jobListing, ...(prev.job_listings || [])],
        };
      });

      setStatusBanner({
        type: "success",
        text: acceptsWorkPlacement
          ? `Job "${data.jobListing.title}" posted! Flagged for Admin with 5% Work Placement Fee Discount.`
          : `Job "${data.jobListing.title}" posted and queued for Admin vetting.`,
      });

      // Reset form & switch to dashboard stages view
      setJobTitle("");
      setJobDescription("");
      setViewMode("dashboard");
      setDashboardTab("stages");
    } catch (err: any) {
      setStatusBanner({
        type: "error",
        text: err.message || "Failed to post job listing.",
      });
    } finally {
      setIsPostingJob(false);
    }
  };

  // Handler: Submit Employer Feedback / Issue Form
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setIsSubmittingFeedback(true);
    setStatusBanner(null);

    try {
      const res = await fetch("/api/employers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_feedback",
          employer_id: employer?.id,
          category: feedbackCategory,
          priority: feedbackPriority,
          relatedJobTitle: feedbackRelatedJob || "General Account",
          message: feedbackMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit feedback");

      setFeedbackTickets((prev) => [data.ticket, ...prev]);
      setFeedbackMessage("");
      setStatusBanner({
        type: "success",
        text: data.message,
      });
    } catch (err: any) {
      setStatusBanner({
        type: "error",
        text: err.message || "Failed to submit feedback.",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Handler: Settle or Toggle Monthly Fees
  const handleSettleFees = async (targetAmount: number) => {
    if (!employer) return;
    setIsProcessingFeePayment(true);
    try {
      const res = await fetch("/api/employers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: employer.id,
          outstanding_fees: targetAmount,
        }),
      });
      const data = await res.json();
      if (res.ok && data.employer) {
        setEmployer((prev: any) => ({
          ...prev,
          outstanding_fees: data.employer.outstanding_fees,
        }));
        setStatusBanner({
          type: "success",
          text:
            targetAmount === 0
              ? "Monthly placement invoice settled via M-Pesa Daraja! Outstanding balance is now KES 0."
              : `Simulated monthly invoice balance of KES ${targetAmount.toLocaleString()}.`,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingFeePayment(false);
    }
  };

  // Aggregate all applications across employer's job listings
  const allApplications: any[] = (employer?.job_listings || []).flatMap((job: any) =>
    (job.applications || []).map((app: any) => ({
      ...app,
      jobTitle: job.title,
      acceptsWorkPlacement: job.accepts_work_placement,
    }))
  );

  return (
    <div className="space-y-5 pb-28">
      {/* =====================================================================
          EMPLOYER HUB HEADER & MODE SWITCHER
         ===================================================================== */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#132226] via-chef-card to-chef-dark border border-emerald-500/30 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Employer Recruitment Hub
            </span>
            <h1 className="text-lg font-black text-white mt-1">
              {employer?.business_name || "Hospitality Employer Portal"}
            </h1>
          </div>

          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("onboarding")}
              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                viewMode === "onboarding"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              1. Onboarding
            </button>
            <button
              type="button"
              onClick={() => setViewMode("dashboard")}
              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                viewMode === "dashboard"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              2. Dashboard
            </button>
            <button
              type="button"
              onClick={() => setViewMode("post-job")}
              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 ${
                viewMode === "post-job"
                  ? "bg-brand-500 text-white shadow-md"
                  : "text-brand-300 hover:text-white"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Post a Job</span>
            </button>
          </div>
        </div>

        {/* Facility Quick Metadata Strip */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-300 pt-2 border-t border-white/10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
            <Users className="w-3 h-3 text-emerald-400" />
            <strong>Capacity:</strong> {employer?.max_catering_capacity || maxCapacity}{" "}
            Covers
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
            <BedDouble className="w-3 h-3 text-brand-400" />
            <strong>Boarding:</strong> {employer?.boarding_type || boardingType}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 truncate max-w-[220px]">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">
              {employer?.business_location || businessLocation}
            </span>
          </span>
        </div>
      </div>

      {/* Global Status Banner */}
      {statusBanner && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-2 ${
            statusBanner.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
              : statusBanner.type === "error"
              ? "bg-red-500/15 border-red-500/40 text-red-200"
              : "bg-brand-500/15 border-brand-500/40 text-brand-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusBanner.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{statusBanner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-[10px] underline opacity-75 hover:opacity-100 shrink-0"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* =====================================================================
          MODE 1: EMPLOYER ONBOARDING STEP
          (Business Capacity, Boarding Type, Location & Contact Details)
         ===================================================================== */}
      {viewMode === "onboarding" && (
        <motion.form
          key="employer-onboarding"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSaveOnboarding}
          className="p-5 rounded-3xl bg-chef-card border border-white/10 space-y-4"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Employer Facility Onboarding
              </h2>
              <p className="text-[11px] text-slate-400">
                Configure your maximum catering capacity, boarding type, and facility location.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label
                htmlFor="emp-business-name"
                className="block text-[11px] font-bold text-slate-300 mb-1"
              >
                Business / Institution Name *
              </label>
              <input
                id="emp-business-name"
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Rift Valley Grand Lodge & Conferencing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="emp-facility-type"
                  className="block text-[11px] font-bold text-slate-300 mb-1"
                >
                  Hospitality / Institutional Type *
                </label>
                <select
                  id="emp-facility-type"
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {FACILITY_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-slate-900">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="emp-location"
                  className="block text-[11px] font-bold text-slate-300 mb-1"
                >
                  Business Location (Town / County) *
                </label>
                <input
                  id="emp-location"
                  type="text"
                  required
                  value={businessLocation}
                  onChange={(e) => setBusinessLocation(e.target.value)}
                  placeholder="e.g. Moi South Lake Rd, Naivasha"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Maximum Catering Capacity Selector */}
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="emp-capacity"
                  className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Maximum Daily Catering Capacity (Covers / Meals) *</span>
                </label>
                <span className="text-xs font-black text-emerald-400">
                  {maxCapacity.toLocaleString()} Covers
                </span>
              </div>

              <input
                id="emp-capacity"
                type="number"
                min={10}
                max={20000}
                required
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
              />

              <div className="flex flex-wrap gap-1.5">
                {CAPACITY_PRESETS.map((cap) => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => setMaxCapacity(cap)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      maxCapacity === cap
                        ? "bg-emerald-500 text-slate-950 border-emerald-400"
                        : "bg-white/5 text-slate-300 border-white/10 hover:border-white/30"
                    }`}
                  >
                    {cap} Covers
                  </button>
                ))}
              </div>
            </div>

            {/* Boarding Type Selector */}
            <div>
              <span className="block text-[11px] font-bold text-slate-300 mb-1.5">
                Boarding / Residential Type *
              </span>
              <div
                role="radiogroup"
                aria-label="Boarding Type"
                className="grid grid-cols-1 gap-2"
              >
                {BOARDING_TYPES.map((b) => {
                  const isSelected = boardingType === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setBoardingType(b.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500 text-white shadow-md"
                          : "bg-black/30 border-white/10 text-slate-300 hover:border-white/25"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-extrabold block">{b.title}</span>
                        <span className="text-[10px] text-slate-400">{b.subtitle}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-emerald-500 border-emerald-400 text-slate-950"
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

            {/* Primary Contact Person */}
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
              <span className="text-[11px] font-bold text-emerald-300 block">
                Primary Hiring Contact Details
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Contact Person Name *"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                />
                <input
                  type="text"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  placeholder="Role (e.g. HR / Executive Chef)"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Phone (+254...)"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Official Email"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSavingOnboarding}
              className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isSavingOnboarding
                  ? "Saving Facility Profile..."
                  : "Save Onboarding & Open Dashboard"}
              </span>
            </button>
          </div>
        </motion.form>
      )}

      {/* =====================================================================
          MODE 2: EMPLOYER RECRUITMENT DASHBOARD
          (Ongoing Recruitment Stages, Outstanding Monthly Fees, Feedback Form)
         ===================================================================== */}
      {viewMode === "dashboard" && (
        <div className="space-y-4">
          {/* Sub-Navigation Pills */}
          <div className="grid grid-cols-3 gap-2 bg-chef-card p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setDashboardTab("stages")}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                dashboardTab === "stages"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Recruitment ({allApplications.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setDashboardTab("fees")}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                dashboardTab === "fees"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>
                Fees (KES {(employer?.outstanding_fees ?? 14250).toLocaleString()})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setDashboardTab("feedback")}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                dashboardTab === "feedback"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MessageSquareWarning className="w-3.5 h-3.5" />
              <span>Feedback ({feedbackTickets.length})</span>
            </button>
          </div>

          {/* -----------------------------------------------------------------
              DASHBOARD TAB 1: ONGOING RECRUITMENT STAGES & POSTED JOBS
             ----------------------------------------------------------------- */}
          {dashboardTab === "stages" && (
            <div className="space-y-4">
              {/* 7-Stage Recruitment Pipeline Overview */}
              <div className="p-4 rounded-3xl bg-chef-card border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Ongoing Recruitment Stages
                    </h2>
                    <p className="text-[10px] text-slate-400">
                      Strictly Admin-managed candidate vetting & placement pipeline
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewMode("post-job")}
                    className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-glow transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post a Job</span>
                  </button>
                </div>

                {/* Stage Counter Strip */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {RECRUITMENT_STAGES_META.map((st) => {
                    const count = allApplications.filter(
                      (a) => a.stage === st.id
                    ).length;
                    return (
                      <div
                        key={st.id}
                        className={`p-2 rounded-xl border text-center ${
                          count > 0
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                            : "bg-black/30 border-white/5 text-slate-500"
                        }`}
                      >
                        <span className="text-xs font-black block">{count}</span>
                        <span className="text-[9px] font-bold leading-tight block truncate">
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Active Candidate Applications List */}
                {allApplications.length > 0 ? (
                  <div className="space-y-2.5 pt-1">
                    {allApplications.map((app: any) => {
                      const stageMeta =
                        RECRUITMENT_STAGES_META.find((s) => s.id === app.stage) ||
                        RECRUITMENT_STAGES_META[0];
                      const progressPct = Math.round((stageMeta.step / 7) * 100);

                      return (
                        <div
                          key={app.id}
                          className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center space-x-2.5">
                              <img
                                src={
                                  app.prospective_employee?.headshot_url ||
                                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                                }
                                alt={
                                  app.prospective_employee?.full_name || "Candidate"
                                }
                                className="w-11 h-11 rounded-xl object-cover border border-emerald-500/40"
                              />
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h3 className="text-xs font-black text-white">
                                    {app.prospective_employee?.full_name ||
                                      "Vetted Candidate"}
                                  </h3>
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                                    {app.prospective_employee?.education_level ||
                                      "Diploma"}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400">
                                  Role: <strong className="text-slate-200">{app.jobTitle}</strong>
                                </p>
                              </div>
                            </div>

                            <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                              Stage {stageMeta.step}/7: {stageMeta.label}
                            </span>
                          </div>

                          {/* Visual Stage Progress Bar */}
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-brand-400 rounded-full transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>

                          {app.admin_notes && (
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-300">
                              <strong className="text-emerald-300">
                                Smart Chefs Admin Desk:
                              </strong>{" "}
                              {app.admin_notes}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                            <span>
                              Managed by:{" "}
                              <code className="text-slate-300">
                                {app.managed_by_admin_id}
                              </code>
                            </span>
                            {app.interview_scheduled_at && (
                              <span className="text-amber-300 font-semibold flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Interview:{" "}
                                {new Date(
                                  app.interview_scheduled_at
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-black/30 text-center text-xs text-slate-400">
                    No active candidate applications yet. Post a job below so Smart Chefs
                    Admins can shortlist candidates for you.
                  </div>
                )}
              </div>

              {/* Employer's Posted Job Listings */}
              <div className="p-4 rounded-3xl bg-chef-card border border-white/10 space-y-3">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Your Job Listings ({(employer?.job_listings || []).length})
                </h3>

                <div className="space-y-3">
                  {(employer?.job_listings || []).map((job: any) => (
                    <div
                      key={job.id}
                      className="p-3.5 rounded-2xl bg-black/35 border border-white/10 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-black text-white">{job.title}</h4>
                          <p className="text-[10px] text-slate-400">
                            {job.location} • {job.salary_range}
                          </p>
                        </div>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${
                            job.approval_status === "live"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          }`}
                        >
                          {job.approval_status === "live"
                            ? "Live Listing"
                            : "Pending Admin Approval"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                          Schedule: {job.work_schedule}
                        </span>
                        {job.accepts_work_placement && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            <span>Admin Flag: 5% Work Placement Discount</span>
                          </span>
                        )}
                      </div>

                      {job.AI_suggested_features?.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {job.AI_suggested_features.map((feat: string, i: number) => (
                            <span
                              key={i}
                              className="text-[9px] px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/25"
                            >
                              ✓ {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              DASHBOARD TAB 2: OUTSTANDING MONTHLY FEES & 5% DISCOUNT LEDGER
             ----------------------------------------------------------------- */}
          {dashboardTab === "fees" && (
            <div className="p-5 rounded-3xl bg-chef-card border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Outstanding Monthly Recruitment Fees
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Transparent billing with automatic 5% Work Placement fee discounts
                    </p>
                  </div>
                </div>
              </div>

              {/* Balance Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-black/60 to-black/30 border border-amber-500/30 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    Current Outstanding Balance
                  </span>
                  <span className="text-2xl font-black text-white">
                    KES {(employer?.outstanding_fees ?? 14250).toLocaleString()}
                  </span>
                </div>

                {/* Invoice Breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Standard Monthly Placement Retainer</span>
                    <span>KES 15,000</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>5% Work Placement Candidate Discount (Active Flag)</span>
                    <span>- KES 750 (5% Off)</span>
                  </div>
                  <div className="flex justify-between text-white font-black pt-1 border-t border-white/10">
                    <span>Net Monthly Invoice Due</span>
                    <span>
                      KES {(employer?.outstanding_fees ?? 14250).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    disabled={
                      isProcessingFeePayment ||
                      (employer?.outstanding_fees ?? 14250) === 0
                    }
                    onClick={() => handleSettleFees(0)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {(employer?.outstanding_fees ?? 14250) === 0
                        ? "Invoice Fully Paid"
                        : "Settle Invoice via M-Pesa STK Push"}
                    </span>
                  </button>

                  {(employer?.outstanding_fees ?? 14250) === 0 && (
                    <button
                      type="button"
                      onClick={() => handleSettleFees(14250)}
                      className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-[10px] font-bold"
                    >
                      Reset Demo Balance
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              DASHBOARD TAB 3: FEEDBACK / ISSUE SUBMISSION FORM
             ----------------------------------------------------------------- */}
          {dashboardTab === "feedback" && (
            <div className="space-y-4">
              <form
                onSubmit={handleFeedbackSubmit}
                className="p-5 rounded-3xl bg-chef-card border border-white/10 space-y-3.5"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                    <MessageSquareWarning className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Employer Feedback & Issue Submission Form
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Report candidate trial feedback, billing inquiries, or urgent staffing needs to Admin.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="fb-category"
                      className="block text-[11px] font-bold text-slate-300 mb-1"
                    >
                      Feedback / Issue Category
                    </label>
                    <select
                      id="fb-category"
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                    >
                      <option value="Candidate Performance & Placement" className="bg-slate-900">
                        Candidate Performance & Placement
                      </option>
                      <option value="Urgent Replacement / Staffing Issue" className="bg-slate-900">
                        Urgent Replacement / Staffing Issue
                      </option>
                      <option value="Monthly Fees & 5% Discount Billing" className="bg-slate-900">
                        Monthly Fees & 5% Discount Billing
                      </option>
                      <option value="Interview Scheduling Request" className="bg-slate-900">
                        Interview Scheduling Request
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="fb-priority"
                      className="block text-[11px] font-bold text-slate-300 mb-1"
                    >
                      Urgency Level
                    </label>
                    <select
                      id="fb-priority"
                      value={feedbackPriority}
                      onChange={(e) => setFeedbackPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                    >
                      <option value="Normal" className="bg-slate-900">
                        Normal (24h Admin SLA)
                      </option>
                      <option value="High Priority" className="bg-slate-900">
                        High Priority (4h SLA)
                      </option>
                      <option value="Urgent - Kitchen Line Down" className="bg-slate-900">
                        Urgent - Same Day Dispatch
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="fb-message"
                    className="block text-[11px] font-bold text-slate-300 mb-1"
                  >
                    Detailed Feedback or Issue Description *
                  </label>
                  <textarea
                    id="fb-message"
                    rows={3}
                    required
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Describe your feedback on shortlisted candidates, trial shift outcomes, or billing questions..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-glow transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmittingFeedback
                      ? "Dispatching to Admin Desk..."
                      : "Submit Feedback / Issue Ticket"}
                  </span>
                </button>
              </form>

              {/* Ticket Log */}
              <div className="p-4 rounded-3xl bg-chef-card border border-white/10 space-y-2.5">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Submitted Tickets & Admin Responses
                </h3>
                {feedbackTickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    className="p-3.5 rounded-2xl bg-black/35 border border-white/10 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-400">
                        {tkt.referenceCode} • {tkt.category}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {tkt.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200">{tkt.message}</p>
                    {tkt.adminResponse && (
                      <p className="text-[10px] text-emerald-300 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                        <strong>Admin Response:</strong> {tkt.adminResponse}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          MODE 3: 'POST A JOB' AI-ASSISTED WIZARD
          (AI Description Extractor -> Checkboxes, Interactive Map, Schedule Calendar,
           and Prominent 5% Work Placement Discount Flag)
         ===================================================================== */}
      {viewMode === "post-job" && (
        <motion.form
          key="post-job-wizard"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handlePostJobSubmit}
          className="space-y-4"
        >
          {/* SECTION 1: JOB TITLE, SALARY & AI-ASSISTED DESCRIPTION EXTRACTOR */}
          <div className="p-5 rounded-3xl bg-chef-card border border-white/10 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    1. Role Details & AI Requirement Extractor
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Paste a job description below to automatically extract standardized requirements as checkboxes.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Sample Templates for instant testing */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick-Fill Hospitality Description Templates:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_JOB_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.label}
                    type="button"
                    onClick={() => {
                      setJobTitle(tpl.title);
                      setSalaryRange(tpl.salary);
                      setJobDescription(tpl.description);
                      handleRunAiExtraction(tpl.description, tpl.title);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-brand-500/20 border border-white/10 hover:border-brand-500/40 text-[10px] font-bold text-brand-300 transition-all"
                  >
                    + {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="job-title-input"
                  className="block text-[11px] font-bold text-slate-300 mb-1"
                >
                  Job Title *
                </label>
                <input
                  id="job-title-input"
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Junior Sous Chef & Banquet Lead"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label
                  htmlFor="job-salary-input"
                  className="block text-[11px] font-bold text-slate-300 mb-1"
                >
                  Monthly Gross Salary Range (KES) *
                </label>
                <input
                  id="job-salary-input"
                  type="text"
                  required
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. KES 45,000 - 65,000 / month"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* AI-Assisted Job Description Text Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="ai-job-description"
                  className="text-[11px] font-bold text-slate-200"
                >
                  AI-Assisted Job Description Text Area *
                </label>
                <button
                  type="button"
                  disabled={isExtractingAi}
                  onClick={() => handleRunAiExtraction()}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white text-[10px] font-black flex items-center gap-1.5 shadow-glow transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isExtractingAi
                      ? "Analyzing Description..."
                      : "Extract & Suggest Requirements (AI)"}
                  </span>
                </button>
              </div>

              <textarea
                id="ai-job-description"
                rows={4}
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste your raw job description here (e.g. duties, Utalii/TVET qualifications, covers volume, HACCP requirements, live-in accommodation)... Then click 'Extract & Suggest Requirements (AI)'."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-black/50 border border-brand-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 leading-relaxed"
              />
            </div>

            {/* AI-Extracted Standardized Requirements as Checkboxes */}
            <div className="p-4 rounded-2xl bg-black/35 border border-brand-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-brand-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    AI-Suggested Standardized Requirements (
                    {aiCheckboxes.filter((c) => c.checked).length} Selected)
                  </span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Saved to <code>AI_suggested_features</code>
                </span>
              </div>

              <div
                role="group"
                aria-label="AI Suggested Job Requirements"
                className="grid grid-cols-1 gap-2"
              >
                {aiCheckboxes.map((item) => (
                  <label
                    key={item.id}
                    onClick={() => toggleAiCheckbox(item.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between gap-2 transition-all ${
                      item.checked
                        ? "bg-brand-500/15 border-brand-500/50 text-white"
                        : "bg-black/30 border-white/10 text-slate-400 hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {}}
                        className="sr-only"
                      />
                      {item.checked ? (
                        <CheckSquare className="w-4 h-4 text-brand-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300 shrink-0">
                      {item.category}
                    </span>
                  </label>
                ))}
              </div>

              {/* Add Custom Requirement Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customReqInput}
                  onChange={(e) => setCustomReqInput(e.target.value)}
                  placeholder="Add custom requirement checkbox (e.g. Valid BCE License)..."
                  className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddCustomRequirement}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold shrink-0"
                >
                  + Add Checkbox
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: INTERACTIVE MAP FOR JOB LOCATION (OR REMOTE / HYBRID) */}
          <div className="p-5 rounded-3xl bg-chef-card border border-white/10 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  2. Interactive Job Location Map (or Remote / Hybrid)
                </h2>
                <p className="text-[11px] text-slate-400">
                  Pin your kitchen/facility coordinates on the interactive map or choose Remote / Hybrid.
                </p>
              </div>
            </div>

            {/* Location Type Selector: On-Site Map Pin (coords) | Hybrid | Remote */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "coords", label: "On-Site Map Pin", icon: MapPin },
                { id: "hybrid", label: "Hybrid Location", icon: Globe },
                { id: "remote", label: "100% Remote", icon: Laptop },
              ].map((loc) => {
                const Icon = loc.icon;
                const active = locationType === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() =>
                      setLocationType(loc.id as "coords" | "hybrid" | "remote")
                    }
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      active
                        ? "bg-emerald-500/20 border-emerald-500 text-white shadow-md"
                        : "bg-black/30 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        active ? "text-emerald-400" : "text-slate-400"
                      }`}
                    />
                    <span>{loc.label}</span>
                  </button>
                );
              })}
            </div>

            {locationType !== "remote" ? (
              <div className="space-y-3">
                {/* Quick Kenyan Hospitality Hubs + GPS Button */}
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {KENYA_MAP_HUBS.map((hub) => (
                      <button
                        key={hub.name}
                        type="button"
                        onClick={() => handleSelectMapHub(hub)}
                        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/10 text-[10px] font-semibold text-slate-300 hover:text-emerald-300 transition-all"
                      >
                        📍 {hub.name}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleUseBrowserGps}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Use GPS</span>
                  </button>
                </div>

                {/* Interactive Map Canvas */}
                <div
                  onClick={handleMapCanvasClick}
                  role="application"
                  aria-label="Interactive Job Location Map - Click to place pin"
                  className="relative w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0c2128] via-[#102a24] to-[#0a141d] border border-emerald-500/40 cursor-crosshair select-none shadow-inner"
                >
                  {/* Coordinate Grid Overlay */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />

                  {/* Stylized Rift Valley & Lake Victoria / Coastline SVG Contours */}
                  <svg
                    viewBox="0 0 200 120"
                    className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
                  >
                    <path
                      d="M85,10 Q95,45 90,75 T110,115"
                      stroke="#34d399"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      fill="none"
                    />
                    <circle cx="48" cy="58" r="10" fill="#0ea5e9" fillOpacity="0.35" />
                    <path
                      d="M150,118 L175,85 L195,55"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>

                  {/* Hub Reference Dots */}
                  {KENYA_MAP_HUBS.map((hub) => (
                    <div
                      key={hub.name}
                      style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <div className="w-2 h-2 rounded-full bg-white/40" />
                    </div>
                  ))}

                  {/* Active Draggable/Clickable Pin */}
                  <div
                    style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-150"
                  >
                    <div className="relative flex flex-col items-center">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[9px] whitespace-nowrap shadow-lg mb-0.5">
                        {coords.lat}, {coords.lng}
                      </span>
                      <MapPin className="w-6 h-6 text-emerald-400 fill-emerald-500/40 drop-shadow" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] bg-black/65 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-slate-300">
                      Click anywhere on map to move pin
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      Lat: {coords.lat} • Lng: {coords.lng}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="job-location-address"
                    className="block text-[11px] font-bold text-slate-300 mb-1"
                  >
                    Street / Landmark Display Address *
                  </label>
                  <input
                    id="job-location-address"
                    type="text"
                    required
                    value={jobLocationAddress}
                    onChange={(e) => setJobLocationAddress(e.target.value)}
                    placeholder="e.g. Moi South Lake Road, Naivasha, Kenya"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs text-slate-300">
                This position will be listed as <strong>100% Remote</strong> (suitable for
                virtual culinary menu consultants, remote dietary planners, or central
                reservations agents).
              </div>
            )}
          </div>

          {/* SECTION 3: CALENDAR UI FOR WORK SCHEDULE */}
          <div className="p-5 rounded-3xl bg-chef-card border border-white/10 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  3. Work Schedule Calendar UI
                </h2>
                <p className="text-[11px] text-slate-400">
                  Select active workdays on the weekly calendar and configure shift hours (e.g. Mon-Fri 9-5).
                </p>
              </div>
            </div>

            {/* Schedule Presets */}
            <div className="flex flex-wrap gap-1.5">
              {SCHEDULE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setSelectedDays(preset.days);
                    setShiftStart(preset.start);
                    setShiftEnd(preset.end);
                    setShiftPattern(preset.shiftType);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-[10px] font-bold text-amber-300 transition-all"
                >
                  🗓️ {preset.label}
                </button>
              ))}
            </div>

            {/* 7-Day Interactive Calendar Grid */}
            <div>
              <span className="block text-[11px] font-bold text-slate-300 mb-1.5">
                Weekly Working Days Calendar (Tap to Toggle)
              </span>
              <div
                role="group"
                aria-label="Weekly Working Days Calendar"
                className="grid grid-cols-7 gap-1.5"
              >
                {WEEK_DAYS.map((day) => {
                  const isWorkDay = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={isWorkDay}
                      onClick={() => toggleWeekDay(day)}
                      className={`py-2.5 px-1 rounded-xl border text-center transition-all ${
                        isWorkDay
                          ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md"
                          : "bg-black/40 text-slate-500 border-white/10 hover:text-slate-300"
                      }`}
                    >
                      <span className="text-[11px] block">{day}</span>
                      <span className="text-[8px] uppercase tracking-tighter block mt-0.5">
                        {isWorkDay ? "On Shift" : "Off"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shift Start / End Time & Pattern */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label
                  htmlFor="shift-start"
                  className="block text-[10px] font-bold text-slate-400 mb-1"
                >
                  Start Time
                </label>
                <input
                  id="shift-start"
                  type="time"
                  value={shiftStart}
                  onChange={(e) => setShiftStart(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="shift-end"
                  className="block text-[10px] font-bold text-slate-400 mb-1"
                >
                  End Time
                </label>
                <input
                  id="shift-end"
                  type="time"
                  value={shiftEnd}
                  onChange={(e) => setShiftEnd(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="shift-pattern"
                  className="block text-[10px] font-bold text-slate-400 mb-1"
                >
                  Shift Pattern
                </label>
                <select
                  id="shift-pattern"
                  value={shiftPattern}
                  onChange={(e) => setShiftPattern(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                >
                  <option value="Standard Day Shift" className="bg-slate-900">
                    Standard Day Shift
                  </option>
                  <option value="6-Day Rotating Shift" className="bg-slate-900">
                    6-Day Rotating Shift
                  </option>
                  <option value="Split Shift (3hr afternoon break)" className="bg-slate-900">
                    Split Shift
                  </option>
                  <option value="Night / 24hr Rotation" className="bg-slate-900">
                    Night / 24hr Rotation
                  </option>
                  <option value="Weekend Event Crew" className="bg-slate-900">
                    Weekend Event Crew
                  </option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Generated Schedule:</span>
              <span className="text-amber-300 font-bold">{formattedWorkSchedule}</span>
            </div>
          </div>

          {/* SECTION 4: PROMINENT WORK PLACEMENT DISCOUNT CHECKBOX (ADMIN FLAG) */}
          <div
            onClick={() => setAcceptsWorkPlacement((prev) => !prev)}
            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all shadow-xl ${
              acceptsWorkPlacement
                ? "bg-gradient-to-r from-emerald-950/90 via-emerald-900/30 to-chef-card border-emerald-400"
                : "bg-chef-card border-white/15 hover:border-emerald-500/40"
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <input
                id="work-placement-checkbox"
                type="checkbox"
                checked={acceptsWorkPlacement}
                onChange={(e) => setAcceptsWorkPlacement(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 w-5 h-5 rounded accent-emerald-500 shrink-0"
              />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label
                    htmlFor="work-placement-checkbox"
                    className="text-xs sm:text-sm font-black text-white cursor-pointer leading-snug"
                  >
                    Accept Work Placement Candidates (Get a 5% discount on placement fees
                    for hiring candidates with little/no experience).
                  </label>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Checking this box flags your job listing for the{" "}
                  <strong className="text-emerald-300">
                    Smart Chefs Admin Placement Desk
                  </strong>{" "}
                  to match trained entry-level / TVET work-placement graduates and
                  automatically applies a <strong>5% fee discount</strong> on your monthly
                  placement invoice.
                </p>

                {acceptsWorkPlacement && (
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-extrabold mt-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>
                      ADMIN FLAG ACTIVE: 5% Placement Fee Discount Track Enabled
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Job Listing Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode("dashboard")}
              className="px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPostingJob}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-brand-500 hover:from-emerald-400 hover:to-brand-600 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-xl transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isPostingJob
                  ? "Publishing Job Listing..."
                  : acceptsWorkPlacement
                  ? "Publish Job (Flagged for 5% Placement Discount)"
                  : "Publish Job Listing"}
              </span>
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

