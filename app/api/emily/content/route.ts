import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

function isAdmin(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const key = process.env.EMILY_ADMIN_KEY
  if (!key) return false
  const v = cookieStore.get('emily_admin')?.value
  return v === key
}

export async function GET() {
  try {
    const rows = await (prisma as any).emilyContent.findMany({ orderBy: { createdAt: 'asc' } })
    const bySection: Record<string, any> = {}
    for (const r of rows) bySection[r.section] = r
    return NextResponse.json({ content: bySection })
  } catch (err: any) {
    console.error('[EMILY-CONTENT][GET]', err)
    return NextResponse.json({ error: err?.message || 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const adminCookie = cookieStore.get('emily_admin')?.value
    const expectedKey = process.env.EMILY_ADMIN_KEY
    
    console.log('[EMILY-CONTENT][POST] Auth check:', {
      hasCookie: !!adminCookie,
      hasKey: !!expectedKey,
      cookiePrefix: adminCookie?.substring(0, 10),
      keyPrefix: expectedKey?.substring(0, 10),
      match: adminCookie === expectedKey
    })
    
    if (!isAdmin(cookieStore)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    const section = typeof body?.section === 'string' ? body.section : 'note'
    const title = typeof body?.title === 'string' ? body.title : null
    const b = typeof body?.body === 'string' ? body.body : null
    const mediaUrls = Array.isArray(body?.mediaUrls) ? body.mediaUrls.filter((u: any) => typeof u === 'string') : []

    const saved = await (prisma as any).emilyContent.upsert({
      where: { section },
      update: { title, body: b, mediaUrls },
      create: { section, title, body: b, mediaUrls },
    })
    return NextResponse.json({ content: saved })
  } catch (err: any) {
    console.error('[EMILY-CONTENT][POST]', err)
    return NextResponse.json({ error: err?.message || 'Failed to save' }, { status: 500 })
  }
}
