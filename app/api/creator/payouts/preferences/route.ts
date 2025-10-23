import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const creator = (await prisma.creator.findUnique({ where: { userId: user.id } })) as any
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 })

    return NextResponse.json({
      payoutCadence: creator.payoutCadence,
      payoutMethod: creator.payoutMethod,
      promoEndsAt: creator.promoEndsAt,
    })
  } catch (err: any) {
    console.error('GET payouts/preferences error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const { payoutCadence, payoutMethod } = body || {}

    const validCadence = ['WEEKLY', 'BIWEEKLY', 'MONTHLY']
    const validMethod  = ['STRIPE_CONNECT', 'BANK_WIRE', 'PAYPAL']
    if (payoutCadence && !validCadence.includes(payoutCadence)) {
      return NextResponse.json({ error: 'Invalid payoutCadence' }, { status: 400 })
    }
    if (payoutMethod && !validMethod.includes(payoutMethod)) {
      return NextResponse.json({ error: 'Invalid payoutMethod' }, { status: 400 })
    }

    const creator = (await prisma.creator.update({
      where: { userId: user.id },
      data: {
        ...(payoutCadence ? { payoutCadence } : {}),
        ...(payoutMethod ? { payoutMethod } : {}),
      } as any,
    })) as any

    return NextResponse.json({ ok: true, payoutCadence: creator.payoutCadence, payoutMethod: creator.payoutMethod })
  } catch (err: any) {
    console.error('POST payouts/preferences error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
