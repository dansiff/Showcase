import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  console.log('[PLATFORM-AUTH-CONFIRM] Confirmation request received:', {
    hasTokenHash: !!token_hash,
    type,
  })

  if (token_hash && type) {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error) {
      console.log('[PLATFORM-AUTH-CONFIRM] Email verified successfully ✨')
      // Redirect to platform portal
      return NextResponse.redirect(new URL('/portal', request.url))
    }

    console.error('[PLATFORM-AUTH-CONFIRM] Verification error:', error)
    return NextResponse.redirect(
      new URL('/platform/signin?error=verification_failed', request.url)
    )
  }

  console.warn('[PLATFORM-AUTH-CONFIRM] Missing token_hash or type parameter')
  return NextResponse.redirect(
    new URL('/platform/signin?error=invalid_link', request.url)
  )
}
