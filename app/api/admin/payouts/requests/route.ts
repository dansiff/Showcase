import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || undefined

    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
    if (!dbUser || dbUser.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const where: { status?: string } = {}
    if (status) where.status = status

  const rows = await prisma.payoutRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, displayName: true, userId: true } },
      },
    })

    return NextResponse.json({ requests: rows })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Admin payouts list error', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
