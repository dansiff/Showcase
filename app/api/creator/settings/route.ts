import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { DEFAULT_REVENUE_SHARE_PERCENT, MIN_REVENUE_SHARE_PERCENT, MAX_REVENUE_SHARE_PERCENT, normalizePercent } from '@/lib/revenue'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [creator, dbUser] = await Promise.all([
    prisma.creator.findUnique({ where: { userId: user.id } }) as any,
    prisma.user.findUnique({ where: { id: user.id }, select: { role: true } })
  ])

  if (!creator) return NextResponse.json({
    ageRestricted: false,
    revenueSharePercent: DEFAULT_REVENUE_SHARE_PERCENT,
    isAdmin: dbUser?.role === 'ADMIN'
  })

  return NextResponse.json({
    ageRestricted: creator.ageRestricted === true,
    revenueSharePercent: normalizePercent(creator.revenueSharePercent ?? DEFAULT_REVENUE_SHARE_PERCENT),
    isAdmin: dbUser?.role === 'ADMIN'
  })
  } catch (err: any) {
    console.error('GET creator settings error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const { ageRestricted, revenueSharePercent } = body ?? {}

    // Validate optional fields
    if (typeof ageRestricted !== 'undefined' && typeof ageRestricted !== 'boolean') {
      return NextResponse.json({ error: 'ageRestricted must be boolean' }, { status: 400 })
    }

    // Only admins can set revenueSharePercent overrides
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } })
    const isAdmin = dbUser?.role === 'ADMIN'
    if (typeof revenueSharePercent !== 'undefined') {
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden: admin only' }, { status: 403 })
      }
      if (typeof revenueSharePercent !== 'number' || Number.isNaN(revenueSharePercent)) {
        return NextResponse.json({ error: 'revenueSharePercent must be a number' }, { status: 400 })
      }
      if (revenueSharePercent < MIN_REVENUE_SHARE_PERCENT || revenueSharePercent > MAX_REVENUE_SHARE_PERCENT) {
        return NextResponse.json({ error: `revenueSharePercent must be between ${MIN_REVENUE_SHARE_PERCENT}-${MAX_REVENUE_SHARE_PERCENT}` }, { status: 400 })
      }
    }

    // Ensure creator record exists
    let creator: any = await prisma.creator.findUnique({ where: { userId: user.id } })
    if (!creator) {
      creator = (await prisma.creator.create({
        data: {
          userId: user.id,
          displayName: user.user_metadata?.name || user.email?.split('@')[0] || 'Creator',
          ...(typeof ageRestricted === 'boolean' ? { ageRestricted } : {}),
          ...(typeof revenueSharePercent === 'number' && isAdmin ? { revenueSharePercent: Math.round(revenueSharePercent) } : {}),
          promoEndsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        } as any,
      })) as any
    } else {
      creator = (await prisma.creator.update({
        where: { userId: user.id },
        data: {
          ...(typeof ageRestricted === 'boolean' ? { ageRestricted } : {}),
          ...(typeof revenueSharePercent === 'number' && isAdmin ? { revenueSharePercent: Math.round(revenueSharePercent) } : {}),
        } as any,
      })) as any
    }
    return NextResponse.json({
      ok: true,
      ageRestricted: creator.ageRestricted === true,
      revenueSharePercent: normalizePercent(creator.revenueSharePercent ?? DEFAULT_REVENUE_SHARE_PERCENT)
    })
  } catch (err: any) {
    console.error('POST creator settings error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
