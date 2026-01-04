# Website Generator - Freemium Implementation Guide

## Overview

Your website generator now features a **freemium model** with:
- **Standard (Free)**: Up to 3 websites, 10 pages each, basic features
- **Pro ($29.99/month)**: Unlimited websites, unlimited pages, advanced features, 14-day free trial

## Database Changes

### New Prisma Models Added

1. **GeneratorPlan** - Stores plan definitions
   - Fields: planType, name, price, stripe integration, feature flags
   - Relations: hasMany GeneratorSubscription

2. **GeneratorSubscription** - Tracks user subscriptions
   - Fields: userId, planId, stripeSubId, status, trial period
   - Relations: belongsTo User, belongsTo GeneratorPlan
   - Relations: hasMany GeneratedSite

3. **GeneratedSite** - Updated model
   - Added userId and subscriptionId relations
   - Ensures sites are tied to user subscriptions

4. **User** - Updated with new relations
   - Added: generatorSubscriptions, generatedSites

## Environment Variables Required

```env
# Stripe Keys (already required)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# NEW: Stripe Pro Plan Price ID
# Create this in Stripe dashboard at https://dashboard.stripe.com/products
STRIPE_GENERATOR_PRO_PRICE_ID=price_...

# Webhook Secret (for testing)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Setting Up Stripe Price

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Products
3. Create a new product:
   - Name: "Website Generator Pro"
   - Description: "Unlimited websites with advanced features"
4. Create a price:
   - Currency: USD
   - Price: $29.99
   - Billing period: Monthly (recurring)
   - Copy the Price ID (starts with `price_`)
4. Add to `.env.local`:
   ```
   STRIPE_GENERATOR_PRO_PRICE_ID=price_xxxxx
   ```

## New Routes & Pages

### User-Facing Pages

1. **Pricing Page** - `/generator/pricing`
   - Components: `PricingPlans`, `ComparisonTable`
   - Shows plan comparison with features
   - CTAs to start building or upgrade

2. **Checkout Page** - `/generator/pro-checkout`
   - Client-side redirect to Stripe Checkout
   - Requires authentication
   - Redirects to sign-in if not authenticated

3. **Success Page** - `/generator/success`
   - Confirms upgrade is complete
   - Shows what's included in Pro
   - CTA to start building

4. **Main Generator** - `/generator`
   - Updated with hero section
   - Feature showcase
   - Onboarding for free & pro users

### API Routes

1. **POST `/api/generator/checkout-pro`**
   - Initiates Stripe checkout session
   - Requires authenticated user
   - Returns Stripe Checkout URL

## New Components

### 1. `components/generator/PricingPlans.tsx`
- Displays both Standard and Pro plans
- Feature comparisons
- FAQ section
- CTAs to start/upgrade

### 2. `components/generator/ComparisonTable.tsx`
- Detailed feature-by-feature comparison
- Full list of 22+ features
- Easy to update/extend

### 3. `components/generator/GeneratorHero.tsx`
- Hero section for generator page
- Calls to action
- Badges and messaging

### 4. `components/generator/GeneratorFeatures.tsx`
- Showcase of 9 key features
- Icons and descriptions
- Responsive grid

## Webhook Handling

### Updated `lib/webhooks/generator.ts`

Handles these Stripe events:
- `checkout.session.completed` - Creates subscription in database
- `customer.subscription.updated` - Syncs subscription status
- `customer.subscription.deleted` - Marks subscription as canceled

Integrated into main webhook handler in `lib/webhooks/stripe.ts`

## Feature Access Control

### Checking User's Plan

```typescript
import { prisma } from '@/lib/prisma'

// Get user's current plan
const subscription = await prisma.generatorSubscription.findFirst({
  where: { userId: user.id, status: 'active' },
  include: { plan: true },
})

const currentPlan = subscription?.plan.planType // 'STANDARD' or 'PRO'

// Check specific feature
const hasEcommerce = currentPlan === 'PRO' && subscription?.plan.ecommerceFeatures

