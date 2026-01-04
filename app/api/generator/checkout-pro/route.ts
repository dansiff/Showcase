import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { handleGeneratorProCheckout } from '@/lib/webhooks/generator'

/**
 * POST /api/generator/checkout-pro
 * Initiates Pro plan checkout for authenticated users
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in' },
        { status: 401 }
      )
    }

    // 2. Initiate checkout
    const result = await handleGeneratorProCheckout(
      user.email,
      user.id,
      user.email
    )

    if (!result.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      sessionId: result.sessionId,
    })
  } catch (error) {
    console.error('[API] Checkout error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Checkout failed',
      },
      { status: 500 }
    )
  }
}
