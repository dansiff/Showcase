"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { PageHeader, PageFooter } from '@/components/PageHeaderFooter'
import { Loader2 } from 'lucide-react'

export default function ProCheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initiateCheckout = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          // Redirect to sign in
          router.push('/signin?returnTo=/generator/pro-checkout')
          return
        }

        // Call checkout API
        const response = await fetch('/api/generator/checkout-pro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to initialize checkout')
        }

        const { url } = await response.json()

        // Redirect to Stripe Checkout
        if (url) {
          window.location.href = url
        } else {
          throw new Error('No checkout URL returned')
        }
      } catch (err) {
        console.error('Checkout error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }

    initiateCheckout()
  }, [router])

  return (
    <>
      <PageHeader title="Pro Checkout" subtitle="Finalizing your secure payment" />
      <main className="min-h-screen flex items-center justify-center">
        {loading && (
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Preparing checkout...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You'll be redirected to our secure payment page.
            </p>
          </div>
        )}
        {error && (
          <div className="text-center bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
              Checkout Error
            </h2>
            <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
            <button
              onClick={() => router.push('/generator/pricing')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Back to Pricing
            </button>
          </div>
        )}
      </main>
      <PageFooter />
    </>
  )
}
