# 🚀 Quick Start Guide - Website Generator Freemium

## Ready in 5 Steps

### Step 1: Run Database Migration (2 min)
```bash
npx prisma migrate dev --name add_generator_plans
```

This creates the new tables: `GeneratorPlan` and `GeneratorSubscription`.

### Step 2: Create Stripe Product (5 min)

1. Go to: https://dashboard.stripe.com/test/products
2. Click "Add product"
3. Fill in:
   - **Name**: Website Generator Pro
   - **Description**: Unlimited websites with advanced features
4. Click "Add pricing"
   - **Price**: $29.99
   - **Billing period**: Monthly
   - **Recurring**: Yes
5. **Copy the Price ID** (starts with `price_`)

### Step 3: Add Environment Variable (30 sec)

Add to `.env.local`:
```env
STRIPE_GENERATOR_PRO_PRICE_ID=price_xxxxxxxxxxxxx
```

### Step 4: Seed Plans (1 min)
```bash
npx prisma db seed
```

This creates both Standard (free) and Pro ($29.99) plans in your database.

### Step 5: Test It! (5 min)

```bash
npm run dev
```

1. Visit: http://localhost:3000/generator/pricing
2. Click "Start Free Trial"
3. Sign in (or create account)
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Should redirect to success page ✅

---

## 🎉 You're Done!

Your freemium model is live. Users can:
- ✅ Use Standard plan for free
- ✅ Upgrade to Pro with 14-day trial
- ✅ Access advanced features

---

## What's Included

### Pages Created
- **/generator/pricing** - Plan comparison
- **/generator/pro-checkout** - Stripe redirect
- **/generator/success** - Upgrade confirmation

### Components Created
- `PricingPlans` - Side-by-side plan cards
- `ComparisonTable` - Detailed features
- `GeneratorHero` - Landing hero
- `GeneratorFeatures` - Feature grid
- `UpgradePrompt` - For Standard users
- `PlanBadge` - Pro/Free indicator

### API Routes
- `POST /api/generator/checkout-pro`
- `GET /api/generator/user-plan`

### Hooks
- `useGeneratorPlan()` - Check user's plan

---

## Next Steps

### Must Have (Before Launch)
- [ ] Add Terms of Service page
- [ ] Add Privacy Policy page
- [ ] Set up production Stripe keys
- [ ] Test end-to-end in production
- [ ] Configure Stripe webhook endpoint

### Should Have (First Week)
- [ ] Welcome email after sign-up
- [ ] Trial expiration reminder email
- [ ] FAQ page for pricing
- [ ] Add analytics tracking

### Nice to Have (First Month)
- [ ] Subscription management page
- [ ] Usage dashboard (sites created)
- [ ] Feature gating in generator form
- [ ] Upgrade prompts at limits

---

## Testing Checklist

- [ ] Free user can create up to 3 sites
- [ ] Free user sees upgrade prompts
- [ ] Checkout flow works end-to-end
- [ ] Pro user has unlimited access
- [ ] Webhook creates subscription
- [ ] Success page displays correctly
- [ ] Pricing page loads quickly
- [ ] Mobile experience is good

---

## Troubleshooting

### Migration fails
```bash
# Reset if needed
npx prisma migrate reset
npx prisma migrate dev
npx prisma db seed
```

### Seed fails
Check that `STRIPE_GENERATOR_PRO_PRICE_ID` is set correctly in `.env.local`

### Checkout doesn't work
1. Verify Stripe keys are correct
2. Check browser console for errors
3. Ensure user is signed in
4. Test with Stripe test card

### Webhook not working
1. For local testing, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```
2. Copy webhook signing secret to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## Production Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add freemium model"
   git push
   ```

2. **Deploy on Vercel**
   - Connect GitHub repo
   - Add environment variables:
     - `DATABASE_URL`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_GENERATOR_PRO_PRICE_ID`
     - `STRIPE_WEBHOOK_SECRET`
     - All other required vars

3. **Configure Stripe Webhook**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - URL: `https://yourdomain.com/api/webhook/stripe`
   - Events: Select all `checkout.*` and `customer.subscription.*`
   - Copy signing secret to Vercel env vars

4. **Test in Production**
   - Use Stripe live keys (not test keys)
   - Test with real card or Stripe test cards
   - Monitor Stripe Dashboard for events

---

## 📊 Monitor These Metrics

After launch, track:
- Sign-ups per day
- Free → Pro conversion rate (target: 2-5%)
- Trial → Paid conversion (target: 20-30%)
- Monthly churn (target: <5%)
- MRR (Monthly Recurring Revenue)

Set up:
- Google Analytics for traffic
- Stripe Dashboard for revenue
- Mixpanel/Amplitude for funnel

---

## 🎯 Success Looks Like

**Week 1:**
- 50+ free sign-ups
- 2-5 paid conversions
- No major bugs

**Month 1:**
- 500+ free users
- 10-20 Pro users
- Positive user feedback

**Month 3:**
- 2,000+ free users
- 100+ Pro users
- Clear product-market fit

---

## Support

Questions? Check these docs:
- [GENERATOR_IMPLEMENTATION_COMPLETE.md](GENERATOR_IMPLEMENTATION_COMPLETE.md) - Overview
- [docs/GENERATOR_FREEMIUM_SETUP.md](docs/GENERATOR_FREEMIUM_SETUP.md) - Technical setup
- [docs/PROFESSIONAL_SAAS_GUIDE.md](docs/PROFESSIONAL_SAAS_GUIDE.md) - Best practices

---

**You're ready to launch! 🚀**
