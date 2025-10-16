import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendEmail, sendToKitchenWebhook } from '@/lib/notifications';
import { prisma } from '@/lib/prisma';


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

    // Persist payment/order to DB (using Prisma). Infer schema from prisma/schema.prisma
    try {
      // Try to get userId from session metadata first (common pattern)
      // metadata could contain { userId } that maps to your Prisma User.id
      // Fallback to customer email
      const metadata: any = (sessionWithLineItems as any).metadata ?? (session as any).metadata ?? {};
      let userId: string | null = metadata?.userId ?? null;

      let user = null;
      if (userId) {
        // cast to any because generated Prisma client types may differ in your workspace
        user = await (prisma as any).user.findUnique({ where: { id: userId } });
      }

      if (!user && customerEmail) {
        user = await (prisma as any).user.findUnique({ where: { email: customerEmail } });
        if (!user) {
          // create a lightweight user record so Payment.userId (required) can reference it
          user = await (prisma as any).user.create({ data: { email: customerEmail } });
        }
      }

      // Compute amount in cents. Prefer Stripe's amount_total; fall back to subtotal or sum of line items
      const amountFromSession = (sessionWithLineItems as any).amount_total ?? (sessionWithLineItems as any).amount_subtotal;
      let amountCents: number | null = null;
      if (typeof amountFromSession === 'number') amountCents = amountFromSession;
      else {
        // sum line items (price.unit_amount is in cents)
        amountCents = lineItems.reduce((sum, li: any) => {
          const unit = li.price?.unit_amount ?? 0;
          const qty = li.quantity ?? 1;
          return sum + unit * qty;
        }, 0);
        if (amountCents === 0) amountCents = null;
      }

      if (user && amountCents !== null) {
        await (prisma as any).payment.create({
          data: {
            userId: user.id,
            amountCents: amountCents,
            currency: (sessionWithLineItems as any).currency ?? 'usd',
            stripePaymentId: (session as any).payment_intent ?? (sessionWithLineItems as any).payment_intent ?? undefined,
            metadata: {
              sessionId: session.id,
              orderSummary,
              lineItems: lineItems.map((li) => ({
                description: li.description,
                quantity: li.quantity,
                price: li.price?.unit_amount,
              })),
            },
          },
        });
      } else {
        console.warn('Skipping DB write for Stripe session - missing user or amount', { customerEmail, userId, amountCents });
      }
    } catch (err) {
      console.error('Failed to persist payment to DB', err);
    }

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
