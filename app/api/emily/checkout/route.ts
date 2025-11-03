import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST() {
  try {
    const secret = process.env.STRIPE_SECRET_KEY
    const priceId = process.env.STRIPE_EMILY_PRICE_ID
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL

    // Debug logging (remove after testing)
    console.log('[EMILY-CHECKOUT] Env check:', {
      hasSecret: !!secret,
      secretPrefix: secret?.slice(0, 7),
      priceId,
      appUrl,
    })

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
    // Ensure the price exists. If it doesn't, create a product+price automatically
    let usedPriceId = priceId
    try {
      // Try retrieving the configured price to validate it
      await stripe.prices.retrieve(usedPriceId as string)
    } catch (e: any) {
      // If the price is missing in this Stripe account, create one server-side
      if (e?.type === 'StripeInvalidRequestError' && e?.code === 'resource_missing') {
        const amount = parseInt(process.env.STRIPE_EMILY_PRICE_AMOUNT_CENTS || '2999', 10)
        const currency = process.env.STRIPE_EMILY_CURRENCY || 'usd'
        console.warn('[EMILY-CHECKOUT] Price not found. Creating product+price on the fly.')
        const product = await stripe.products.create({
          name: 'Emily Studio — 30-day Access',
          description: 'One-time 30 day access to Emily content',
        })
        const createdPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: amount,
          currency,
        })
        usedPriceId = createdPrice.id
        console.log('[EMILY-CHECKOUT] Created price:', { createdPrice: createdPrice.id, amount, currency })
      } else {
        throw e
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        { price: usedPriceId, quantity: 1 },
      ],
      allow_promotion_codes: true,
      success_url: `${appUrl}/emily/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/emily?canceled=1`,
      metadata: { purpose: 'emily_access' },
    })

    return NextResponse.json({ url: session.url, price: usedPriceId }, { status: 200 })
  } catch (err: any) {
    console.error('[EMILY-CHECKOUT] Error creating session', err)
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
