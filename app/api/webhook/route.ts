import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { handleStripeWebhook } from '@/lib/webhooks/stripe';
import { sendEmail, sendToKitchenWebhook } from '@/lib/notifications';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  try {
    const result = await handleStripeWebhook(event);
    return NextResponse.json({ received: true, ...result });
  } catch (err) {
    console.error('Error processing Stripe webhook:', err);
    try {
      await sendToKitchenWebhook({ level: 'error', message: 'Stripe webhook processing failed', error: String(err), eventType: event.type });
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({ to: process.env.ADMIN_EMAIL, subject: 'Stripe webhook processing failed', text: `Error: ${String(err)}\nEvent type: ${event.type}` });
      }
    } catch (notifyErr) {
      console.error('Failed to send webhook failure alert', notifyErr);
    }

    return new NextResponse('Processing error', { status: 500 });
  }
}
