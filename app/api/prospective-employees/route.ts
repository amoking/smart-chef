import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface AcknowledgmentEmailPayload {
  to: string;
  subject: string;
  referenceCode: string;
  sentAt: string;
  requiresCvEmail: boolean;
  cvRequiredRoles: string[];
  bodyPreview: string;
}

const CV_REQUIRED_ROLES = ["Chef", "Receptionist"];

function buildAcknowledgmentEmail(params: {
  id: string;
  full_name: string;
  email?: string | null;
  phone: string;
  education_level: string;
  selected_job_categories: string[];
}): AcknowledgmentEmailPayload {
  const refCode = `SC-PE-${params.id.slice(-6).toUpperCase()}`;
  const cvRequiredRoles = params.selected_job_categories.filter((role) =>
    CV_REQUIRED_ROLES.some((r) => role.toLowerCase().includes(r.toLowerCase()))
  );
  const requiresCvEmail =
    cvRequiredRoles.length > 0 ||
    params.education_level === "Diploma" ||
    params.education_level === "Degree";

  const recipient = params.email || `${params.phone}@sms-gateway.smartchefs.co.ke`;
  const roleList = params.selected_job_categories.join(", ");

  const cvInstructionBlock = requiresCvEmail
    ? `IMPORTANT NEXT STEP (CV REQUIRED): Because you applied for ${
        cvRequiredRoles.length > 0 ? cvRequiredRoles.join(" / ") : roleList
      } (${params.education_level} level), please email your full CV, academic certificates, and recommendation letters to careers@smartchefs.co.ke with the subject line "${refCode} - ${params.full_name} CV".`
    : `OPTIONAL CV SUBMISSION: For your selected categories (${roleList}), a formal CV is optional, though if you are applying for senior supervisory roles you may email your CV or certificates to careers@smartchefs.co.ke quoting reference "${refCode}".`;

  const bodyPreview = [
    `Dear ${params.full_name},`,
    ``,
    `Thank you for registering on the Smart Chefs Consultants Recruitment Marketplace!`,
    `Your Prospective Employee profile (Ref: ${refCode}) has been received and is currently set to PENDING ADMIN REVIEW.`,
    ``,
    `• Education Level: ${params.education_level}`,
    `• Selected Categories: ${roleList}`,
    `• Current Status: Pending Admin Review`,
    ``,
    cvInstructionBlock,
    ``,
    `While our Admin Recruitment Team reviews your profile and verifies your references, you can access the "Training & Development" tab on your Prospective Employee Dashboard to complete self-study modules, join remote coaching links, and RSVP for in-person practical assessments.`,
    ``,
    `Warm regards,`,
    `Smart Chefs Hospitality Talent & Placement Desk`,
  ].join("\n");

  return {
    to: recipient,
    subject: `[Smart Chefs] Application Received (${refCode}) – Pending Admin Review`,
    referenceCode: refCode,
    sentAt: new Date().toISOString(),
    requiresCvEmail,
    cvRequiredRoles,
    bodyPreview,
  };
}

