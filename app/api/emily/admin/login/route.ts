import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const expectedKey = process.env.EMILY_ADMIN_KEY
    const body = await req.json().catch(() => ({}))
    const { key, email, password } = body

    let isValid = false
    let authMethod = ''

    // Method 1: Legacy key-based auth (backward compatible)
    if (key && expectedKey && key === expectedKey) {
      isValid = true
      authMethod = 'legacy_key'
      console.log('[EMILY-ADMIN-LOGIN] Authenticated via legacy key')
    }
    
    // Method 2: Email + password auth (new multi-admin system)
    else if (email && password) {
      const admin = await (prisma as any).admin.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (admin && await bcrypt.compare(password, admin.password)) {
        isValid = true
        authMethod = 'email_password'
        console.log('[EMILY-ADMIN-LOGIN] Authenticated via email/password:', email)
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Set the same emily_admin cookie for both methods
    const res = NextResponse.json({ ok: true, method: authMethod })
    res.cookies.set('emily_admin', expectedKey || 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
