import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
    if (!dbUser || dbUser.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = (await req.json().catch(() => ({}))) as { status?: string; notes?: string }
    const { status, notes } = body || {}
    const validStatus = ['requested', 'approved', 'paid', 'rejected']
    if (status && !validStatus.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updated = await prisma.payoutRequest.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(typeof notes === 'string' ? { notes } : {}),
      },
    })

    return NextResponse.json({ ok: true, request: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Admin payout update error', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
