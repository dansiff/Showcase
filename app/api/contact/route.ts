import { NextResponse } from "next/server";
import { Resend } from "resend";
import ContactEmail from "@/app/emails/ContactEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: "onboarding@resend.dev", // later: use your domain
      to: "your-email@example.com", // replace with your receiving email
      subject: `New Contact Form Submission from ${name}`,
      react: ContactEmail({ name, email, message }), // using React Email
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
