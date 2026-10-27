"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  UserCheck,
  Briefcase,
  GitPullRequest,
  MessageSquareWarning,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Sparkles,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileCheck2,
  Plus,
  Send,
  AlertCircle,
  Users,
  BedDouble,
} from "lucide-react";

const PIPELINE_STAGES = [
  { id: "SHORTLISTED", label: "1. Shortlisted" },
  { id: "ADMIN_VETTING", label: "2. Admin Vetting" },
  { id: "EMPLOYER_REVIEW", label: "3. Employer Review" },
  { id: "INTERVIEW_SCHEDULED", label: "4. Interview Set" },
  { id: "TRIAL_SHIFT", label: "5. Trial Shift" },
  { id: "OFFER_EXTENDED", label: "6. Offer Extended" },
  { id: "PLACED", label: "7. Placed ✓" },
  { id: "REJECTED", label: "Rejected" },
];

export const AdminPlacementDesk: React.FC = () => {
  const { dbUser } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "candidates" | "jobs" | "pipeline" | "tickets"
  >("candidates");

  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobListings, setJobListings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  const [candidateFilter, setCandidateFilter] = useState<"all" | "pending" | "live">(
    "all"
  );
  const [jobFilter, setJobFilter] = useState<"all" | "pending" | "work-placement">(
    "all"
  );

  // New Matchmaking Form State
  const [selectedPeId, setSelectedPeId] = useState<string>("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [matchStage, setMatchStage] = useState<string>("SHORTLISTED");
  const [matchNotes, setMatchNotes] = useState<string>("");
  const [matchInterviewDate, setMatchInterviewDate] = useState<string>("");
  const [isMatching, setIsMatching] = useState(false);

  // Ticket response draft map
  const [ticketReplies, setTicketReplies] = useState<Record<string, string>>({});

  const [banner, setBanner] = useState<{
    type: "success" | "info" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/recruitment")
      .then((res) => res.json())
      .then((data) => {
        if (data.candidates) {
          setCandidates(data.candidates);
          if (data.candidates[0]) setSelectedPeId(data.candidates[0].id);
        }
        if (data.jobListings) {
          setJobListings(data.jobListings);
          if (data.jobListings[0]) setSelectedJobId(data.jobListings[0].id);
        }
        if (data.applications) setApplications(data.applications);
        if (data.tickets) setTickets(data.tickets);
      })
      .catch((err) => console.error("Error loading Admin recruitment desk:", err));
  }, []);

  // KPI Metrics
  const pendingCandidatesCount = candidates.filter(
    (c) => c.approval_status === "pending"
  ).length;
  const pendingJobsCount = jobListings.filter(
    (j) => j.approval_status === "pending"
  ).length;
  const flaggedWorkPlacementCount = jobListings.filter(
    (j) => j.accepts_work_placement
  ).length;
  const openTicketsCount = tickets.filter((t) =>
    t.status?.toLowerCase().includes("open")
  ).length;

  // Handler: Vet Candidate (Approve / Reject / Toggle CV & Reference Verification)
  const handleVetCandidate = async (
    id: string,
    updates: {
      approval_status?: "pending" | "live" | "rejected";
      cvVerified?: boolean;
      referencesVerified?: boolean;
    }
  ) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    try {
      const res = await fetch("/api/admin/recruitment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "vet_candidate",
          id,
          ...updates,
        }),
      });
      if (res.ok && updates.approval_status) {
        setBanner({
          type: "success",
          text: `Candidate status updated to "${updates.approval_status.toUpperCase()}".`,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Vet Job Listing & Apply 5% Work Placement Fee Discount
  const handleVetJob = async (
    jobId: string,
    approval_status: "pending" | "live" | "rejected",
    applyFivePercentDiscount = false
  ) => {
    setJobListings((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        const updatedEmployer =
          applyFivePercentDiscount && j.employer
            ? {
                ...j.employer,
                outstanding_fees:
                  (j.employer.outstanding_fees || 15000) >= 15000
                    ? Math.round((j.employer.outstanding_fees || 15000) * 0.95)
                    : j.employer.outstanding_fees,
              }
            : j.employer;
        return { ...j, approval_status, employer: updatedEmployer };
      })
    );

    try {
      await fetch("/api/admin/recruitment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "vet_job",
          job_listing_id: jobId,
          approval_status,
          applyFivePercentDiscount,
        }),
      });
      setBanner({
        type: "success",
        text: applyFivePercentDiscount
          ? "Job listing approved to LIVE & 5% Work Placement Discount applied to employer ledger!"
          : `Job listing updated to "${approval_status.toUpperCase()}".`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Create New Admin-Managed Match (Application)
  const handleCreateAdminMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeId || !selectedJobId) return;

    setIsMatching(true);
    setBanner(null);

    try {
      const res = await fetch("/api/admin/recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_application",
          prospective_employee_id: selectedPeId,
          job_listing_id: selectedJobId,
          stage: matchStage,
          managed_by_admin_id: dbUser?.id || "admin_smart_chef_001",
          admin_notes:
            matchNotes ||
            "Matched by Smart Chefs Admin Placement Desk following qualification & reference review.",
          interview_scheduled_at: matchInterviewDate || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create placement match");

      setApplications((prev) => {
        const filtered = prev.filter((a) => a.id !== data.application.id);
        return [data.application, ...filtered];
      });

      setMatchNotes("");
      setMatchInterviewDate("");
      setBanner({
        type: "success",
        text: data.message,
      });
    } catch (err: any) {
      setBanner({
        type: "error",
        text: err.message || "Failed to match candidate.",
      });
    } finally {
      setIsMatching(false);
    }
  };

  // Handler: Advance / Update Application Stage
  const handleUpdateApplicationStage = async (
    applicationId: string,
    newStage: string,
    adminNotes?: string
  ) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              stage: newStage,
              ...(typeof adminNotes === "string" ? { admin_notes: adminNotes } : {}),
              ...(newStage === "PLACED"
                ? { placed_at: new Date().toISOString() }
                : {}),
            }
          : a
      )
    );

    try {
      await fetch("/api/admin/recruitment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_application_stage",
          application_id: applicationId,
          stage: newStage,
          admin_notes: adminNotes,
          managed_by_admin_id: dbUser?.id || "admin_smart_chef_001",
        }),
      });

      setBanner({
        type: "info",
        text: `Application stage updated to ${newStage}.`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Respond to Employer Ticket
  const handleResolveTicket = async (ticketId: string) => {
    const replyText =
      ticketReplies[ticketId] ||
      "Confirmed and processed by the Smart Chefs Admin Placement Desk.";

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              adminResponse: replyText,
              status: "Resolved by Admin Desk",
            }
          : t
      )
    );

    try {
      await fetch("/api/admin/recruitment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resolve_ticket",
          ticket_id: ticketId,
          adminResponse: replyText,
          status: "Resolved by Admin Desk",
        }),
      });
      setBanner({
        type: "success",
        text: "Admin response sent and employer ticket marked resolved.",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    if (candidateFilter === "pending") return c.approval_status === "pending";
    if (candidateFilter === "live") return c.approval_status === "live";
    return true;
  });

  const filteredJobs = jobListings.filter((j) => {
    if (jobFilter === "pending") return j.approval_status === "pending";
    if (jobFilter === "work-placement") return Boolean(j.accepts_work_placement);
    return true;
  });

  return (
    <div className="space-y-5 pb-28">
      {/* =====================================================================
          ADMIN DESK HEADER & KPI STRIP
         ===================================================================== */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1f1633] via-chef-card to-chef-dark border border-purple-500/35 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
              Strictly Admin-Managed Workflow
            </span>
            <h1 className="text-lg font-black text-white mt-1">
              Admin Vetting & Placement Desk
            </h1>
            <p className="text-xs text-slate-300">
              Verify Kenyan qualifications & CVs, approve 5%-discounted Work Placement
              jobs, and manage candidate stages.
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* 4-Metric KPI Strip */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
            <span className="text-sm font-black text-amber-400 block">
              {pendingCandidatesCount}
            </span>
            <span className="text-[9px] font-bold text-slate-400 leading-tight block">
              Pending PEs
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
            <span className="text-sm font-black text-emerald-400 block">
              {flaggedWorkPlacementCount}
            </span>
            <span className="text-[9px] font-bold text-slate-400 leading-tight block">
              5% Flag Jobs
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
            <span className="text-sm font-black text-brand-400 block">
              {applications.length}
            </span>
            <span className="text-[9px] font-bold text-slate-400 leading-tight block">
              Active Matches
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
            <span className="text-sm font-black text-purple-300 block">
              {openTicketsCount}
            </span>
            <span className="text-[9px] font-bold text-slate-400 leading-tight block">
              Open Tickets
            </span>
          </div>
        </div>
      </div>

      {/* Global Admin Action Feedback Banner */}
      {banner && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-2 ${
            banner.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
              : banner.type === "error"
              ? "bg-red-500/15 border-red-500/40 text-red-200"
              : "bg-purple-500/15 border-purple-500/40 text-purple-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{banner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="text-[10px] underline opacity-75 hover:opacity-100"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* =====================================================================
          ADMIN DESK 4-TAB NAVIGATION
         ===================================================================== */}
      <div className="grid grid-cols-4 gap-1.5 bg-chef-card p-1.5 rounded-2xl border border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("candidates")}
          className={`py-2 px-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === "candidates"
              ? "bg-purple-500 text-white shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>PE Vetting ({candidates.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("jobs")}
          className={`py-2 px-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === "jobs"
              ? "bg-purple-500 text-white shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Jobs & 5% ({jobListings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pipeline")}
          className={`py-2 px-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === "pipeline"
              ? "bg-purple-500 text-white shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>Pipeline ({applications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tickets")}
          className={`py-2 px-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === "tickets"
              ? "bg-purple-500 text-white shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <MessageSquareWarning className="w-3.5 h-3.5" />
          <span>Issues ({tickets.length})</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: PROSPECTIVE EMPLOYEE (PE) VETTING QUEUE
         ===================================================================== */}
      {activeTab === "candidates" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Candidate Vetting & Reference Verification
            </h2>
            <div className="flex gap-1">
              {[
                { id: "all", label: "All" },
                { id: "pending", label: `Pending (${pendingCandidatesCount})` },
                { id: "live", label: "Live" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() =>
                    setCandidateFilter(f.id as "all" | "pending" | "live")
                  }
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    candidateFilter === f.id
                      ? "bg-purple-500 text-white"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                className="p-4 rounded-3xl bg-chef-card border border-white/10 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        cand.headshot_url ||
                        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                      }
                      alt={cand.full_name}
                      className="w-14 h-14 rounded-2xl object-cover border border-purple-500/40 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-black text-white">
                          {cand.full_name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {cand.education_level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {cand.phone} {cand.email ? `• ${cand.email}` : ""}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(cand.selected_job_categories || []).map((role: string) => (
                          <span
                            key={role}
                            className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-200"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${
                      cand.approval_status === "live"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : cand.approval_status === "rejected"
                        ? "bg-red-500/20 text-red-300 border-red-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {cand.approval_status === "live"
                      ? "LIVE IN MARKETPLACE"
                      : cand.approval_status === "rejected"
                      ? "REJECTED"
                      : "PENDING ADMIN REVIEW"}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 bg-black/35 p-3 rounded-2xl border border-white/5 space-y-1">
                  <p>
                    <strong className="text-slate-200">Qualifications:</strong>{" "}
                    {cand.qualifications}
                  </p>
                  <p>
                    <strong className="text-slate-200">Experience:</strong>{" "}
                    {cand.experience}
                  </p>
                  {Array.isArray(cand.references) && cand.references[0] && (
                    <p className="text-[10px] text-purple-300 pt-1">
                      <strong>Reference:</strong> {cand.references[0].name} (
                      {cand.references[0].relationship || "Referee"}) —{" "}
                      {cand.references[0].phone}
                    </p>
                  )}
                </div>

                {/* Verification Check Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleVetCandidate(cand.id, {
                          cvVerified: !cand.cvVerified,
                        })
                      }
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border flex items-center gap-1 transition-all ${
                        cand.cvVerified
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-black/40 text-slate-400 border-white/10"
                      }`}
                    >
                      <FileCheck2 className="w-3 h-3" />
                      <span>
                        {cand.cvVerified ? "CV Verified ✓" : "Mark CV Verified"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleVetCandidate(cand.id, {
                          referencesVerified: !cand.referencesVerified,
                        })
                      }
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border flex items-center gap-1 transition-all ${
                        cand.referencesVerified
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-black/40 text-slate-400 border-white/10"
                      }`}
                    >
                      <Phone className="w-3 h-3" />
                      <span>
                        {cand.referencesVerified
                          ? "References Verified ✓"
                          : "Verify Referee"}
                      </span>
                    </button>
                  </div>

                  {/* Approve / Reject / Match Buttons */}
                  <div className="flex items-center gap-1.5">
                    {cand.approval_status !== "live" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleVetCandidate(cand.id, { approval_status: "live" })
                        }
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] flex items-center gap-1 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve to Live</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleVetCandidate(cand.id, { approval_status: "pending" })
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-[10px]"
                      >
                        Set Pending
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPeId(cand.id);
                        setActiveTab("pipeline");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/40 font-bold text-[10px] transition-all"
                    >
                      Match to Job →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: EMPLOYER JOB LISTINGS & 5% WORK PLACEMENT FLAGS
         ===================================================================== */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Job Listings & 5% Work Placement Flags
            </h2>
            <div className="flex gap-1">
              {[
                { id: "all", label: "All Jobs" },
                { id: "pending", label: `Pending (${pendingJobsCount})` },
                {
                  id: "work-placement",
                  label: `5% Flagged (${flaggedWorkPlacementCount})`,
                },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() =>
                    setJobFilter(f.id as "all" | "pending" | "work-placement")
                  }
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    jobFilter === f.id
                      ? "bg-purple-500 text-white"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`p-4 rounded-3xl bg-chef-card border space-y-3 ${
                  job.accepts_work_placement
                    ? "border-emerald-500/40"
                    : "border-white/10"
                }`}
              >
                {/* Prominent Admin Alert Banner if Employer Flagged 5% Work Placement */}
                {job.accepts_work_placement && (
                  <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-emerald-300">
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        ADMIN FLAG: Employer Accepts Work Placement Candidates (5% Fee
                        Discount Track)
                      </span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 shrink-0">
                      -5% Invoice Fee
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-white">{job.title}</h3>
                    <p className="text-[11px] text-purple-300 font-semibold">
                      {job.employer?.business_name || "Hospitality Employer"} •{" "}
                      {job.location}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {job.salary_range} • {job.work_schedule}
                    </p>
                  </div>

                  <span
                    className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${
                      job.approval_status === "live"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {job.approval_status === "live"
                      ? "LIVE LISTING"
                      : "PENDING APPROVAL"}
                  </span>
                </div>

                {/* Employer Capacity & Boarding Metadata */}
                {job.employer && (
                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-300">
                    <span className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10">
                      Capacity: <strong>{job.employer.max_catering_capacity}</strong>{" "}
                      Covers
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10">
                      Boarding: <strong>{job.employer.boarding_type}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10">
                      Employer Ledger:{" "}
                      <strong className="text-amber-300">
                        KES {(job.employer.outstanding_fees || 15000).toLocaleString()}
                      </strong>
                    </span>
                  </div>
                )}

                {/* AI Extracted Requirements */}
                {job.AI_suggested_features?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {job.AI_suggested_features.map((feat: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[9px] px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/25"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/10">
                  {job.approval_status !== "live" ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleVetJob(
                          job.id,
                          "live",
                          Boolean(job.accepts_work_placement)
                        )
                      }
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] flex items-center gap-1.5 shadow-lg transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {job.accepts_work_placement
                          ? "Approve Job & Apply 5% Fee Discount"
                          : "Approve Job to Live"}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleVetJob(job.id, "pending", false)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-[10px] font-bold"
                    >
                      Move to Pending
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setActiveTab("pipeline");
                    }}
                    className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/40 text-[10px] font-bold transition-all"
                  >
                    Assign Candidate →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: ADMIN MATCHMAKING & 7-STAGE PIPELINE CONTROL
         ===================================================================== */}
      {activeTab === "pipeline" && (
        <div className="space-y-4">
          {/* Admin Matchmaking Form */}
          <form
            onSubmit={handleCreateAdminMatch}
            className="p-5 rounded-3xl bg-chef-card border border-purple-500/35 space-y-3.5"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  Create Admin-Managed Placement Match
                </h2>
                <p className="text-[11px] text-slate-400">
                  Assign a vetted Prospective Employee to an Employer Job Listing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="admin-select-pe"
                  className="block text-[11px] font-bold text-slate-300 mb-1"
                >
                  Select Prospective Employee *
                </label>
                <select
                  id="admin-select-pe"
                  value={selectedPeId}
                  onChange={(e) => setSelectedPeId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900">
                      {c.full_name} ({c.education_level} •{" "}
                      {(c.selected_job_categories || []).join("/")})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="admin-select-job"
                  className="block text-[11px] font-bold text-slate-300 mb-1"
                >
                  Select Employer Job Listing *
                </label>
                <select
                  id="admin-select-job"
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                >
                  {jobListings.map((j) => (
                    <option key={j.id} value={j.id} className="bg-slate-900">
                      {j.title} — {j.employer?.business_name || "Employer"}{" "}
                      {j.accepts_work_placement ? "(5% Discount Track)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="admin-match-stage"
                  className="block text-[11px] font-bold text-slate-300 mb-1"
                >
                  Initial Recruitment Stage
                </label>
                <select
                  id="admin-match-stage"
                  value={matchStage}
                  onChange={(e) => setMatchStage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                >
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="admin-interview-date"
                  className="block text-[11px] font-bold text-slate-300 mb-1"
                >
                  Schedule Interview Date (Optional)
                </label>
                <input
                  id="admin-interview-date"
                  type="date"
                  value={matchInterviewDate}
                  onChange={(e) => setMatchInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-match-notes"
                className="block text-[11px] font-bold text-slate-300 mb-1"
              >
                Admin Vetting & Placement Notes
              </label>
              <input
                id="admin-match-notes"
                type="text"
                value={matchNotes}
                onChange={(e) => setMatchNotes(e.target.value)}
                placeholder="e.g. Verified Utalii Diploma & HACCP score (96%). Eligible for 5% Work Placement discount."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isMatching}
              className="w-full py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>
                {isMatching
                  ? "Creating Admin Placement Match..."
                  : "Assign Candidate to Job Pipeline"}
              </span>
            </button>
          </form>

          {/* Active Applications Stage Controller */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Active Admin-Managed Placements ({applications.length})
            </h3>

            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-3xl bg-chef-card border border-white/10 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-purple-300">
                      Candidate:{" "}
                      <strong className="text-white">
                        {app.prospective_employee?.full_name || "Candidate"}
                      </strong>{" "}
                      ({app.prospective_employee?.education_level || "Verified"})
                    </span>
                    <h4 className="text-xs font-black text-white mt-0.5">
                      → {app.job_listing?.title || "Hospitality Role"} (
                      {app.job_listing?.employer?.business_name || "Verified Employer"})
                    </h4>
                  </div>

                  <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0">
                    {app.stage}
                  </span>
                </div>

                {app.admin_notes && (
                  <p className="text-[11px] text-slate-300 bg-black/35 p-2.5 rounded-xl border border-white/5">
                    <strong className="text-purple-300">Admin Notes:</strong>{" "}
                    {app.admin_notes}
                  </p>
                )}

                {/* Interactive Stage Selector Pills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 block">
                    Advance / Change Recruitment Stage:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PIPELINE_STAGES.map((st) => {
                      const isCurrent = app.stage === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => handleUpdateApplicationStage(app.id, st.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                            isCurrent
                              ? "bg-purple-500 text-white border-purple-400 shadow"
                              : "bg-black/40 text-slate-400 border-white/10 hover:text-white"
                          }`}
                        >
                          {st.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: EMPLOYER FEEDBACK & BILLING ISSUE DESK
         ===================================================================== */}
      {activeTab === "tickets" && (
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-white uppercase tracking-wider">
            Employer Feedback, Replacement & 5% Discount Billing Tickets
          </h2>

          {tickets.map((tkt) => (
            <div
              key={tkt.id}
              className="p-4 rounded-3xl bg-chef-card border border-white/10 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-300">
                    {tkt.referenceCode} • {tkt.employer_name || "Hospitality Employer"}
                  </span>
                  <h3 className="text-xs font-black text-white mt-0.5">
                    {tkt.category} — {tkt.relatedJobTitle}
                  </h3>
                </div>
                <span
                  className={`text-[9px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                    tkt.status?.includes("Resolved")
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {tkt.status}
                </span>
              </div>

              <p className="text-xs text-slate-200 bg-black/35 p-3 rounded-2xl border border-white/5">
                {tkt.message}
              </p>

              {tkt.adminResponse && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-200">
                  <strong>Official Admin Response:</strong> {tkt.adminResponse}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={ticketReplies[tkt.id] || ""}
                  onChange={(e) =>
                    setTicketReplies((prev) => ({
                      ...prev,
                      [tkt.id]: e.target.value,
                    }))
                  }
                  placeholder="Write official Admin Desk response or billing confirmation..."
                  className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => handleResolveTicket(tkt.id)}
                  className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-[10px] font-black flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Reply & Resolve</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

