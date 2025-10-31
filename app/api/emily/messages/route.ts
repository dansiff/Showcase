import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getTokenFromCookie(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/(?:^|; )emily_access=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function GET(req: Request) {
  try {
    const token = getTokenFromCookie(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const messages = await (prisma as any).emilyMessage.findMany({
      where: { token },
      orderBy: { createdAt: 'asc' },
      take: 200,
    })
    return NextResponse.json({ messages })
  } catch (err: any) {
    console.error('[EMILY-MESSAGES][GET]', err)
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = getTokenFromCookie(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const type = body?.type === 'image' || body?.type === 'audio' ? body.type : 'text'
    const content = typeof body?.content === 'string' ? body.content.slice(0, 2000) : null
    const url = typeof body?.url === 'string' ? body.url.slice(0, 2048) : null

    const msg = await (prisma as any).emilyMessage.create({
      data: {
        token,
        sender: 'buyer',
        type,
        content,
        url,
      },
    })
    return NextResponse.json({ message: msg }, { status: 201 })
  } catch (err: any) {
    console.error('[EMILY-MESSAGES][POST]', err)
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
