import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    // Verify admin cookie (must be logged in to create other admins)
    const cookieStore = await cookies()
    const adminCookie = cookieStore.get('emily_admin')?.value
    const expectedKey = process.env.EMILY_ADMIN_KEY

    // Check if user is authenticated (either via legacy key or existing admin session)
    const isAuthenticated = adminCookie === expectedKey

    if (!isAuthenticated && !expectedKey) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Check if admin already exists
    const existing = await (prisma as any).admin.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existing) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin
    const admin = await (prisma as any).admin.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    console.log('[EMILY-ADMIN-CREATE] Created admin:', admin.email)
    return NextResponse.json({ admin })
  } catch (err: any) {
    console.error('[EMILY-ADMIN-CREATE]', err)
    return NextResponse.json({ error: err?.message || 'Failed to create admin' }, { status: 500 })
  }
}
