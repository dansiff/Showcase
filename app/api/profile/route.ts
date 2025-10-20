import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, name, company } = body || {}

    if (!userId || !name || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update user's name if exists
    await prisma.user.updateMany({ where: { id: userId }, data: { name } })

    // Create profile if not exists
    const existing = await prisma.profile.findUnique({ where: { userId } })
    if (!existing) {
      await prisma.profile.create({ data: { userId, bio: `Company: ${company}` } })
    } else {
      await prisma.profile.update({ where: { userId }, data: { bio: `Company: ${company}` } })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err: any) {
    console.error('profile API error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
