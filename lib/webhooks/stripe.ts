import Stripe from 'stripe';
import { sendEmail, sendToKitchenWebhook } from '@/lib/notifications';
import { prisma } from '@/lib/prisma';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required env var STRIPE_SECRET_KEY. Set this in Vercel or .env for local dev.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

export async function handleStripeWebhook(event: Stripe.Event) {
  if (event.type !== 'checkout.session.completed') {
    // return gracefully for other events; extend as needed
    return { handled: false };
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // 1. Retrieve expanded session with line items & customer
  const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items', 'customer'],
  });

  const customerEmail = sessionWithLineItems.customer ? (sessionWithLineItems.customer as Stripe.Customer).email : null;
  const lineItems = sessionWithLineItems.line_items?.data || [];
  const metadata: any = (sessionWithLineItems as any).metadata ?? (session as any).metadata ?? {};

  // ========== Emily Access Provisioning ==========
  if (metadata.purpose === 'emily_access') {
    if (!customerEmail) {
      console.warn('[STRIPE-WEBHOOK] Emily purchase without customer email:', session.id);
      return { handled: true };
    }
    try {
      const token = crypto.randomUUID().replace(/-/g, '');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await (prisma as any).accessToken.create({
        data: {
          email: customerEmail,
          token,
          purpose: 'emily',
          expiresAt,
        },
      });
      console.log('[STRIPE-WEBHOOK] Emily access token created:', { email: customerEmail, token });
      // TODO: Send email with access link
      await sendEmail({
        to: customerEmail,
        subject: 'Your Emily Studio Access',
        text: `Thanks for your purchase!\n\nYour private access link:\n${process.env.NEXT_PUBLIC_APP_URL || 'https://your-site.com'}/emily/access\n\nYou can access for 30 days. Bookmark this page!\n\n— Emily`,
      });
    } catch (err) {
      console.error('[STRIPE-WEBHOOK] Failed to provision Emily access:', err);
      throw err;
    }
    return { handled: true };
  }

  // ========== Existing Taco/General Orders ==========
  // 2. Format summary
  const orderSummary = lineItems.map(item => `${item.quantity} x ${item.description}`).join('\n');

  // 3. Send notification emails
  if (customerEmail) {
    await sendEmail({
      to: customerEmail,
      subject: 'Your Taco Order Confirmation',
      text: `Thanks for your order!\n\nYou ordered:\n${orderSummary}\n\nWe will prepare your food shortly.`,
    });
  }

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

  // 4. Persist Payment to DB (idempotent)
  try {
    let userId: string | null = metadata?.userId ?? null;

    let user = null;
    if (userId) user = await prisma.user.findUnique({ where: { id: userId } as any });
    if (!user && customerEmail) {
      user = await prisma.user.findUnique({ where: { email: customerEmail } as any });
      if (!user) user = await prisma.user.create({ data: { email: customerEmail } as any });
    }

    const amountFromSession = (sessionWithLineItems as any).amount_total ?? (sessionWithLineItems as any).amount_subtotal;
    let amountCents: number | null = null;
    if (typeof amountFromSession === 'number') amountCents = amountFromSession;
    else {
      amountCents = lineItems.reduce((sum, li: any) => {
        const unit = li.price?.unit_amount ?? 0;
        const qty = li.quantity ?? 1;
        return sum + unit * qty;
      }, 0);
      if (amountCents === 0) amountCents = null;
    }

    if (user && amountCents !== null) {
      const stripePaymentId = (session as any).payment_intent ?? (sessionWithLineItems as any).payment_intent ?? undefined;
      const existing = await (prisma as any).payment.findFirst({ where: { stripePaymentId } });
      if (!existing) {
        await (prisma as any).payment.create({
          data: {
            userId: user.id,
            amountCents,
            currency: (sessionWithLineItems as any).currency ?? 'usd',
            stripePaymentId,
            metadata: {
              sessionId: session.id,
              orderSummary,
              lineItems: lineItems.map((li) => ({ description: li.description, quantity: li.quantity, price: li.price?.unit_amount })),
            },
          },
        });
      }
    }
  } catch (err) {
    console.error('Failed to persist payment to DB', err);
    // rethrow so the caller can surface monitoring/alerting
    throw err;
  }

  return { handled: true };
}
