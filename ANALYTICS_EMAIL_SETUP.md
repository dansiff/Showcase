# Analytics & Email Setup Guide

Complete setup for Google Analytics tracking and transactional emails.

## Table of Contents

- [Google Analytics Setup](#google-analytics-setup)
- [Email Configuration](#email-configuration)
- [Welcome Email Flow](#welcome-email-flow)
- [Testing](#testing)
- [Environment Variables](#environment-variables)

---

## Google Analytics Setup

### 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon)
3. Create a new **GA4 Property**
4. Note your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variable

Add to `.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Analytics is Auto-Initialized

The `AnalyticsProvider` component in `app/layout.tsx` automatically:
- Loads Google Analytics script
- Tracks page views on route changes
- Provides tracking utilities throughout the app

### 4. Available Tracking Events

#### Generator Events
```typescript
import { 
  trackPricingPageView,
  trackUpgradeClick,
  trackUpgradeComplete,
  trackWebsiteCreationStart,
  trackWebsiteGenerated,
  trackWebsiteExport,
  trackFeatureUsage
} from '@/lib/analytics'

// Example: Track pricing page view
trackPricingPageView()

// Example: Track upgrade click (already implemented in PricingPlans component)
trackUpgradeClick('Pro')

// Example: Track website generation
trackWebsiteGenerated({
  templateType: 'restaurant',
  customization: 'advanced',
  timeSpent: 120,
  plan: 'Pro'
})
```

#### User Events
```typescript
import { 
  trackSignUp,
  trackLogin,
  trackProfileComplete 
} from '@/lib/analytics'

// After successful signup
trackSignUp('email')

// After login
trackLogin('google')
```

#### Error Tracking
```typescript
import { trackError, track404 } from '@/lib/analytics'

try {
  // your code
} catch (error) {
  trackError(error as Error, 'checkout_flow')
}
```

### 5. View Analytics Dashboard

Visit your GA4 property to see:
- **Realtime** - Live user activity
- **Reports** - User demographics, traffic sources
- **Events** - Custom event tracking
- **Conversions** - Mark events as conversion goals

#### Recommended Conversions to Track:
1. `purchase` - Pro plan subscription
2. `sign_up` - New user registration
3. `website_generated` - Successful site creation
4. `begin_checkout` - Upgrade button clicked

---

## Email Configuration

### Current Setup

Emails are sent via the existing `lib/notifications.ts` using Nodemailer.

### Email Templates Available

Located in `lib/email/templates.ts`:

1. **Welcome Email** - Sent when user signs up
2. **Trial Started** - Sent when Pro trial begins (14 days)
3. **Trial Ending** - Sent 3 days before trial ends
4. **Subscription Active** - Sent when payment succeeds
5. **Subscription Cancelled** - Sent when user cancels

### Email Service Functions

Located in `lib/email/service.ts`:

```typescript
import { 
  sendWelcomeEmail,
  sendTrialStartedEmail,
  sendSubscriptionActiveEmail 
} from '@/lib/email/service'

// Send welcome email
await sendWelcomeEmail({
  email: 'user@example.com',
  name: 'John Doe'
})

// Send trial started
await sendTrialStartedEmail({
  email: 'user@example.com',
  name: 'John Doe',
  plan: 'Pro',
  trialDays: 14
})
```

### Webhook Integration

Emails are automatically sent in `lib/webhooks/generator.ts`:

- ✅ **Trial Started** - When `checkout.session.completed`
- ✅ **Subscription Active** - When `customer.subscription.updated` with `status=active`
- ✅ **Subscription Cancelled** - When `customer.subscription.deleted`

### Trial Ending Reminder

To send trial ending reminders, set up a cron job or scheduled task:

#### Option 1: Vercel Cron (Recommended)

Create `app/api/cron/trial-reminders/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scheduleTrialEndingReminder } from '@/lib/email/service'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

    // Find subscriptions ending in 3 days
    const subscriptions = await prisma.generatorSubscription.findMany({
      where: {
        status: 'trialing',
        currentPeriodEnd: {
          gte: threeDaysFromNow,
          lte: new Date(threeDaysFromNow.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      include: {
        user: true,
        plan: true
      }
    })

    for (const sub of subscriptions) {
      if (sub.user.email) {
        await scheduleTrialEndingReminder(
          sub.user.email,
          sub.user.name || undefined,
          sub.plan.name,
          sub.currentPeriodEnd || new Date()
        )
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: subscriptions.length 
    })
  } catch (error) {
    console.error('[CRON] Trial reminder error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
```

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/trial-reminders",
    "schedule": "0 9 * * *"
  }]
}
```

#### Option 2: External Cron Service

Use [cron-job.org](https://cron-job.org/) or similar to hit your endpoint daily.

---

## Welcome Email Flow

### When to Send Welcome Emails

Currently, welcome emails are **not automatically sent** on signup. To enable:

#### Option 1: Auth Webhook (Recommended)

Create `app/api/auth/webhook/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email/service'

export async function POST(request: Request) {
  const event = await request.json()

  if (event.type === 'user.created') {
    const { email, user_metadata } = event.data

    await sendWelcomeEmail({
      email,
      name: user_metadata?.name
    }).catch(err => {
      console.error('[AUTH-WEBHOOK] Welcome email failed:', err)
    })
  }

  return NextResponse.json({ received: true })
}
```

Configure in Supabase Dashboard:
1. Go to **Authentication > Hooks**
2. Enable **User Created** webhook
3. Set URL: `https://yourdomain.com/api/auth/webhook`
4. Add secret token for verification

#### Option 2: Client-Side After Signup

In your signup page/component:

```typescript
import { sendWelcomeEmail } from '@/lib/email/service'

// After successful signup
await sendWelcomeEmail({
  email: userEmail,
  name: userName
})
```

---

## Testing

### Test Analytics Locally

1. Add GA Measurement ID to `.env.local`
2. Start dev server: `npm run dev`
3. Open browser DevTools > Console
4. Navigate through your app
5. You should see `[Analytics]` logs (if you add console.logs)
6. Check **Realtime** tab in GA4 dashboard

### Test Analytics in Production

1. Deploy to Vercel
2. Visit your site
3. Check GA4 **Realtime** dashboard
4. Trigger events (click upgrade, create website, etc.)
5. Verify events appear in **Events** report

### Test Emails Locally

1. Configure SMTP in `.env.local`:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

2. Create a test script `scripts/test-email.ts`:

```typescript
import { sendWelcomeEmail } from '../lib/email/service'

async function test() {
  await sendWelcomeEmail({
    email: 'test@example.com',
    name: 'Test User'
  })
  console.log('Email sent!')
}

test()
```

3. Run: `npx tsx scripts/test-email.ts`

### Test Webhooks with Stripe CLI

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
```

---

## Environment Variables

### Required for Analytics

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Required for Emails

Already configured in your existing `.env` (from `lib/notifications.ts`):

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

### Optional

```bash
# For cron authentication
CRON_SECRET=your-random-secret

# Admin email for notifications
ADMIN_EMAIL=admin@yourdomain.com
```

---

## Next Steps

1. ✅ **Add GA Measurement ID** - Configure in Vercel environment
2. ✅ **Test Analytics** - Visit site and check GA4 dashboard
3. ✅ **Test Email Templates** - Run test script or trigger Stripe webhook
4. ✅ **Set Up Cron Job** - For trial ending reminders (optional)
5. ✅ **Add Welcome Email Trigger** - Choose auth webhook or client-side
6. ✅ **Monitor GA4 Events** - Mark important events as conversions

---

## Summary

✅ **Analytics**: Auto-initialized, tracks page views + custom events  
✅ **Emails**: 5 templates ready, integrated with Stripe webhooks  
✅ **Trial Reminders**: Manual setup required (cron job)  
✅ **Welcome Emails**: Manual setup required (auth webhook or client-side)

The foundation is complete! Just add your GA Measurement ID and you're live.
