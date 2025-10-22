// app/lib/notifications.ts
import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Querrepario Tacos" <orders@querrepariotacos.com>',
    to,
    subject,
    text,
  });
}

export async function sendToKitchenWebhook(payload: any) {
  const webhookUrl = process.env.KITCHEN_WEBHOOK_URL;
  if (!webhookUrl) return;

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// Client Intake Notifications
type IntakeNotification = {
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  preferredCallDate?: string;
  preferredCallTime?: string;
  projectDescription: string;
  goals: string;
  features: string[];
  uploadedFiles?: string[];
  intakeId: string;
};

export async function sendSlackNotification(intake: IntakeNotification) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log("Slack webhook not configured, skipping notification");
    return;
  }

  try {
    const message = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🎉 New Client Intake Form Submitted!",
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Client:*\n${intake.fullName}` },
            { type: "mrkdwn", text: `*Company:*\n${intake.company}` },
            { type: "mrkdwn", text: `*Email:*\n${intake.email}` },
            { type: "mrkdwn", text: `*Phone:*\n${intake.phone || "Not provided"}` }
          ]
        },
        { type: "divider" },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Project Type:*\n${intake.projectType}` },
            { type: "mrkdwn", text: `*Budget:*\n${intake.budget}` },
            { type: "mrkdwn", text: `*Timeline:*\n${intake.timeline}` },
            { type: "mrkdwn", text: `*Status:*\n⏳ Pending Review` }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Project Description:*\n${intake.projectDescription.substring(0, 200)}${intake.projectDescription.length > 200 ? "..." : ""}`
          }
        }
      ]
    };

    if (intake.preferredCallDate && intake.preferredCallTime) {
      (message.blocks as any).push({
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Preferred Call Date:*\n📅 ${intake.preferredCallDate}` },
          { type: "mrkdwn", text: `*Preferred Call Time:*\n🕐 ${intake.preferredCallTime} EST` }
        ]
      });
    }

    if (intake.uploadedFiles && intake.uploadedFiles.length > 0) {
      (message.blocks as any).push({
        type: "section",
        text: { type: "mrkdwn", text: `*Uploaded Files:* ${intake.uploadedFiles.length} file(s)` }
      });
    }

    (message.blocks as any).push(
      { type: "divider" },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View Details", emoji: true },
            url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/intake/${intake.intakeId}`,
            style: "primary"
          },
          {
            type: "button",
            text: { type: "plain_text", text: "Contact Client", emoji: true },
            url: `mailto:${intake.email}`
          }
        ]
      }
    );

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    console.log("Slack notification sent successfully");
  } catch (err) {
    console.error("Failed to send Slack notification:", err);
  }
}

export async function sendDiscordNotification(intake: IntakeNotification) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log("Discord webhook not configured, skipping notification");
    return;
  }

  try {
    const embed = {
      title: "🎉 New Client Intake Form Submitted!",
      color: 0x6366f1,
      fields: [
        { name: "Client", value: intake.fullName, inline: true },
        { name: "Company", value: intake.company, inline: true },
        { name: "Email", value: intake.email, inline: false },
        { name: "Phone", value: intake.phone || "Not provided", inline: true },
        { name: "Project Type", value: intake.projectType, inline: true },
        { name: "Budget", value: intake.budget, inline: true },
        { name: "Timeline", value: intake.timeline, inline: true },
        {
          name: "Description",
          value: intake.projectDescription.substring(0, 200) + (intake.projectDescription.length > 200 ? "..." : ""),
          inline: false
        }
      ],
      footer: { text: `Intake ID: ${intake.intakeId}` },
      timestamp: new Date().toISOString()
    };

    if (intake.preferredCallDate && intake.preferredCallTime) {
      embed.fields.push({
        name: "Preferred Kickoff Call",
        value: `📅 ${intake.preferredCallDate} at ${intake.preferredCallTime} EST`,
        inline: false
      });
    }

    if (intake.uploadedFiles && intake.uploadedFiles.length > 0) {
      embed.fields.push({
        name: "Uploaded Files",
        value: `📎 ${intake.uploadedFiles.length} file(s) attached`,
        inline: false
      });
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Showcase Intake Bot",
        embeds: [embed]
      }),
    });

    console.log("Discord notification sent successfully");
  } catch (err) {
    console.error("Failed to send Discord notification:", err);
  }
}
