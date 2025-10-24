import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasStripePublicKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  };

  const missing = Object.entries(envCheck)
    .filter(([key, value]) => key.startsWith("has") && !value)
    .map(([key]) => key.replace("has", ""));

  return NextResponse.json({
    status: missing.length === 0 ? "ok" : "missing_vars",
    environment: process.env.NODE_ENV,
    envCheck,
    missing: missing.length > 0 ? missing : undefined,
    timestamp: new Date().toISOString(),
  });
}
