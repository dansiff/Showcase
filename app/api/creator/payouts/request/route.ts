import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const { amountCents, method, cadence, notes } = body || {}

    const validMethod  = ['STRIPE_CONNECT', 'BANK_WIRE', 'PAYPAL']
    const validCadence = ['WEEKLY', 'BIWEEKLY', 'MONTHLY']

    if (method && !validMethod.includes(method)) {
      return NextResponse.json({ error: 'Invalid method' }, { status: 400 })
    }
    if (cadence && !validCadence.includes(cadence)) {
      return NextResponse.json({ error: 'Invalid cadence' }, { status: 400 })
    }
    if (amountCents && (typeof amountCents !== 'number' || amountCents < 0)) {
      return NextResponse.json({ error: 'amountCents must be a non-negative number' }, { status: 400 })
    }

    // Resolve Prisma user by email, then fetch creator by internal id
    let dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
    if (!dbUser) {
      dbUser = await prisma.user.create({ data: { email: user.email!, name: user.user_metadata?.name ?? null } as any })
    }

    const creator = (await prisma.creator.findUnique({ where: { userId: dbUser.id } })) as any
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 })

    const reqRow = await (prisma as any).payoutRequest.create({
      data: {
        creatorId: creator.id,
        amountCents: amountCents ?? null,
        method: method || creator.payoutMethod,
        cadence: cadence || creator.payoutCadence,
        status: 'requested',
        notes: notes || null,
      } as any,
    })

    return NextResponse.json({ ok: true, requestId: reqRow.id })
  } catch (err: any) {
    console.error('POST payouts/request error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