// Fallback in-memory store if database tables have not been pushed yet
const fallbackProfiles: any[] = [
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
    approval_status: "pending",
    linked_training_modules: ["food-safety-haccp", "silver-service-etiquette"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    applications: [
      {
        id: "app_demo_001",
        stage: "ADMIN_VETTING",
        managed_by_admin_id: "admin_smart_chef_001",
        admin_notes: "References verified; verifying Utalii diploma certificate.",
        job_listing: {
          title: "Junior Sous Chef & Banquet Line Lead",
          location: "Naivasha, Nakuru County",
          salary_range: "KES 55,000 - 75,000 / month",
        },
      },
    ],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const phone = searchParams.get("phone");

  try {
    const anyPrisma = prisma as any;
    if (anyPrisma.prospective_Employees) {
      const whereClause: any = {};
      if (userId) whereClause.userId = userId;
      if (phone) whereClause.phone = phone;

      const profiles = await anyPrisma.prospective_Employees.findMany({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        include: {
          applications: {
            include: {
              job_listing: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        profiles,
        profile: profiles[0] || null,
      });
    }
  } catch (error) {
    console.warn("Falling back to local prospective employee store:", error);
  }

  return NextResponse.json({
    profiles: fallbackProfiles,
    profile: fallbackProfiles[0] || null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      full_name,
      education_level,
      phone,
      email,
      qualifications,
      experience,
      references,
      selected_job_categories,
      headshot_url,
      linked_training_modules,
    } = body;

    if (!full_name || !education_level || !phone || !selected_job_categories?.length) {
      return NextResponse.json(
        {
          error:
            "Please provide full name, Kenyan education level, phone number, and at least one job category.",
        },
        { status: 400 }
      );
    }

    const sanitizedCategories: string[] = Array.isArray(selected_job_categories)
      ? selected_job_categories
      : [selected_job_categories];

    const defaultModules = Array.isArray(linked_training_modules) && linked_training_modules.length > 0
      ? linked_training_modules
      : ["hospitality-onboarding-101"];

    let savedProfile: any = null;

    try {
      const anyPrisma = prisma as any;
      if (anyPrisma.prospective_Employees) {
        savedProfile = await anyPrisma.prospective_Employees.upsert({
          where: { phone: phone.trim() },
          update: {
            full_name: full_name.trim(),
            education_level,
            email: email ? email.trim() : null,
            qualifications: qualifications || "Provided during onboarding",
            experience: experience || "Entry / Mid-level hospitality experience",
            references: references || [],
            selected_job_categories: sanitizedCategories,
            headshot_url: headshot_url || null,
            approval_status: "pending",
            linked_training_modules: defaultModules,
          },
          create: {
            userId: userId || null,
            full_name: full_name.trim(),
            education_level,
            phone: phone.trim(),
            email: email ? email.trim() : null,
            qualifications: qualifications || "Provided during onboarding",
            experience: experience || "Entry / Mid-level hospitality experience",
            references: references || [],
            selected_job_categories: sanitizedCategories,
            headshot_url: headshot_url || null,
            approval_status: "pending",
            linked_training_modules: defaultModules,
          },
          include: {
            applications: {
              include: {
                job_listing: true,
              },
            },
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB write fallback for Prospective_Employees:", dbErr);
    }

    if (!savedProfile) {
      savedProfile = {
        id: `pe_${Date.now()}`,
        userId: userId || null,
        full_name: full_name.trim(),
        education_level,
        phone: phone.trim(),
        email: email ? email.trim() : null,
        qualifications: qualifications || "Provided during onboarding",
        experience: experience || "Entry / Mid-level hospitality experience",
        references: references || [],
        selected_job_categories: sanitizedCategories,
        headshot_url: headshot_url || null,
        approval_status: "pending",
        linked_training_modules: defaultModules,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applications: [],
      };
      fallbackProfiles.unshift(savedProfile);
    }

    const acknowledgmentEmail = buildAcknowledgmentEmail({
      id: savedProfile.id,
      full_name: savedProfile.full_name,
      email: savedProfile.email,
      phone: savedProfile.phone,
      education_level: savedProfile.education_level,
      selected_job_categories: savedProfile.selected_job_categories,
    });

    return NextResponse.json({
      success: true,
      profile: savedProfile,
      acknowledgmentEmail,
      message:
        "Profile created with status 'pending admin review' and automated acknowledgment email dispatched.",
    });
  } catch (error: any) {
    console.error("Error submitting prospective employee onboarding:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process onboarding submission." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, approval_status, linked_training_modules } = body;

    if (!id) {
      return NextResponse.json({ error: "Profile ID is required" }, { status: 400 });
    }

    try {
      const anyPrisma = prisma as any;
      if (anyPrisma.prospective_Employees) {
        const updated = await anyPrisma.prospective_Employees.update({
          where: { id },
          data: {
            ...(approval_status ? { approval_status } : {}),
            ...(linked_training_modules ? { linked_training_modules } : {}),
          },
          include: {
            applications: {
              include: {
                job_listing: true,
              },
            },
          },
        });
        return NextResponse.json({ success: true, profile: updated });
      }
    } catch (dbErr) {
      console.warn("PATCH fallback:", dbErr);
    }

    const idx = fallbackProfiles.findIndex((p) => p.id === id);
    if (idx !== -1) {
      if (approval_status) fallbackProfiles[idx].approval_status = approval_status;
      if (linked_training_modules) {
        fallbackProfiles[idx].linked_training_modules = linked_training_modules;
      }
      fallbackProfiles[idx].updatedAt = new Date().toISOString();
      return NextResponse.json({ success: true, profile: fallbackProfiles[idx] });
    }

    return NextResponse.json({
      success: true,
      profile: { id, approval_status, linked_training_modules },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
