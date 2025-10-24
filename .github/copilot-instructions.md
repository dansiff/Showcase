# Copilot project instructions

This repo is a Next.js 15 App Router monorepo-style app with multiple portals (fan, creator, client, admin) sharing auth, data, and payments. Use these rules to be productive fast.

## Architecture and data flow
- Stack: Next.js App Router + TypeScript + Tailwind. Data via Prisma (PostgreSQL). Auth primarily via Supabase SSR; a NextAuth route exists but the UI flows use Supabase.
- Prisma singleton: import `prisma` from `lib/prisma` (don’t new PrismaClient directly). Env is validated via `lib/env.ts`.
- Portals/hub: `lib/portal.ts` detects available portals and default routes; `/portal/page.tsx` renders hub and redirects if only one portal is active.
- Payments: Stripe Checkout + webhooks. Core handler: `lib/webhooks/stripe.ts`; API route verifies signature and delegates in `app/api/webhook/stripe/route.ts`.
- Notifications: `lib/notifications.ts` sends email (Nodemailer) and optional Slack/Discord webhooks on key events (e.g., client intake, orders).
- Supabase: server client in `lib/supabase/server.ts` (cookies from `next/headers`); browser client via `lib/supabase/client.ts` and memoized on `window.__supabase_client`.
- Revenue and routing helpers live in `lib/revenue.ts` and `lib/portal.ts` respectively.

## Conventions and patterns
- Paths use alias `@/*` (see `tsconfig.json`). Prefer `@/lib/...`, `@/components/...`.
- Server-side DB calls go through `@/lib/prisma`. Keep route handlers in `app/api/**/route.ts`.
- Auth UI flows: app/(auth) pages use Supabase (`getSupabaseBrowserClient` with `flowType: 'pkce'`). After login, redirect to `/portal` and let hub logic route by role.
- **Email-first Prisma normalization**: All API routes resolve the Prisma user by `email` (not Supabase `user.id`), create the Prisma user if missing, then use the Prisma user's internal `id` for relations (Creator, Profile, etc.). This prevents mismatches between Supabase's user.id and Prisma's id.
- Default portal order: admin → creator → client → fan (see `getDefaultPortalPath`). When users have multiple portals, show the hub.
- Stripe API version is pinned in code. Webhook signature is required; do not parse JSON body before verifying (`await req.text()`).
- Use Tailwind + `cn` from `lib/utils.ts` for class merging.

## Environment and secrets
- Required envs are checked in `lib/env.ts`. Key variables: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXTAUTH_SECRET`. Optional: `STRIPE_WEBHOOK_SECRET`, `SMTP_*`, `SLACK_WEBHOOK_URL`, `DISCORD_WEBHOOK_URL`, `ADMIN_EMAIL`.
- Use a pooled Supabase connection for serverless (Vercel): set `DATABASE_URL` to the pool endpoint (port 6543) with `?pgbouncer=true&connection_limit=1&sslmode=require`. See `.env.example`.
- `lib/prisma` calls `validateEnvVars()` once; local dev skips strict validation.

## Developer workflows
- Run: `npm run dev` (Next dev). Build: `npm run build`; Start: `npm start`; Lint: `npm run lint`. Seed sample data: `npm run seed` (requires DB ready).
- Database: Prisma v6 with Postgres. When models change, run migrations (standard Prisma commands) before `seed`. Models include Users, Creators, Plans, Subscriptions, Content, Posts/Likes, ClientIntake, Affiliate/Referral/Payout.
- CI: `postinstall` runs `prisma generate` to keep Prisma Client types in sync on Vercel.
- Stripe webhooks: develop against `app/api/webhook/stripe/route.ts`. Verify signatures with `STRIPE_WEBHOOK_SECRET`; CLI can forward events.
- Auth: Supabase clients only. Prefer `createSupabaseServerClient()` in server components and `getSupabaseBrowserClient()` in client components. The NextAuth route (`app/api/Nextauth/route.ts`) is present but not used by the current auth UI.

## Examples to follow
- Portal hub and routing: `app/portal/page.tsx`, `lib/portal.ts`.
- Webhook verification: `app/api/webhook/stripe/route.ts` → `lib/webhooks/stripe.ts`.
- Intake notifications: see Slack/Discord payloads in `lib/notifications.ts`.
- Revenue math and fee normalization: `lib/revenue.ts`.

## Gotchas
- Do not instantiate Prisma per request; reuse `@/lib/prisma`.
- In webhook routes, read raw body (`req.text()`), construct event, then branch on `event.type`.
- Supabase server cookies from `next/headers` are read-only; set/remove are intentional no-ops in SSR helpers.
- Keep redirects with `next/navigation`’s `redirect()` in server components/handlers.
