import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSlackNotification, sendDiscordNotification } from "@/lib/notifications";
import { getClientIp, rateLimits } from "@/lib/rate-limit";

interface LeadIntakePayload {
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  website?: string;
  businessType?: string;
  revenueModel?: string;
  paymentProcessorStatus?: string;
  monthlyRevenueEstimate?: string;
  commissionInterested?: boolean;
  timeline?: string;
  budget?: string;
  additionalNotes?: string;
  termsAccepted: boolean;
  projectType: string;
  referralSource: string;
}

export async function POST(req: Request) {
  try {
    // Rate limiting: 5 submissions per IP per hour
    const clientIp = getClientIp(req);
    const rateLimitKey = `lead-intake:${clientIp}`;
    const rateLimitResult = await rateLimits.strict.check(rateLimitKey);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many submissions. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    const body: LeadIntakePayload = await req.json();

    // Validate required fields
    if (!body.fullName?.trim()) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    if (!body.email?.trim() || !body.email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (!body.company?.trim()) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    if (!body.termsAccepted) {
      return NextResponse.json({ error: "Terms must be accepted" }, { status: 400 });
    }

    // Create lead record
    const lead = await prisma.clientIntake.create({
      data: {
        fullName: body.fullName.trim(),
        email: body.email.toLowerCase().trim(),
        phone: body.phone?.trim() || null,
        company: body.company.trim(),
        website: body.website?.trim() || null,
        projectType: body.projectType || "b2b-lead",
        businessType: body.businessType || null,
        revenueModel: body.revenueModel || null,
        paymentProcessorStatus: body.paymentProcessorStatus || null,
        monthlyRevenueEstimate: body.monthlyRevenueEstimate || null,
        commissionInterested: body.commissionInterested || false,
        referralSource: body.referralSource || "unknown",
        timeline: body.timeline || null,
        budget: body.budget || null,
        additionalNotes: body.additionalNotes?.trim() || null,
        termsAccepted: body.termsAccepted,
        status: "pending",
        projectDescription: null,
        goals: null,
        targetAudience: null,
        features: [],
      },
    });

    // Send notifications (async, non-blocking)
    sendNotifications(lead).catch(err => console.error("Notification error:", err));

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        message: "Lead inquiry submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead intake error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}

async function sendNotifications(lead: any) {
  const notificationPayload: any = {
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone || undefined,
    company: lead.company,
    projectType: lead.projectType,
    budget: lead.budget || undefined,
    timeline: lead.timeline || undefined,
    projectDescription: lead.additionalNotes || undefined,
    goals: undefined,
    features: [],
    intakeId: lead.id,
  };

  // Send to Slack
  if (process.env.SLACK_WEBHOOK_URL) {
    await sendSlackNotification(notificationPayload).catch(e =>
      console.error("Slack notification failed:", e)
    );
  }

  // Send to Discord
  if (process.env.DISCORD_WEBHOOK_URL) {
    await sendDiscordNotification(notificationPayload).catch(e =>
      console.error("Discord notification failed:", e)
    );
  }
}
