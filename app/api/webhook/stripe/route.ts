import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { handleStripeWebhook } from '@/lib/webhooks/stripe';
import { sendEmail, sendToKitchenWebhook } from '@/lib/notifications';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event | undefined;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err);
    return new NextResponse('Webhook Error', { status: 400 });
  }

  try {
    // event is defined here after successful constructEvent
    const res = await handleStripeWebhook(event!);
    return NextResponse.json({ received: true, ...res });
  } catch (err) {
    console.error('Error processing Stripe webhook:', err);
    // Send alert to kitchen webhook or admin email if configured
    try {
      await sendToKitchenWebhook({
        level: 'error',
        message: 'Stripe webhook processing failed',
        error: String(err),
        eventType: event?.type ?? 'unknown',
      });
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: 'Stripe webhook processing failed',
          text: `Error: ${String(err)}\nEvent type: ${event?.type ?? 'unknown'}`,
        });
      }
    } catch (notifyErr) {
      console.error('Failed to send webhook failure alert', notifyErr);
    }

    return new NextResponse('Processing error', { status: 500 });
  }
}
