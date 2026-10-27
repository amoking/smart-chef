import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminStageType =
  | "SHORTLISTED"
  | "ADMIN_VETTING"
  | "EMPLOYER_REVIEW"
  | "INTERVIEW_SCHEDULED"
  | "TRIAL_SHIFT"
  | "OFFER_EXTENDED"
  | "PLACED"
  | "REJECTED"
  | "WITHDRAWN";

// Shared in-memory state for seamless fallback when PostgreSQL tables are not yet migrated
const adminCandidatesStore: any[] = [
  {
    id: "pe_demo_amina_001",
    userId: null,
    full_name: "Amina Hassan",
    education_level: "Diploma",
    phone: "+254733445566",
    email: "amina.hassan@example.com",
    qualifications:
      "Diploma in Food & Beverage Production and Service (Kenya Utalii College), HACCP Level 2 Certified",
    experience:
      "4 years as Commis & Demi Chef de Partie in coastal resorts and boutique hotels in Mombasa and Nairobi.",
    references: [
      {
        name: "Chef Juma Bakari",
        relationship: "Executive Chef - Serena Beach Resort",
        phone: "+254712000111",
        email: "j.bakari@serena-example.co.ke",
      },
    ],
    selected_job_categories: ["Chef", "Waitstaff"],
    headshot_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    approval_status: "live",
    linked_training_modules: ["food-safety-haccp", "silver-service-etiquette"],
    cvVerified: true,
    referencesVerified: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pe_demo_brian_002",
    userId: null,
    full_name: "Brian Omondi",
    education_level: "Certificate",
    phone: "+254744556677",
    email: "brian.omondi@example.com",
    qualifications:
      "Certificate in Institutional Catering & Storekeeping (TVET), FIFO Inventory Control Certification",
    experience:
      "1 year industrial attachment managing dry & cold stores and institutional kitchen prep for a 600-student boarding school (Work Placement Track).",
    references: [
      {
        name: "Peter Kamau",
        relationship: "Cateress / Procurement Head - Brookhouse",
        phone: "+254734000333",
        email: "p.kamau@school-example.ac.ke",
      },
    ],
    selected_job_categories: ["Chef", "Laundry", "Transport"],
    headshot_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    approval_status: "pending",
    linked_training_modules: ["food-safety-haccp"],
    cvVerified: false,
    referencesVerified: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pe_demo_grace_003",
    userId: null,
    full_name: "Grace Wanjiku Muthoni",
    education_level: "KCSE",
    phone: "+254722998811",
    email: "grace.muthoni@example.com",
    qualifications:
      "KCSE Certificate + Smart Chefs Practical Housekeeping & Front Office Orientation",
    experience:
      "Entry-level Work Placement candidate trained in silver service table setup and commercial laundry care.",
    references: [
      {
        name: "Mercy Njoroge",
        relationship: "Executive Housekeeper - Villa Rosa",
        phone: "+254720111222",
        email: "m.njoroge@hotel-example.co.ke",
      },
    ],
    selected_job_categories: ["Waitstaff", "Laundry", "Receptionist"],
    headshot_url:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80",
    approval_status: "pending",
    linked_training_modules: ["silver-service-etiquette", "commercial-laundry-care"],
    cvVerified: true,
    referencesVerified: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const adminJobsStore: any[] = [
  {
    id: "job_demo_sous_001",
    employer_id: "emp_demo_norfolk_001",
    title: "Junior Sous Chef & Banquet Line Lead",
    description:
      "Seeking an energetic Junior Sous Chef to oversee high-volume banquet production (up to 850 covers) and à la carte fine dining service.",
    AI_suggested_features: [
      "HACCP & Food Safety Compliance",
      "Valid County Food Handler's Medical Certificate",
      "High-Volume Banquet & Buffet Execution (300+ Covers)",
      "Menu Costing, Portion Control & BOH FIFO Waste Reduction",
      "Staff Accommodation / Duty Meals Provided",
    ],
    location_type: "coords",
    location: "Moi South Lake Road, Naivasha, Kenya",
    location_coords: { lat: -0.7852, lng: 36.3534 },
    salary_range: "KES 55,000 - 75,000 / month",
    work_schedule: "Mon–Sat • 08:00 – 17:00 (Rotating Split Shift)",
    accepts_work_placement: true,
    approval_status: "live",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    employer: {
      id: "emp_demo_norfolk_001",
      business_name: "Rift Valley Grand Lodge & Conferencing",
      business_location: "Naivasha, Nakuru County",
      type: "Hotel & Conference Resort",
      max_catering_capacity: 850,
      boarding_type: "Residential Hospitality & Full-Board",
      contact_name: "Chef Sarah Wanjiku",
      outstanding_fees: 14250.0,
    },
  },
  {
    id: "job_demo_cateress_002",
    employer_id: "emp_demo_brookhouse_002",
    title: "Boarding School Assistant Cateress & Stores Lead",
    description:
      "Supervise morning/evening meal service for 600 boarding students, maintain dry-store FIFO stock cards, and mentor TVET work placement trainees.",
    AI_suggested_features: [
      "HACCP & Food Safety Compliance",
      "Menu Costing, Portion Control & BOH FIFO Waste Reduction",
      "Allergen Management & Special Dietary Menu Prep",
      "Staff Accommodation / Duty Meals Provided",
    ],
    location_type: "coords",
    location: "Karen / Langata Road, Nairobi, Kenya",
    location_coords: { lat: -1.3562, lng: 36.7319 },
    salary_range: "KES 42,000 - 55,000 / month",
    work_schedule: "Mon-Fri 06:30-16:30 (Full Boarding Shift)",
    accepts_work_placement: true,
    approval_status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    employer: {
      id: "emp_demo_brookhouse_002",
      business_name: "Highlands Boarding Academy",
      business_location: "Karen, Nairobi County",
      type: "Boarding School / University",
      max_catering_capacity: 600,
      boarding_type: "Full Boarding Institution",
      contact_name: "Peter Kamau",
      outstanding_fees: 15000.0,
    },
  },
];

const adminApplicationsStore: any[] = [
  {
    id: "app_demo_amina_001",
    prospective_employee_id: "pe_demo_amina_001",
    job_listing_id: "job_demo_sous_001",
    stage: "INTERVIEW_SCHEDULED",
    managed_by_admin_id: "admin_smart_chef_001",
    admin_notes:
      "Candidate completed Smart Chef Kitchen Hygiene & Service modules with 96% score. Utalii Diploma & Serena Beach reference verified.",
    interview_scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    placed_at: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app_demo_brian_002",
    prospective_employee_id: "pe_demo_brian_002",
    job_listing_id: "job_demo_cateress_002",
    stage: "ADMIN_VETTING",
    managed_by_admin_id: "admin_smart_chef_001",
    admin_notes:
      "Work Placement Track candidate (5% Employer Fee Discount eligible). Verifying TVET certificate before forwarding to employer review.",
    interview_scheduled_at: null,
    placed_at: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const adminTicketsStore: any[] = [
  {
    id: "tkt_demo_001",
    referenceCode: "SC-EMP-TKT-901",
    employer_name: "Rift Valley Grand Lodge & Conferencing",
    category: "Candidate Performance & Placement",
    priority: "Normal",
    relatedJobTitle: "Junior Sous Chef & Banquet Line Lead",
    message:
      "Requesting practical knife-skills assessment scorecard for shortlisted candidates before Friday's panel interview.",
    status: "In Review by Admin Desk",
    adminResponse:
      "Smart Chefs Admin Desk has attached Amina Hassan's HACCP & Westlands Culinary Lab scorecard (96%).",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "tkt_demo_002",
    referenceCode: "SC-EMP-TKT-908",
    employer_name: "Highlands Boarding Academy",
    category: "Monthly Fees & 5% Discount Billing",
    priority: "High Priority",
    relatedJobTitle: "Boarding School Assistant Cateress & Stores Lead",
    message:
      "We opted into accepting Work Placement Candidates on our new job listing. Please confirm the 5% fee discount is applied to our monthly invoice.",
    status: "Open — Needs Admin Action",
    adminResponse: null,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

function hydrateApplications(
  apps: any[],
  candidates: any[],
  jobs: any[]
) {
  return apps.map((app) => {
    const candidate =
      app.prospective_employee ||
      candidates.find((c) => c.id === app.prospective_employee_id) ||
      candidates[0];
    const job =
      app.job_listing ||
      jobs.find((j) => j.id === app.job_listing_id) ||
      jobs[0];
    return {
      ...app,
      prospective_employee: candidate,
      job_listing: job,
    };
  });
}

export async function GET(req: NextRequest) {
  const statusFilter = req.nextUrl.searchParams.get("status");
  void statusFilter;
  try {
    const anyPrisma = prisma as any;
    if (
      anyPrisma.prospective_Employees &&
      anyPrisma.job_Listings &&
      anyPrisma.applications
    ) {
      const [dbCandidates, dbJobs, dbApps] = await Promise.all([
        anyPrisma.prospective_Employees.findMany({
          orderBy: { createdAt: "desc" },
        }),
        anyPrisma.job_Listings.findMany({
          include: { employer: true },
          orderBy: { createdAt: "desc" },
        }),
        anyPrisma.applications.findMany({
          include: {
            prospective_employee: true,
            job_listing: { include: { employer: true } },
          },
          orderBy: { updatedAt: "desc" },
        }),
      ]);

      if (dbCandidates.length > 0 || dbJobs.length > 0) {
        return NextResponse.json({
          candidates: dbCandidates,
          jobListings: dbJobs,
          applications: dbApps,
          tickets: adminTicketsStore,
        });
      }
    }
  } catch (err) {
    console.warn("Admin recruitment GET falling back to in-memory store:", err);
  }

  return NextResponse.json({
    candidates: adminCandidatesStore,
    jobListings: adminJobsStore,
    applications: hydrateApplications(
      adminApplicationsStore,
      adminCandidatesStore,
      adminJobsStore
    ),
    tickets: adminTicketsStore,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action,
      prospective_employee_id,
      job_listing_id,
      stage,
      managed_by_admin_id,
      admin_notes,
      interview_scheduled_at,
    } = body;

    if (action === "create_application") {
      if (!prospective_employee_id || !job_listing_id) {
        return NextResponse.json(
          { error: "Please select both a candidate and a job listing to match." },
          { status: 400 }
        );
      }

      const adminId = managed_by_admin_id || "admin_smart_chef_001";
      const targetStage: AdminStageType = stage || "SHORTLISTED";

      let createdApp: any = null;

      try {
        const anyPrisma = prisma as any;
        if (anyPrisma.applications) {
          createdApp = await anyPrisma.applications.upsert({
            where: {
              prospective_employee_id_job_listing_id: {
                prospective_employee_id,
                job_listing_id,
              },
            },
            update: {
              stage: targetStage,
              managed_by_admin_id: adminId,
              admin_notes: admin_notes || null,
              interview_scheduled_at: interview_scheduled_at
                ? new Date(interview_scheduled_at)
                : null,
            },
            create: {
              prospective_employee_id,
              job_listing_id,
              stage: targetStage,
              managed_by_admin_id: adminId,
              admin_notes: admin_notes || null,
              interview_scheduled_at: interview_scheduled_at
                ? new Date(interview_scheduled_at)
                : null,
            },
            include: {
              prospective_employee: true,
              job_listing: { include: { employer: true } },
            },
          });
        }
      } catch (dbErr) {
        console.warn("DB fallback for Admin create_application:", dbErr);
      }

      if (!createdApp) {
        const existingIdx = adminApplicationsStore.findIndex(
          (a) =>
            a.prospective_employee_id === prospective_employee_id &&
            a.job_listing_id === job_listing_id
        );

        const newRecord = {
          id:
            existingIdx !== -1
              ? adminApplicationsStore[existingIdx].id
              : `app_${Date.now()}`,
          prospective_employee_id,
          job_listing_id,
          stage: targetStage,
          managed_by_admin_id: adminId,
          admin_notes:
            admin_notes ||
            "Matched by Smart Chefs Admin Placement Desk after reference & module check.",
          interview_scheduled_at: interview_scheduled_at || null,
          placed_at: targetStage === "PLACED" ? new Date().toISOString() : null,
          createdAt: new Date().toISOString(),
        };

        if (existingIdx !== -1) {
          adminApplicationsStore[existingIdx] = newRecord;
        } else {
          adminApplicationsStore.unshift(newRecord);
        }

        createdApp = hydrateApplications(
          [newRecord],
          adminCandidatesStore,
          adminJobsStore
        )[0];
      }

      return NextResponse.json({
        success: true,
        application: createdApp,
        message: `Candidate matched to job at stage ${targetStage} by Admin (${adminId}).`,
      });
    }

    return NextResponse.json({ error: "Unsupported POST action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to execute Admin placement action" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // -------------------------------------------------------------------------
    // 1. VET CANDIDATE (APPROVE TO LIVE / REJECT / VERIFY CV & REFERENCES)
    // -------------------------------------------------------------------------
    if (action === "vet_candidate") {
      const { id, approval_status, cvVerified, referencesVerified } = body;
      if (!id) {
        return NextResponse.json({ error: "Candidate ID required" }, { status: 400 });
      }

      try {
        const anyPrisma = prisma as any;
        if (anyPrisma.prospective_Employees && approval_status) {
          await anyPrisma.prospective_Employees.update({
            where: { id },
            data: { approval_status },
          });
        }
      } catch (e) {
        console.warn("Admin vet_candidate DB fallback:", e);
      }

      const idx = adminCandidatesStore.findIndex((c) => c.id === id);
      if (idx !== -1) {
        if (approval_status) adminCandidatesStore[idx].approval_status = approval_status;
        if (typeof cvVerified === "boolean") {
          adminCandidatesStore[idx].cvVerified = cvVerified;
        }
        if (typeof referencesVerified === "boolean") {
          adminCandidatesStore[idx].referencesVerified = referencesVerified;
        }
        return NextResponse.json({
          success: true,
          candidate: adminCandidatesStore[idx],
        });
      }

      return NextResponse.json({
        success: true,
        candidate: { id, approval_status, cvVerified, referencesVerified },
      });
    }

    // -------------------------------------------------------------------------
    // 2. VET JOB LISTING & APPLY 5% WORK PLACEMENT FEE DISCOUNT
    // -------------------------------------------------------------------------
    if (action === "vet_job") {
      const { job_listing_id, approval_status, applyFivePercentDiscount } = body;
      if (!job_listing_id) {
        return NextResponse.json({ error: "Job listing ID required" }, { status: 400 });
      }

      try {
        const anyPrisma = prisma as any;
        if (anyPrisma.job_Listings && approval_status) {
          await anyPrisma.job_Listings.update({
            where: { id: job_listing_id },
            data: { approval_status },
          });
        }
      } catch (e) {
        console.warn("Admin vet_job DB fallback:", e);
      }

      const jobIdx = adminJobsStore.findIndex((j) => j.id === job_listing_id);
      if (jobIdx !== -1) {
        if (approval_status) adminJobsStore[jobIdx].approval_status = approval_status;
        if (applyFivePercentDiscount && adminJobsStore[jobIdx].employer) {
          const currentFee = adminJobsStore[jobIdx].employer.outstanding_fees || 15000;
          // Apply 5% discount if currently at base 15,000
          adminJobsStore[jobIdx].employer.outstanding_fees =
            currentFee >= 15000 ? Math.round(currentFee * 0.95) : currentFee;
        }
        return NextResponse.json({
          success: true,
          jobListing: adminJobsStore[jobIdx],
        });
      }

      return NextResponse.json({
        success: true,
        jobListing: { id: job_listing_id, approval_status },
      });
    }

    // -------------------------------------------------------------------------
    // 3. ADVANCE / UPDATE APPLICATION STAGE (STRICTLY ADMIN-MANAGED)
    // -------------------------------------------------------------------------
    if (action === "update_application_stage") {
      const {
        application_id,
        stage,
        admin_notes,
        interview_scheduled_at,
        managed_by_admin_id,
      } = body;

      if (!application_id || !stage) {
        return NextResponse.json(
          { error: "application_id and stage are required" },
          { status: 400 }
        );
      }

      const placedTimestamp =
        stage === "PLACED" ? new Date().toISOString() : undefined;

      try {
        const anyPrisma = prisma as any;
        if (anyPrisma.applications) {
          const updated = await anyPrisma.applications.update({
            where: { id: application_id },
            data: {
              stage,
              ...(typeof admin_notes === "string" ? { admin_notes } : {}),
              ...(interview_scheduled_at
                ? { interview_scheduled_at: new Date(interview_scheduled_at) }
                : {}),
              ...(placedTimestamp ? { placed_at: new Date(placedTimestamp) } : {}),
              ...(managed_by_admin_id ? { managed_by_admin_id } : {}),
            },
            include: {
              prospective_employee: true,
              job_listing: { include: { employer: true } },
            },
          });
          return NextResponse.json({ success: true, application: updated });
        }
      } catch (e) {
        console.warn("Admin update_application_stage DB fallback:", e);
      }

      const appIdx = adminApplicationsStore.findIndex((a) => a.id === application_id);
      if (appIdx !== -1) {
        adminApplicationsStore[appIdx].stage = stage;
        if (typeof admin_notes === "string") {
          adminApplicationsStore[appIdx].admin_notes = admin_notes;
        }
        if (interview_scheduled_at !== undefined) {
          adminApplicationsStore[appIdx].interview_scheduled_at =
            interview_scheduled_at;
        }
        if (placedTimestamp) {
          adminApplicationsStore[appIdx].placed_at = placedTimestamp;
        }
        if (managed_by_admin_id) {
          adminApplicationsStore[appIdx].managed_by_admin_id = managed_by_admin_id;
        }

        const hydrated = hydrateApplications(
          [adminApplicationsStore[appIdx]],
          adminCandidatesStore,
          adminJobsStore
        )[0];

        return NextResponse.json({
          success: true,
          application: hydrated,
        });
      }

      return NextResponse.json({
        success: true,
        application: { id: application_id, stage, admin_notes },
      });
    }

    // -------------------------------------------------------------------------
    // 4. RESOLVE / RESPOND TO EMPLOYER FEEDBACK TICKET
    // -------------------------------------------------------------------------
    if (action === "resolve_ticket") {
      const { ticket_id, adminResponse, status } = body;
      const tktIdx = adminTicketsStore.findIndex((t) => t.id === ticket_id);
      if (tktIdx !== -1) {
        adminTicketsStore[tktIdx].adminResponse =
          adminResponse || "Reviewed and actioned by Smart Chefs Admin Desk.";
        adminTicketsStore[tktIdx].status = status || "Resolved by Admin Desk";
        return NextResponse.json({
          success: true,
          ticket: adminTicketsStore[tktIdx],
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unsupported PATCH action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update Admin record" },
      { status: 500 }
    );
  }
}

