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
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}.\nCheck your Vercel dashboard or .env files.`
    );
  }
}

// Optionally, call this at the top of your main entry points (API routes, server.ts, etc.)
