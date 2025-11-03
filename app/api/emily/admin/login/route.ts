import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const expectedKey = process.env.EMILY_ADMIN_KEY
    if (!expectedKey) {
      return NextResponse.json({ error: 'EMILY_ADMIN_KEY not configured' }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const providedKey = body?.key

    if (providedKey !== expectedKey) {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set('emily_admin', expectedKey, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/emily',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch (err: any) {
    console.error('[EMILY-ADMIN-LOGIN]', err)
    return NextResponse.json({ error: err?.message || 'Login error' }, { status: 500 })
  }
}
