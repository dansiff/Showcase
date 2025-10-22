import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSlackNotification, sendDiscordNotification, sendEmail } from "@/lib/notifications";

// Email notification helper
async function sendTeamNotification(intake: any) {
  try {
    // Using a simple email API (you can replace with SendGrid, Resend, etc.)
    const emailBody = `
New Client Intake Form Submitted! 🎉

Client Information:
- Name: ${intake.fullName}
- Email: ${intake.email}
- Phone: ${intake.phone || "Not provided"}
- Company: ${intake.company}

Project Details:
- Type: ${intake.projectType}
- Budget: ${intake.budget}
- Timeline: ${intake.timeline}
- Launch Date: ${intake.launchDate || "Not specified"}

Preferred Kickoff Call:
- Date: ${intake.preferredCallDate || "Not specified"}
- Time: ${intake.preferredCallTime || "Not specified"}

Description:
${intake.projectDescription}

Goals:
${intake.goals}

Features Requested:
${intake.features.join(", ") || "None specified"}

Uploaded Files:
${intake.uploadedFiles?.length > 0 ? intake.uploadedFiles.join("\n") : "No files uploaded"}

View full details: ${process.env.NEXT_PUBLIC_APP_URL}/admin/intake/${intake.id}
    `.trim();

    // TODO: Replace with your email service
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'intake@showcase.com',
    //   to: ['team@showcase.com'],
    //   subject: `New Intake: ${intake.company} - ${intake.budget}`,
    //   text: emailBody,
    // });

    console.log("Team notification email would be sent:", emailBody);
  } catch (err) {
    console.error("Failed to send team notification:", err);
    // Don't throw - we don't want email failures to block intake submission
  }
}

// Client confirmation email helper
async function sendClientConfirmation(email: string, fullName: string, intakeId: string) {
  try {
    const emailBody = `
Hi ${fullName},

Thank you for submitting your project inquiry! We're excited to learn more about your project.

Here's what happens next:

1. Our team will review your submission within 24 hours
2. You'll receive a confirmation email with your kickoff call details
3. We'll prepare a custom proposal based on your requirements
4. After our call, you'll receive a detailed project timeline and scope

Your Reference ID: ${intakeId}

If you have any immediate questions, feel free to reply to this email or call us at (555) 123-4567.

Best regards,
The Showcase Team
    `.trim();

    // TODO: Replace with your email service
    console.log("Client confirmation email would be sent to:", email);
  } catch (err) {
    console.error("Failed to send client confirmation:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const {
      fullName,
      email,
      phone,
      company,
      website,
      projectType,
      projectDescription,
      goals,
      targetAudience,
      features,
      designPreferences,
      brandGuidelines,
      contentReady,
      timeline,
      launchDate,
      budget,
      competitors,
      inspiration,
      additionalNotes,
      preferredCallDate,
      preferredCallTime,
      uploadedFiles,
      termsAccepted,
    } = body;

    // Validation
    if (!fullName || !email || !company || !projectType || !projectDescription || !goals || !targetAudience || !timeline || !budget) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!termsAccepted) {
      return NextResponse.json(
        { error: "Terms must be accepted" },
        { status: 400 }
      );
    }

    // Create intake record in database
    const intake = await prisma.clientIntake.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        company,
        website: website || null,
        projectType,
        projectDescription,
        goals,
        targetAudience,
        features: features || [],
        designPreferences: designPreferences || null,
        brandGuidelines: brandGuidelines || null,
        contentReady,
        timeline,
        launchDate: launchDate ? new Date(launchDate) : null,
        budget,
        competitors: competitors || null,
        inspiration: inspiration || null,
        additionalNotes: additionalNotes || null,
        preferredCallDate: preferredCallDate || null,
        preferredCallTime: preferredCallTime || null,
        uploadedFiles: uploadedFiles || [],
        termsAccepted,
        status: "pending",
      },
    });

    // Send notifications (async, don't block response)
    const notificationData = {
      fullName: intake.fullName,
      email: intake.email,
      phone: intake.phone || undefined,
      company: intake.company,
      projectType: intake.projectType,
      budget: intake.budget,
      timeline: intake.timeline,
      preferredCallDate: intake.preferredCallDate || undefined,
      preferredCallTime: intake.preferredCallTime || undefined,
      projectDescription: intake.projectDescription,
      goals: intake.goals,
      features: intake.features,
      uploadedFiles: intake.uploadedFiles,
      intakeId: intake.id,
    };

    Promise.all([
      sendTeamNotification(intake),
      sendClientConfirmation(email, fullName, intake.id),
      sendSlackNotification(notificationData),
      sendDiscordNotification(notificationData),
    ]).catch(err => console.error("Notification error:", err));

    return NextResponse.json(
      { 
        success: true, 
        intakeId: intake.id,
        message: "Intake form submitted successfully" 
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Intake API error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
