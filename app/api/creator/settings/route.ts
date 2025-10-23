import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const creator = (await prisma.creator.findUnique({ where: { userId: user.id } })) as any
  if (!creator) return NextResponse.json({ ageRestricted: false })

  return NextResponse.json({ ageRestricted: creator.ageRestricted === true })
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
    const { ageRestricted } = body ?? {}

    if (typeof ageRestricted !== 'boolean') {
      return NextResponse.json({ error: 'ageRestricted boolean required' }, { status: 400 })
    }

    // Ensure creator record exists
    let creator: any = await prisma.creator.findUnique({ where: { userId: user.id } })
    if (!creator) {
      creator = (await prisma.creator.create({
        data: {
          userId: user.id,
          displayName: user.user_metadata?.name || user.email?.split('@')[0] || 'Creator',
          ageRestricted,
        } as any,
      })) as any
    } else {
      creator = (await prisma.creator.update({
        where: { userId: user.id },
        data: { ageRestricted } as any,
      })) as any
    }

    return NextResponse.json({ ok: true, ageRestricted: creator.ageRestricted === true })
  } catch (err: any) {
    console.error('POST creator settings error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
