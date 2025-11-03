# Emily MVP (single-creator) — Complete Setup Guide

This is a minimal, login-free paid access flow for Emily using Stripe Checkout and tokenized cookie gating.

## What's Included

### Pages
- `/emily` — Landing page with checkout CTA (clean white "Emily Atelier" design)
- `/emily/success` — Post-checkout confirmation, sets access cookie
- `/emily/access` — Gated content: gallery, chat, voice clips (admin editor visible if logged in)
- `/emily/admin` — Admin login page (sets `emily_admin` cookie)

### APIs
- `POST /api/emily/checkout` — Creates Stripe Checkout session
- `GET /api/emily/confirm?session_id=...` — Verifies payment, issues AccessToken, sets cookie
- `GET/POST /api/emily/messages` — Token-gated chat (buyer messages)
- `POST /api/emily/upload` — Multipart file upload to Supabase Storage (admin)
- `GET/POST /api/emily/content` — Editable content sections (admin POST)
- `POST /api/emily/admin/login` — Sets admin cookie with EMILY_ADMIN_KEY

### Prisma Models
- `AccessToken` — 30-day tokenized access per email
- `EmilyMessage` — Chat messages (per access token)
- `EmilyContent` — Editable sections (title, body, media URLs)

### Stripe Webhook
- Listens for `checkout.session.completed` with `metadata.purpose === 'emily_access'`
- Auto-creates AccessToken server-side and emails the buyer with access link
- Idempotent (won't duplicate tokens)

---

## Step-by-Step Setup

### 1. Stripe Product & Price

You **must** create the product in Stripe Dashboard first.

1. **Go to**: [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. **Create Product**:
   - Name: `Emily Studio — 30-Day Access`
   - Description: `Premium photo sets, private chat, voice clips, and future video.`
3. **Add Price**:
   - Type: **One-time**
   - Amount: e.g., `$29.99` (or your price)
   - Currency: `USD`
   - Click **Save**
4. **Copy the Price ID**: Looks like `price_1SOJtUBeL5NCPqlzCci9ni20`
   - ⚠️ **Not** the Product ID (`prod_...`)—you need the **Price** ID (`price_...`)

### 2. Supabase Storage Bucket

1. **Go to**: [Supabase Dashboard → Storage](https://supabase.com/dashboard/project/_/storage/buckets)
2. **Create Bucket**:
   - Name: `emily`
   - Public: ✅ **Yes** (so uploaded images have public URLs)
3. **Copy your Service Role Key**:
   - Settings → API → `service_role` key (keep secret!)

### 3. Environment Variables

Set these in **Vercel** (or `.env.local` for dev):

#### Required
```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...                     # or sk_test_... for testing
STRIPE_EMILY_PRICE_ID=price_1SOJtUBeL5NCPqlzCci9ni20  # ← Your actual Price ID
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...   # or pk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # For uploads

# App
NEXT_PUBLIC_APP_URL=https://your-site.vercel.app

# Database
DATABASE_URL=postgresql://...  # Supabase pooled connection string

# Admin (pick a strong secret)
EMILY_ADMIN_KEY=some-strong-random-secret-123
```

#### Optional
```bash
SUPABASE_EMILY_BUCKET=emily  # Defaults to "emily" if not set
STRIPE_WEBHOOK_SECRET=whsec_...  # For webhook signature verification (recommended)
```

### 4. Database Migration

Run the Prisma migration to create the new Emily tables:

```bash
npx prisma migrate dev --name emily_mvp
npx prisma generate
```

This creates:
- `AccessToken`
- `EmilyMessage`
- `EmilyContent`

### 5. Stripe Webhook (Production)

To auto-provision access tokens server-side:

1. **Go to**: [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. **Add Endpoint**:
   - URL: `https://your-site.vercel.app/api/webhook/stripe`
   - Events: Select `checkout.session.completed`
3. **Copy Signing Secret**: `whsec_...`
4. **Add to Vercel Env**: `STRIPE_WEBHOOK_SECRET=whsec_...`
5. **Redeploy**

The webhook handler in `lib/webhooks/stripe.ts` checks for `metadata.purpose === 'emily_access'` and:
- Creates an `AccessToken`
- Emails the buyer with the `/emily/access` link

---

## How It Works

### Buyer Flow (No Login)
1. Visit `/emily` → Click "Get Access" → Redirected to Stripe Checkout
2. Complete payment → Stripe redirects to `/emily/success?session_id=...`
3. Success page calls `/api/emily/confirm`:
   - Verifies session with Stripe
   - Creates `AccessToken` (30 days)
   - Sets `emily_access` HTTP-only cookie
   - Redirects to `/emily/access`
4. Access page validates cookie/token server-side:
   - Shows gallery, chat, voice clips
   - Chat messages are per-token (private to buyer)

### Webhook Flow (Backup/Server-Side)
- Stripe fires `checkout.session.completed` webhook
- Handler checks `metadata.purpose === 'emily_access'`
- Creates `AccessToken` for customer email
- Sends email with access link
- Idempotent (won't duplicate if buyer reloads success page)

### Admin Flow (You)
1. Visit `/emily/admin`
2. Enter your `EMILY_ADMIN_KEY`
3. Redirected to `/emily/access` with `emily_admin` cookie set
4. Editor appears at bottom of page:
   - Edit title, body, upload images
   - Save → updates `EmilyContent` table
   - Gallery on access page pulls from `mediaUrls`

---

## Testing Checklist

### Local Dev
```bash
npm run dev
```
- [ ] Go to `/emily` → clean landing page loads
- [ ] Click "Get Access" → redirects to Stripe Checkout (test mode)
- [ ] Use test card `4242 4242 4242 4242`, any future date, any CVC
- [ ] After payment → redirected to `/emily/success` → auto-redirect to `/emily/access`
- [ ] Chat: send a message, refresh, see it persist
- [ ] Admin: go to `/emily/admin`, enter `EMILY_ADMIN_KEY`, see editor on access page
- [ ] Upload: add an image in editor → appears in gallery

### Production
- [ ] Set all env vars in Vercel
- [ ] Deploy
- [ ] Test real checkout with live Stripe keys
- [ ] Verify webhook fires and creates token (check Stripe logs)
- [ ] Buyer receives email with access link

---

## FAQ

**Q: Do I need to create the Stripe product in code?**
A: No. You **must** create the Product and Price in Stripe Dashboard first, then copy the `price_...` ID to your env.

**Q: What if I lose my access cookie?**
A: The token is stored in the database by email. You can manually query `AccessToken` table and use the token to set a new cookie, or re-purchase (webhook creates a new token).

**Q: How do I revoke access?**
A: Set `revoked: true` or update `expiresAt` in the `AccessToken` table for that email/token.

**Q: Can I have multiple creators?**
A: This MVP is single-creator (Emily). To scale:
- Add a `creatorId` to `AccessToken`, `EmilyMessage`, `EmilyContent`
- Parameterize routes: `/[creatorSlug]/access`, `/api/[creatorSlug]/checkout`, etc.
- Add creator signup/onboarding flow

**Q: How do I customize the email?**
A: Edit the `sendEmail` call in `lib/webhooks/stripe.ts` (line with "Your Emily Studio Access"). You can use HTML templates or a service like SendGrid/Postmark.

**Q: What about video?**
A: Placeholder text says "Video coming soon." When ready:
- Upload video to Supabase Storage or a CDN
- Add video URL to `EmilyContent.mediaUrls`
- Render `<video>` tag in `/emily/access` gallery

---

## Troubleshooting

### "No such price: 'price_...'"
- **Cause**: Wrong Price ID or test/live mode mismatch.
- **Fix**: Double-check you copied the **Price** ID (not Product ID). Ensure test keys match test prices, live keys match live prices.

### "Missing STRIPE_EMILY_PRICE_ID"
- **Cause**: Env var not set in Vercel.
- **Fix**: Add it in Vercel → Project → Settings → Environment Variables → Redeploy.

### "Unauthorized" on upload
- **Cause**: Missing `SUPABASE_SERVICE_ROLE_KEY` or wrong bucket name.
- **Fix**: Set service key; ensure bucket `emily` exists and is public.

### Webhook not firing
- **Cause**: Endpoint not added or secret mismatch.
- **Fix**: Add webhook in Stripe Dashboard; set `STRIPE_WEBHOOK_SECRET`; check Stripe logs for delivery errors.

### Chat not loading
- **Cause**: Prisma migration not run or `AccessToken` model missing.
- **Fix**: Run `npx prisma migrate dev --name emily_mvp` and `npx prisma generate`.

---

## Next Steps (Optional Enhancements)

- [ ] Add creator broadcast messages (visible to all buyers)
- [ ] Video upload and playback
- [ ] Email customization (HTML templates)
- [ ] Multi-creator support (dynamic routes)
- [ ] Analytics dashboard (purchases, active tokens, chat volume)
- [ ] Tip jar / upsell additional content
- [ ] Refund handling (webhook `charge.refunded` → revoke token)

---

**You're all set!** 🎉

Create your Stripe Price, set the env vars, migrate the DB, and deploy. Buyers can purchase and access Emily's studio instantly.
