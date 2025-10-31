import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST() {
  try {
    const secret = process.env.STRIPE_SECRET_KEY
    const priceId = process.env.STRIPE_EMILY_PRICE_ID
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL

    if (!secret) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })
    }
    if (!priceId) {
      return NextResponse.json({ error: 'Missing STRIPE_EMILY_PRICE_ID (set this in your env)' }, { status: 500 })
    }
    if (!appUrl) {
      return NextResponse.json({ error: 'Missing NEXT_PUBLIC_APP_URL or NEXT_PUBLIC_SITE_URL' }, { status: 500 })
    }

  const stripe = new Stripe(secret, { apiVersion: '2025-08-27.basil' as any })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        { price: priceId, quantity: 1 },
      ],
      allow_promotion_codes: true,
      success_url: `${appUrl}/emily/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/emily?canceled=1`,
      metadata: { purpose: 'emily_access' },
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (err: any) {
    console.error('[EMILY-CHECKOUT] Error creating session', err)
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
