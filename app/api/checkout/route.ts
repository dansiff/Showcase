// app/api/checkout/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

// Budget range to dollar amount mapping
const budgetMap: Record<string, number> = {
  'under-5k': 3500,
  '5k-10k': 7500,
  '10k-25k': 17500,
  '25k-50k': 37500,
  '50k-plus': 75000,
};

export async function POST(req: Request) {
  const body = await req.json();

  try {
    // Handle client intake deposit
    if (body.type === 'deposit' && body.intakeId && body.budget) {
      const projectAmount = budgetMap[body.budget] || 5000;
      const depositAmount = Math.round(projectAmount * 0.5); // 50% deposit

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Website Development Project - 50% Deposit',
                description: `Deposit for project. Remaining $${depositAmount.toFixed(2)} due upon completion.`,
              },
              unit_amount: depositAmount * 100, // Stripe uses cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/intake/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/intake`,
        metadata: {
          intakeId: body.intakeId,
          type: 'deposit',
          depositAmount: depositAmount.toString(),
        },
      });

      // Update intake record with session ID
      await prisma.clientIntake.update({
        where: { id: body.intakeId },
        data: { 
          stripeSessionId: session.id,
          depositAmount: depositAmount,
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // Handle regular checkout (e.g., tacos)
    const { cartItems } = body;
    
    const line_items = cartItems.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/order`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
