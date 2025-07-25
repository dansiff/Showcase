import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendEmail, sendToKitchenWebhook } from '@/lib/notifications';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err);
    return new NextResponse('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // 1. Extract line items & customer info
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer'],
    });

    const customerEmail = sessionWithLineItems.customer ? (sessionWithLineItems.customer as Stripe.Customer).email : null;
    const lineItems = sessionWithLineItems.line_items?.data || [];

    // 2. Format order summary
    const orderSummary = lineItems.map(item => `${item.quantity} x ${item.description}`).join('\n');

    // 3. Send confirmation email to customer
    if (customerEmail) {
      await sendEmail({
        to: customerEmail,
        subject: 'Your Taco Order Confirmation',
        text: `Thanks for your order!\n\nYou ordered:\n${orderSummary}\n\nWe will prepare your food shortly.`,
      });
    }

    // 4. Send order to kitchen email & webhook
    await sendEmail({
      to: 'kitchen@querrepariotacos.com',
      subject: 'New Taco Order Received',
      text: `New order received:\n\n${orderSummary}\n\nPlease prepare ASAP!`,
    });

    await sendToKitchenWebhook({
      order: orderSummary,
      timestamp: new Date().toISOString(),
      sessionId: session.id,
    });

    // Optionally update your DB here

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
