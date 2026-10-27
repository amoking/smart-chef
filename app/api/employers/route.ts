import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface ExtractedRequirementItem {
  id: string;
  label: string;
  category: "Certification" | "Culinary & Technical" | "Operations & Capacity" | "Perks & Schedule";
  recommended: boolean;
}

const HOSPITALITY_EXTRACTION_RULES: {
  id: string;
  label: string;
  category: ExtractedRequirementItem["category"];
  keywords: RegExp;
}[] = [
  {
    id: "haccp-cert",
    label: "HACCP & Food Safety Compliance",
    category: "Certification",
    keywords: /haccp|hygiene|food safety|sanitation|kebs|contamination|clean/i,
  },
  {
    id: "food-handlers-cert",
    label: "Valid County Food Handler's Medical Certificate",
    category: "Certification",
    keywords: /medical|handler|certificate|health|kitchen|cook|chef|waiter|catering/i,
  },
  {
    id: "utalii-tvet-diploma",
    label: "Diploma / Certificate in Culinary Arts or Hospitality (Utalii / TVET)",
    category: "Certification",
    keywords: /diploma|certificate|utalii|tvet|degree|qualification|trained|culinary/i,
  },
  {
    id: "high-volume-banquet",
    label: "High-Volume Banquet & Buffet Execution (300+ Covers)",
    category: "Operations & Capacity",
    keywords: /banquet|buffet|volume|covers|conference|boarding|school|mass|bulk|catering/i,
  },
  {
    id: "menu-costing-fifo",
    label: "Menu Costing, Portion Control & BOH FIFO Waste Reduction",
    category: "Operations & Capacity",
    keywords: /cost|waste|fifo|inventory|stock|portion|budget|margin|stores|procurement/i,
  },
  {
    id: "alacarte-plating",
    label: "À La Carte Fine Dining & Modern Plating Standards",
    category: "Culinary & Technical",
    keywords: /la carte|fine dining|plating|gourmet|menu|continental|pastry|grill|hot line/i,
  },
  {
    id: "allergen-dietary",
    label: "Allergen Management & Special Dietary Menu Prep",
    category: "Culinary & Technical",
    keywords: /allergen|dietary|vegan|halal|gluten|nutrition|hospital|clinical|menu/i,
  },
  {
    id: "brigade-supervision",
    label: "Kitchen Brigade Supervision & Duty Roster Management",
    category: "Operations & Capacity",
    keywords: /supervis|lead|sous|head|brigade|team|train|manage|roster|shift/i,
  },
  {
    id: "pms-front-office",
    label: "Front Desk PMS Billing, Check-In & Guest Concierge Protocol",
    category: "Culinary & Technical",
    keywords: /reception|front desk|pms|opera|reservation|check-in|concierge|guest/i,
  },
  {
    id: "linen-housekeeping",
    label: "Commercial Laundry, Stain Protocol & Housekeeping Turnaround",
    category: "Culinary & Technical",
    keywords: /laundry|linen|housekeeping|uniform|pressing|stain|room/i,
  },
  {
    id: "accommodation-meals",
    label: "Staff Accommodation / Duty Meals Provided",
    category: "Perks & Schedule",
    keywords: /accommodation|housing|boarding|meals|transport|allowance|live-in|resident/i,
  },
  {
    id: "shift-flexibility",
    label: "Flexible for Weekends, Public Holidays & Split Shifts",
    category: "Perks & Schedule",
    keywords: /shift|weekend|holiday|rotating|flexible|schedule|hours|mon-fri|night/i,
  },
];

