import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/portal'

  console.log('[AUTH-CONFIRM] Confirmation request received:', {
    hasTokenHash: !!token_hash,
    type,
    next,
  })

  if (token_hash && type) {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error) {
      // Email confirmed successfully
      console.log('[AUTH-CONFIRM] Email verified successfully ✅')
      return NextResponse.redirect(new URL(next, request.url))
    }

    console.error('[AUTH-CONFIRM] Verification error:', error)
    return NextResponse.redirect(
      new URL('/signin?error=verification_failed', request.url)
    )
  }

  // Missing parameters
  console.warn('[AUTH-CONFIRM] Missing token_hash or type parameter')
  return NextResponse.redirect(
    new URL('/signin?error=invalid_confirmation_link', request.url)
  )
}
