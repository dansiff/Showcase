import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Verify admin cookie
    const cookieStore = await cookies()
    const adminCookie = cookieStore.get('emily_admin')?.value
    const expectedKey = process.env.EMILY_ADMIN_KEY

    const isAuthenticated = adminCookie === expectedKey

    if (!isAuthenticated && !expectedKey) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get all admins (exclude password)
    const admins = await (prisma as any).admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ admins })
  } catch (err: any) {
    console.error('[EMILY-ADMIN-LIST]', err)
    return NextResponse.json({ error: err?.message || 'Failed to list admins' }, { status: 500 })
  }
}