function extractStandardizedRequirements(
  description: string,
  title = "",
  facilityType = ""
): ExtractedRequirementItem[] {
  const combinedText = `${title} ${facilityType} ${description}`.trim();
  const matched: ExtractedRequirementItem[] = [];

  for (const rule of HOSPITALITY_EXTRACTION_RULES) {
    if (rule.keywords.test(combinedText)) {
      matched.push({
        id: rule.id,
        label: rule.label,
        category: rule.category,
        recommended: true,
      });
    }
  }

  // Extract any bulleted or sentence-level custom phrases if the user pasted specific lines
  const lines = description
    .split(/\r?\n|[•\-*]+/)
    .map((l) => l.trim())
    .filter((l) => l.length >= 12 && l.length <= 75);

  for (const line of lines.slice(0, 3)) {
    const cleanLine = line.replace(/^[0-9]+[.)]\s*/, "").replace(/[.;,:]+$/, "");
    const alreadyCovered = matched.some(
      (m) => m.label.toLowerCase().includes(cleanLine.toLowerCase().slice(0, 14))
    );
    if (!alreadyCovered && /experience|years|must|able|skill|knowledge|cert/i.test(cleanLine)) {
      matched.push({
        id: `custom-${matched.length + 1}`,
        label: cleanLine.charAt(0).toUpperCase() + cleanLine.slice(1),
        category: "Culinary & Technical",
        recommended: true,
      });
    }
  }

  // Ensure at least 5 standardized suggestions are returned even for short descriptions
  const defaults: ExtractedRequirementItem[] = [
    {
      id: "haccp-cert",
      label: "HACCP & Food Safety Compliance",
      category: "Certification",
      recommended: true,
    },
    {
      id: "food-handlers-cert",
      label: "Valid County Food Handler's Medical Certificate",
      category: "Certification",
      recommended: true,
    },
    {
      id: "menu-costing-fifo",
      label: "Menu Costing, Portion Control & BOH FIFO Waste Reduction",
      category: "Operations & Capacity",
      recommended: true,
    },
    {
      id: "high-volume-banquet",
      label: "High-Volume Banquet & Buffet Execution (300+ Covers)",
      category: "Operations & Capacity",
      recommended: false,
    },
    {
      id: "accommodation-meals",
      label: "Staff Accommodation / Duty Meals Provided",
      category: "Perks & Schedule",
      recommended: false,
    },
    {
      id: "shift-flexibility",
      label: "Flexible for Weekends, Public Holidays & Split Shifts",
      category: "Perks & Schedule",
      recommended: true,
    },
  ];

  for (const def of defaults) {
    if (!matched.some((m) => m.id === def.id) && matched.length < 7) {
      matched.push(def);
    }
  }

  return matched;
}

// In-memory fallback store if PostgreSQL tables have not been pushed yet
const fallbackEmployers: any[] = [
  {
    id: "emp_demo_norfolk_001",
    userId: null,
    business_name: "Rift Valley Grand Lodge & Conferencing",
    business_location: "Moi South Lake Road, Naivasha, Nakuru County",
    type: "Hotel & Conference Resort",
    max_catering_capacity: 850,
    boarding_type: "Residential Hospitality & Full-Board Conferencing",
    contact_name: "Chef Sarah Wanjiku",
    contact_details: {
      phone: "+254711223344",
      email: "hr@riftvalleygrand-example.co.ke",
      role: "Culinary Operations Director",
    },
    outstanding_fees: 14250.0,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    job_listings: [
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
        work_schedule: "Mon–Sat • 08:00 – 17:00 (Rotating Split Shift • 48 hrs/wk)",
        accepts_work_placement: true,
        approval_status: "live",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        applications: [
          {
            id: "app_demo_amina_001",
            prospective_employee_id: "pe_demo_amina_001",
            job_listing_id: "job_demo_sous_001",
            stage: "INTERVIEW_SCHEDULED",
            managed_by_admin_id: "admin_smart_chef_001",
            admin_notes:
              "Candidate completed Smart Chef Kitchen Hygiene & Service modules with 96% score. Employer qualifies for 5% placement discount.",
            interview_scheduled_at: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            prospective_employee: {
              id: "pe_demo_amina_001",
              full_name: "Amina Hassan",
              education_level: "Diploma",
              phone: "+254733445566",
              selected_job_categories: ["Chef", "Waitstaff"],
              headshot_url:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
              linked_training_modules: ["food-safety-haccp", "silver-service-etiquette"],
            },
          },
          {
            id: "app_demo_brian_002",
            prospective_employee_id: "pe_demo_brian_002",
            job_listing_id: "job_demo_sous_001",
            stage: "ADMIN_VETTING",
            managed_by_admin_id: "admin_smart_chef_001",
            admin_notes:
              "Work Placement Track candidate — verifying TVET certificate and boarding school catering reference.",
            interview_scheduled_at: null,
            prospective_employee: {
              id: "pe_demo_brian_002",
              full_name: "Brian Omondi",
              education_level: "Certificate",
              phone: "+254744556677",
              selected_job_categories: ["Chef", "Stores"],
              headshot_url:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
              linked_training_modules: ["food-safety-haccp"],
            },
          },
        ],
      },
    ],
  },
];

