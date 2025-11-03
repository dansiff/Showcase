import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: Request) {
  try {
    // Verify admin cookie
    const cookieStore = await cookies()
    const adminCookie = cookieStore.get('emily_admin')?.value
    const expectedKey = process.env.EMILY_ADMIN_KEY

    const isAuthenticated = adminCookie === expectedKey

    if (!isAuthenticated && !expectedKey) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 })
    }

    // Delete admin
    await (prisma as any).admin.delete({
      where: { id },
    })

    console.log('[EMILY-ADMIN-DELETE] Deleted admin:', id)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[EMILY-ADMIN-DELETE]', err)
    return NextResponse.json({ error: err?.message || 'Failed to delete admin' }, { status: 500 })
  }
}