// Check limits
const maxSites = subscription?.plan.maxSites // 3 for Standard, unlimited for Pro
```

### In React Components

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function AdvancedFeature() {
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkPlan = async () => {
      const supabase = createSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const response = await fetch('/api/generator/user-plan', {
        headers: { 'Authorization': `Bearer ${user.id}` }
      })
      const { planType } = await response.json()
      setIsPro(planType === 'PRO')
      setLoading(false)
    }
    
    checkPlan()
  }, [])

  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {isPro ? (
        <AdvancedFeatureContent />
      ) : (
        <UpgradePrompt />
      )}
    </div>
  )
}
```

## Implementation TODO

- [ ] Run database migration: `npx prisma migrate dev --name add_generator_plans`
- [ ] Seed initial plans with: `npx prisma db seed` (create seed in `prisma/seed.ts`)
- [ ] Create Stripe products and prices
- [ ] Add `STRIPE_GENERATOR_PRO_PRICE_ID` to `.env.local`
- [ ] Test checkout flow locally with Stripe test keys
- [ ] Add plan check API endpoint: `/api/generator/user-plan`
- [ ] Update generator form to enforce plan limits
- [ ] Add feature gating to form (disable Pro features for Standard users)
- [ ] Add upgrade modals when Standard users try Pro features
- [ ] Create success/onboarding email after upgrade
- [ ] Deploy and test with live Stripe keys

## Professional Enhancements to Consider

### 1. **Upsell Opportunities**
- Show "Upgrade to Pro" prompt when user hits limits
- Highlight Pro features at key moments
- Display savings calculation for annual plans

### 2. **Onboarding**
- Welcome email after sign-up
- Feature walkthrough for new Pro users
- Demo videos for Pro features

### 3. **Analytics**
- Track feature usage to identify upgrade opportunities
- Monitor conversion rates from Standard → Pro
- Analyze which features drive conversions

### 4. **Customer Success**
- In-app help/education for Pro features
- Pro-exclusive support channel (Discord, email)
- Regular feature updates to Pro users

### 5. **Payment & Billing**
- Self-serve subscription management (pause, cancel, upgrade)
- Invoice history and receipts
- Promo code support
- Annual billing discount (e.g., 20% off)

### 6. **Advanced Features (Future)**
- **Team Plans**: Multiple users per subscription
- **Enterprise**: Custom pricing, dedicated support
- **Add-ons**: Extra storage, form submissions, email credits
- **Usage-Based**: Billing based on actual usage (advanced plan)

### 7. **Marketing**
- Case studies of successful sites created
- Testimonials from Pro users
- Blog with SEO tutorials
- Free website templates library

## Testing Locally

1. Set up Stripe test keys in `.env.local`
2. Use test card: `4242 4242 4242 4242`
3. Run: `npm run dev`
4. Visit: `http://localhost:3000/generator/pricing`
5. Click "Start Free Trial" → redirects to `/generator/pro-checkout`
6. Complete checkout with test card

## Troubleshooting

### Checkout fails
- Check `STRIPE_GENERATOR_PRO_PRICE_ID` is set correctly
- Verify Stripe keys in `.env.local`
- Check browser console for errors

### Subscription not created
- Check Stripe webhook is configured
- Verify webhook secret is correct
- Check database for subscription records

### Feature access denied
- Verify user has active subscription
- Check plan has feature enabled
- Verify subscription status is 'active'

## Support & Next Steps

1. **Documentation**: Share pricing/feature info with customers
2. **Sales Page**: Update homepage with generator link ✅
3. **Emails**: Create upgrade confirmation email
4. **Support**: Set up FAQ section
5. **Monitoring**: Track upgrades and churn

---

**Pro Tips:**
- Start with simple 2-tier (Free/Pro), add more later
- Use Stripe's built-in tax handling
- Implement refund/chargeback policies
- Monitor MRR (Monthly Recurring Revenue)
- Consider seasonal promotions
