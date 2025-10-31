import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

function addDays(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const sessionId = url.searchParams.get('session_id')

    const secret = process.env.STRIPE_SECRET_KEY
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || ''

    if (!secret) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })
    }
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const stripe = new Stripe(secret as string, { apiVersion: '2025-08-27.basil' as any })

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Validate payment completion
    const paid = session.payment_status === 'paid' || session.status === 'complete'
    if (!paid) {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
    }

    const email = session.customer_details?.email || session.customer_email
    if (!email) {
      return NextResponse.json({ error: 'No customer email on session' }, { status: 400 })
    }

    // Issue access token (30 days)
    const token = crypto.randomUUID().replace(/-/g, '')
    const expiresAt = addDays(30)

    // Cast prisma to any to avoid type errors until prisma generate runs
    await (prisma as any).accessToken.create({
      data: {
        email,
        token,
        purpose: 'emily',
        expiresAt,
      },
    })

    const res = NextResponse.json({ ok: true, redirectUrl: `${appUrl}/emily/access` })
    res.cookies.set('emily_access', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/emily',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return res
  } catch (err: any) {
    console.error('[EMILY-CONFIRM] Error confirming session', err)
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
