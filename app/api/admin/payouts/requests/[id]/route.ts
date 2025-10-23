import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function PATCH(req: Request, context: any) {
  try {
    const params = (context && context.params) || ({} as any)
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser || dbUser.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json().catch(() => ({}))
    const { status, notes } = body || {}
    const validStatus = ['requested', 'approved', 'paid', 'rejected']
    if (status && !validStatus.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updated = await (prisma as any).payoutRequest.update({
      where: { id: params.id },
      data: {
        ...(status ? { status } : {}),
        ...(typeof notes === 'string' ? { notes } : {}),
      },
    })

    return NextResponse.json({ ok: true, request: updated })
  } catch (err: any) {
    console.error('Admin payout update error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
