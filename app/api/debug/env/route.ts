import { NextResponse } from "next/server";

export async function GET() {
  // Return presence (true/false) of env vars without exposing actual values
  const envCheck = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    DATABASE_URL: !!process.env.DATABASE_URL,
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    // Show actual values for public ones (safe to expose)
    NEXT_PUBLIC_SUPABASE_URL_VALUE: process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET",
    NEXT_PUBLIC_APP_URL_VALUE: process.env.NEXT_PUBLIC_APP_URL || "NOT SET",
  };

  return NextResponse.json(envCheck);
}
