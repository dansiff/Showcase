// app/lib/notifications.ts
import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }) {
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
    html,
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

// Order notification for restaurant
type OrderNotification = {
  type: 'new_order' | 'status_change';
  orderId: string;
  customerName: string;
  customerPhone: string;
  totalCents: number;
  itemCount: number;
  pickupAt: string;
  newStatus?: string;
};

export async function sendOrderNotification(data: OrderNotification) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  const discordUrl = process.env.DISCORD_WEBHOOK_URL;

  // Email notification
  if (adminEmail && process.env.SMTP_HOST) {
    try {
      const subject = data.type === 'new_order' 
        ? `New Taco Order #${data.orderId.slice(0, 8)}` 
        : `Order #${data.orderId.slice(0, 8)} - ${data.newStatus}`;
      
      const text = `
Order ID: ${data.orderId}
Customer: ${data.customerName}
Phone: ${data.customerPhone}
Items: ${data.itemCount}
Total: $${(data.totalCents / 100).toFixed(2)}
Pickup: ${new Date(data.pickupAt).toLocaleString()}
${data.newStatus ? `Status: ${data.newStatus}` : ''}
      `.trim();

      await sendEmail({ to: adminEmail, subject, text });
    } catch (e) {
      console.error('Email notification failed:', e);
    }
  }

  // Slack notification
  if (slackUrl) {
    try {
      await fetch(slackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: data.type === 'new_order' ? '🌮 New Taco Order!' : '📋 Order Status Update',
                emoji: true
              }
            },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: `*Order:*\n#${data.orderId.slice(0, 8)}` },
                { type: 'mrkdwn', text: `*Customer:*\n${data.customerName}` },
                { type: 'mrkdwn', text: `*Phone:*\n${data.customerPhone}` },
                { type: 'mrkdwn', text: `*Total:*\n$${(data.totalCents / 100).toFixed(2)}` },
                { type: 'mrkdwn', text: `*Items:*\n${data.itemCount}` },
                { type: 'mrkdwn', text: `*Pickup:*\n${new Date(data.pickupAt).toLocaleString()}` }
              ]
            }
          ]
        })
      });
    } catch (e) {
      console.error('Slack notification failed:', e);
    }
  }

  // Discord notification
  if (discordUrl) {
    try {
      await fetch(discordUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: data.type === 'new_order' ? '🌮 New Taco Order!' : '📋 Order Status Update',
            color: data.type === 'new_order' ? 0x10B981 : 0x3B82F6,
            fields: [
              { name: 'Order ID', value: `#${data.orderId.slice(0, 8)}`, inline: true },
              { name: 'Customer', value: data.customerName, inline: true },
              { name: 'Phone', value: data.customerPhone, inline: true },
              { name: 'Total', value: `$${(data.totalCents / 100).toFixed(2)}`, inline: true },
              { name: 'Items', value: `${data.itemCount}`, inline: true },
              { name: 'Pickup', value: new Date(data.pickupAt).toLocaleString(), inline: true }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      });
    } catch (e) {
      console.error('Discord notification failed:', e);
    }
  }
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
