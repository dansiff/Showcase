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
