// lib/env.ts
// Centralized runtime env validation for required variables

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  // Add other required keys here as needed
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
