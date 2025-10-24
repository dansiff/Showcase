import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Resolve Prisma user by email and use internal id
  let dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser) {
    dbUser = await prisma.user.create({ data: { email: user.email!, name: user.user_metadata?.name ?? null } as any })
  }

  const creator = (await prisma.creator.findUnique({ where: { userId: dbUser.id } })) as any
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

    // Resolve Prisma user by email
    let dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
    if (!dbUser) {
      dbUser = await prisma.user.create({ data: { email: user.email!, name: user.user_metadata?.name ?? null } as any })
    }

    const creator = (await prisma.creator.update({
      where: { userId: dbUser.id },
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
