// lib/env.ts
// Centralized runtime env validation for required variables

const requiredEnvVars = [
  // Database
  'DATABASE_URL',
  // Supabase (browser + server)
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  // App URL for redirects
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SITE_URL',
  // Stripe
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  // Auth
  'NEXTAUTH_SECRET',
  // Optional depending on enabled providers
  // 'GOOGLE_CLIENT_ID',
  // 'GOOGLE_CLIENT_SECRET',
  // Webhooks (optional)
  // 'STRIPE_WEBHOOK_SECRET',
  // 'KITCHEN_WEBHOOK_URL',
];

export function validateEnvVars() {
  // Only validate in production builds to avoid blocking local dev
  if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
    console.warn('[ENV] Skipping env validation in local dev. Set required vars in Vercel dashboard for production.');
    return;
  }
  
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}.\nCheck your Vercel dashboard or .env files.`
    );
  }

  // Additional soft checks (warn but do not throw)
  const pub = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  const sec = process.env.STRIPE_SECRET_KEY || '';
  if ((pub.startsWith('pk_live') && sec.startsWith('sk_test')) || (pub.startsWith('pk_test') && sec.startsWith('sk_live'))) {
    console.warn('[ENV] Stripe key mode mismatch: publishable and secret keys appear to be from different modes.');
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('[ENV] STRIPE_WEBHOOK_SECRET is not set. Webhook verification will fail in production.');
  }
}

// Optionally, call this at the top of your main entry points (API routes, server.ts, etc.)
