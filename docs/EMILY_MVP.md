# Emily MVP (single-creator) setup

This adds a minimal, login-free paid access flow for Emily using Stripe Checkout and a tokenized cookie for gating.

## What was added
- API: `POST /api/emily/checkout` → creates Stripe Checkout session using `STRIPE_EMILY_PRICE_ID`.
- API: `GET /api/emily/confirm?session_id=...` → verifies payment, issues an `AccessToken`, sets `emily_access` HTTP-only cookie, returns redirect URL.
- API: `GET/POST /api/emily/messages` → simple token-gated chat per buyer.
- Pages: `/emily` (landing), `/emily/success` (post-checkout confirmation), `/emily/access` (gated content + chat).

## Required environment variables
- `STRIPE_SECRET_KEY` – Your Stripe secret key.
- `STRIPE_EMILY_PRICE_ID` – A Stripe Price ID for the one-time purchase.
- `NEXT_PUBLIC_APP_URL` – The full site origin, e.g. `https://yourdomain.com`.

Optional:
- `NEXT_PUBLIC_SITE_URL` – Fallback if `NEXT_PUBLIC_APP_URL` is not set.

## Database
- New Prisma models: `AccessToken`, `EmilyMessage`, `EmilyContent`.
- Run migrations and regenerate the client before building:
  - prisma migrate dev --name emily_mvp
  - prisma generate

Until you run `prisma generate`, code uses `(prisma as any)` for the new models to avoid type errors.

## Flow
1. Buyer visits `/emily` and clicks Get Access → Stripe Checkout.
2. Upon success, Stripe redirects to `/emily/success?session_id=...`.
3. The success page calls `/api/emily/confirm`, which verifies the session and issues a 30‑day token (`emily_access` cookie) scoped to `/emily`.
4. The buyer is redirected to `/emily/access` where gated content and chat are available.

## Notes
- This MVP stores chat per buyer token. Creator broadcast and media uploads are out of scope here but can be added later.
- To revoke access, set `revoked=true` for the token or set `expiresAt`.
- Consider adding a Stripe webhook later to provision tokens server-to-server for more resilience.
