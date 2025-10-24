import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: 'ok' | 'error'; message?: string; responseTime?: number }> = {};

  // 1. Database connection check
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1 as ok`;
    checks.database = {
      status: 'ok',
      responseTime: Date.now() - dbStart,
    };
  } catch (err) {
    checks.database = {
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }

  // 2. Stripe API check
  try {
    const stripeStart = Date.now();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
      apiVersion: '2025-08-27.basil' 
    });
    await stripe.products.list({ limit: 1 });
    checks.stripe = {
      status: 'ok',
      responseTime: Date.now() - stripeStart,
    };
  } catch (err) {
    checks.stripe = {
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }

  // 3. Supabase env vars check (doesn't ping API, just verifies config)
  checks.supabase = {
    status: 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? 'ok'
        : 'error',
    message: 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? undefined
        : 'Missing Supabase environment variables',
  };

  // 4. Overall status
  const allOk = Object.values(checks).every((check) => check.status === 'ok');
  const totalTime = Date.now() - startTime;

  const response = {
    status: allOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks,
    totalResponseTime: totalTime,
  };

  return NextResponse.json(
    response,
    { status: allOk ? 200 : 503 }
  );
}