const fallbackFeedbackTickets: any[] = [
  {
    id: "tkt_demo_001",
    referenceCode: "SC-EMP-TKT-901",
    employer_id: "emp_demo_norfolk_001",
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
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const employerId = searchParams.get("employerId");

  try {
    const anyPrisma = prisma as any;
    if (anyPrisma.employer_Profiles) {
      const whereClause: any = {};
      if (userId) whereClause.userId = userId;
      if (employerId) whereClause.id = employerId;

      const employers = await anyPrisma.employer_Profiles.findMany({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        include: {
          job_listings: {
            include: {
              applications: {
                include: {
                  prospective_employee: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      if (employers.length > 0) {
        return NextResponse.json({
          employers,
          employer: employers[0],
          feedbackTickets: fallbackFeedbackTickets,
        });
      }
    }
  } catch (error) {
    console.warn("Falling back to in-memory employer store:", error);
  }

  return NextResponse.json({
    employers: fallbackEmployers,
    employer: fallbackEmployers[0] || null,
    feedbackTickets: fallbackFeedbackTickets,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // -------------------------------------------------------------------------
    // ACTION 1: AI-ASSISTED JOB REQUIREMENT EXTRACTION
    // -------------------------------------------------------------------------
    if (action === "ai_extract") {
      const { description, title, facilityType } = body;
      if (!description || typeof description !== "string" || !description.trim()) {
        return NextResponse.json(
          { error: "Please paste or enter a job description to analyze." },
          { status: 400 }
        );
      }

      const suggestedRequirements = extractStandardizedRequirements(
        description,
        title,
        facilityType
      );

      return NextResponse.json({
        success: true,
        suggestedRequirements,
        summary: `Extracted ${suggestedRequirements.length} standardized hospitality requirements from your job description.`,
      });
    }

    // -------------------------------------------------------------------------
    // ACTION 2: EMPLOYER FEEDBACK / ISSUE SUBMISSION
    // -------------------------------------------------------------------------
    if (action === "submit_feedback") {
      const { employer_id, category, priority, relatedJobTitle, message } = body;
      if (!message || !message.trim()) {
        return NextResponse.json(
          { error: "Please enter details for your feedback or issue." },
          { status: 400 }
        );
      }

      const newTicket = {
        id: `tkt_${Date.now()}`,
        referenceCode: `SC-EMP-TKT-${String(Date.now()).slice(-4)}`,
        employer_id: employer_id || fallbackEmployers[0]?.id || "emp_demo_norfolk_001",
        category: category || "General Recruitment Feedback",
        priority: priority || "Normal",
        relatedJobTitle: relatedJobTitle || "General Account",
        message: message.trim(),
        status: "Open — Assigned to Admin Placement Desk",
        adminResponse: null,
        createdAt: new Date().toISOString(),
      };

      fallbackFeedbackTickets.unshift(newTicket);

      return NextResponse.json({
        success: true,
        ticket: newTicket,
        message: `Feedback ticket ${newTicket.referenceCode} logged with the Smart Chefs Admin Desk.`,
      });
    }

    // -------------------------------------------------------------------------
    // ACTION 3: POST A JOB LISTING
    // -------------------------------------------------------------------------
    if (action === "create_job") {
      const {
        employer_id,
        title,
        description,
        AI_suggested_features,
        location_type,
        location,
        location_coords,
        salary_range,
        work_schedule,
        accepts_work_placement,
      } = body;

      if (!title || !description || !location || !work_schedule) {
        return NextResponse.json(
          {
            error:
              "Please provide job title, description, location, and work schedule.",
          },
          { status: 400 }
        );
      }

      const targetEmployerId =
        employer_id || fallbackEmployers[0]?.id || "emp_demo_norfolk_001";
      const sanitizedFeatures: string[] = Array.isArray(AI_suggested_features)
        ? AI_suggested_features
        : [];
      const isWorkPlacement = Boolean(accepts_work_placement);

      let savedJob: any = null;

      try {
        const anyPrisma = prisma as any;
        if (anyPrisma.job_Listings) {
          savedJob = await anyPrisma.job_Listings.create({
            data: {
              employer_id: targetEmployerId,
              title: title.trim(),
              description: description.trim(),
              AI_suggested_features: sanitizedFeatures,
              location_type: location_type || "coords",
              location: location.trim(),
              location_coords: location_coords || null,
              salary_range: salary_range || "Competitive / Negotiable",
              work_schedule: work_schedule.trim(),
              accepts_work_placement: isWorkPlacement,
              approval_status: "pending",
            },
            include: {
              applications: {
                include: {
                  prospective_employee: true,
                },
              },
            },
          });
        }
      } catch (dbErr) {
        console.warn("DB fallback for creating Job_Listings:", dbErr);
      }

      if (!savedJob) {
        savedJob = {
          id: `job_${Date.now()}`,
          employer_id: targetEmployerId,
          title: title.trim(),
          description: description.trim(),
          AI_suggested_features: sanitizedFeatures,
          location_type: location_type || "coords",
          location: location.trim(),
          location_coords: location_coords || null,
          salary_range: salary_range || "Competitive / Negotiable",
          work_schedule: work_schedule.trim(),
          accepts_work_placement: isWorkPlacement,
          approval_status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          applications: [],
        };

        const empIdx = fallbackEmployers.findIndex((e) => e.id === targetEmployerId);
        if (empIdx !== -1) {
          fallbackEmployers[empIdx].job_listings = [
            savedJob,
            ...(fallbackEmployers[empIdx].job_listings || []),
          ];
        } else if (fallbackEmployers[0]) {
          fallbackEmployers[0].job_listings.unshift(savedJob);
        }
      }

      return NextResponse.json({
        success: true,
        jobListing: savedJob,
        adminFlaggedForDiscount: isWorkPlacement,
        discountNotice: isWorkPlacement
          ? "ADMIN FLAG ACTIVE: Listing flagged for Work Placement Candidates (5% placement fee discount applied)."
          : "Standard placement track selected.",
      });
    }

    // -------------------------------------------------------------------------
    // ACTION 4 (DEFAULT): EMPLOYER ONBOARDING PROFILE UPSERT
    // -------------------------------------------------------------------------
    const {
      userId,
      business_name,
      business_location,
      type,
      max_catering_capacity,
      boarding_type,
      contact_name,
      contact_details,
    } = body;

    if (!business_location || !type || !boarding_type || !contact_name) {
      return NextResponse.json(
        {
          error:
            "Please provide business location, facility type, boarding type, and primary contact name.",
        },
        { status: 400 }
      );
    }

    const parsedCapacity = Number(max_catering_capacity) || 100;
    let savedEmployer: any = null;

    try {
      const anyPrisma = prisma as any;
      if (anyPrisma.employer_Profiles) {
        if (userId) {
          savedEmployer = await anyPrisma.employer_Profiles.upsert({
            where: { userId },
            update: {
              business_name: business_name ? business_name.trim() : null,
              business_location: business_location.trim(),
              type,
              max_catering_capacity: parsedCapacity,
              boarding_type,
              contact_name: contact_name.trim(),
              contact_details: contact_details || {},
            },
            create: {
              userId,
              business_name: business_name ? business_name.trim() : null,
              business_location: business_location.trim(),
              type,
              max_catering_capacity: parsedCapacity,
              boarding_type,
              contact_name: contact_name.trim(),
              contact_details: contact_details || {},
              outstanding_fees: 0.0,
            },
            include: {
              job_listings: {
                include: {
                  applications: {
                    include: {
                      prospective_employee: true,
                    },
                  },
                },
              },
            },
          });
        } else {
          savedEmployer = await anyPrisma.employer_Profiles.create({
            data: {
              business_name: business_name ? business_name.trim() : null,
              business_location: business_location.trim(),
              type,
              max_catering_capacity: parsedCapacity,
              boarding_type,
              contact_name: contact_name.trim(),
              contact_details: contact_details || {},
              outstanding_fees: 0.0,
            },
            include: {
              job_listings: {
                include: {
                  applications: {
                    include: {
                      prospective_employee: true,
                    },
                  },
                },
              },
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn("DB write fallback for Employer_Profiles:", dbErr);
    }

    if (!savedEmployer) {
      savedEmployer = {
        id: fallbackEmployers[0]?.id || `emp_${Date.now()}`,
        userId: userId || null,
        business_name: business_name ? business_name.trim() : "Hospitality Employer",
        business_location: business_location.trim(),
        type,
        max_catering_capacity: parsedCapacity,
        boarding_type,
        contact_name: contact_name.trim(),
        contact_details: contact_details || {},
        outstanding_fees: fallbackEmployers[0]?.outstanding_fees ?? 14250.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        job_listings: fallbackEmployers[0]?.job_listings || [],
      };
      fallbackEmployers[0] = savedEmployer;
    }

    return NextResponse.json({
      success: true,
      employer: savedEmployer,
      message: "Employer onboarding profile saved.",
    });
  } catch (error: any) {
    console.error("Error in /api/employers POST:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process employer request." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, outstanding_fees, job_listing_id, approval_status } = body;

    if (job_listing_id && approval_status) {
      try {
        const anyPrisma = prisma as any;
        if (anyPrisma.job_Listings) {
          const updatedJob = await anyPrisma.job_Listings.update({
            where: { id: job_listing_id },
            data: { approval_status },
          });
          return NextResponse.json({ success: true, jobListing: updatedJob });
        }
      } catch (e) {
        console.warn("PATCH job listing fallback:", e);
      }

      for (const emp of fallbackEmployers) {
        const job = (emp.job_listings || []).find((j: any) => j.id === job_listing_id);
        if (job) {
          job.approval_status = approval_status;
          return NextResponse.json({ success: true, jobListing: job });
        }
      }
    }

    if (id && typeof outstanding_fees === "number") {
      try {
        const anyPrisma = prisma as any;
        if (anyPrisma.employer_Profiles) {
          const updatedEmp = await anyPrisma.employer_Profiles.update({
            where: { id },
            data: { outstanding_fees },
          });
          return NextResponse.json({ success: true, employer: updatedEmp });
        }
      } catch (e) {
        console.warn("PATCH employer fees fallback:", e);
      }

      const emp = fallbackEmployers.find((e) => e.id === id) || fallbackEmployers[0];
      if (emp) {
        emp.outstanding_fees = outstanding_fees;
        return NextResponse.json({ success: true, employer: emp });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update employer record" },
      { status: 500 }
    );
  }
}

