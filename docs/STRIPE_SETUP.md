# Stripe Payment Setup Guide

## ✅ What's Configured

Your payment system is now set up with:
- **Standard Plan**: $2,500 one-time + $49/month hosting
- **Blitz Plan**: $3,999 one-time + $79/month hosting
- Stripe checkout pages at `/pay/standard` and `/pay/blitz`
- Success page redirection after payment

---

## 🔧 Required Setup Steps

### 1. Install Stripe Package (If Not Already Installed)

```powershell
npm install stripe
```

### 2. Configure Environment Variables

Update your `.env` file with your **actual** Stripe keys:

```env
# STRIPE CONFIGURATION
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_ACTUAL_KEY_HERE"
STRIPE_SECRET_KEY="sk_live_YOUR_ACTUAL_KEY_HERE"  # Change from test to live
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET"

# Site URL (Important for redirects)
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"  # Or http://localhost:3000 for dev
```

### 3. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** → **API keys**
3. Copy your keys:
   - **Publishable key** starts with `pk_live_...` (for production) or `pk_test_...` (for testing)
   - **Secret key** starts with `sk_live_...` (for production) or `sk_test_...` (for testing)

**⚠️ Important**: 
- Use **test keys** (`pk_test_` and `sk_test_`) during development
- Switch to **live keys** (`pk_live_` and `sk_live_`) for production
- Never commit your `.env` file to git!

---

## 🧪 Testing the Payment Flow

### Use Stripe Test Cards

When using test mode, use these test card numbers:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Failed Payment:**
- Card: `4000 0000 0000 0002`
- This will simulate a declined card

**3D Secure Required:**
- Card: `4000 0025 0000 3155`
- Tests authentication flow

---

## 🔄 How the Payment Flow Works

### Standard Plan (`/pay/standard`)
1. User clicks "Get Started" on pricing page
2. Redirects to `/pay/standard`
3. Creates Stripe Checkout session with:
   - One-time charge: $2,500 (build fee)
   - Recurring charge: $49/month (hosting)
4. User completes payment on Stripe
5. Redirects to `/success?session_id=xxx`

### Blitz Plan (`/pay/blitz`)
- Same flow but with $3,999 one-time + $79/month

---

## 📝 Customizing the Checkout

### Change Prices

Edit the route files:

**`app/pay/standard/route.ts`:**
```typescript
unit_amount: 250000, // $2,500 in cents (change to 200000 for $2,000)
```

**`app/pay/blitz/route.ts`:**
```typescript
unit_amount: 399900, // $3,999 in cents
```

### Add More Plans

Copy one of the route files and modify:
```typescript
// app/pay/custom-plan/route.ts
unit_amount: 500000, // $5,000
// ... rest of configuration
```

---

## 🎯 Setting Up Webhooks (Recommended)

Webhooks let you know when payments succeed/fail.

### 1. Create Webhook Endpoint

Create `app/api/webhooks/stripe/route.ts`:

```typescript
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle different event types
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: Save order to database, send confirmation email
      console.log("Payment successful:", session.id);
      break;

    case "customer.subscription.created":
      // TODO: Activate subscription in your database
      break;

    case "customer.subscription.deleted":
      // TODO: Cancel subscription in your database
      break;
  }

  return NextResponse.json({ received: true });
}
```

### 2. Configure Webhook in Stripe Dashboard

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** to your `.env` as `STRIPE_WEBHOOK_SECRET`

### 3. Test Webhooks Locally

Install Stripe CLI:
```powershell
# Download from https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 🎨 Customizing the Success Page

Create a success page at `app/success/page.tsx`:

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful - Thank You!",
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="max-w-md text-center p-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-400 mb-8">
          Thank you for your purchase. We'll be in touch shortly to get started on your project.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-500"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
```

---

## 💳 Payment Links

Share these direct links:

**Standard Plan:**
- Dev: `http://localhost:3000/pay/standard`
- Production: `https://yourdomain.com/pay/standard`

**Blitz Plan:**
- Dev: `http://localhost:3000/pay/blitz`
- Production: `https://yourdomain.com/pay/blitz`

---

## 🔒 Security Best Practices

1. **Never expose secret keys**
   - Keep `STRIPE_SECRET_KEY` server-side only
   - Only `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` can be in client code

2. **Verify webhooks**
   - Always verify webhook signatures
   - Use the webhook secret to validate requests

3. **Use HTTPS in production**
   - Stripe requires HTTPS for live mode
   - Development (localhost) works with HTTP

4. **Test thoroughly**
   - Test successful payments
   - Test failed payments
   - Test subscription cancellations

---

## 📊 Monitoring Payments

### Stripe Dashboard
Monitor all transactions at: https://dashboard.stripe.com/payments

### Key Metrics to Track
- Total revenue
- Successful vs failed payments
- Active subscriptions
- Churn rate

---

## 🚨 Troubleshooting

### "Invalid API Key"
- Check that `STRIPE_SECRET_KEY` is set correctly in `.env`
- Ensure you're not mixing test/live keys

### "No such checkout session"
- Verify `NEXT_PUBLIC_SITE_URL` is correct
- Check that success URL is accessible

### Webhook Not Receiving Events
- Verify webhook URL in Stripe dashboard
- Check that endpoint is publicly accessible
- Validate webhook secret is correct

### Payment Succeeds but No Redirect
- Check browser console for errors
- Verify success_url in checkout session creation
- Test with Stripe CLI locally

---

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [Test Card Numbers](https://stripe.com/docs/testing)
- [Webhook Guide](https://stripe.com/docs/webhooks)

---

## ✅ Launch Checklist

Before going live:

- [ ] Switch from test to live Stripe keys
- [ ] Test payment flow end-to-end
- [ ] Set up webhooks
- [ ] Create success/cancel pages
- [ ] Add terms of service checkbox
- [ ] Set up email notifications
- [ ] Test on mobile devices
- [ ] Verify SSL certificate is active
- [ ] Monitor first few transactions closely

---

## 🎉 You're All Set!

Your payment system is ready to accept payments. Start with test mode, verify everything works, then switch to live mode for production.

Need help? Check the Stripe documentation or reach out to their excellent support team.
