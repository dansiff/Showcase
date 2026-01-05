import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export interface UserPlan {
  planType: 'STANDARD' | 'PRO'
  plan: {
    id: string
    name: string
    maxSites: number
    maxPages: number
    customDomain: boolean
    advancedSEO: boolean
    analyticsIntegration: boolean
    ecommerceFeatures: boolean
    bookingFeatures: boolean
    customCodes: boolean
    apiAccess: boolean
    prioritySupport: boolean
    formSubmissions: number
    storageGb: number
    bandwidthGb: number
  }
  subscription: {
    id: string
    status: string
    currentPeriodStart: string | null
    currentPeriodEnd: string | null
    cancelAtPeriodEnd: boolean
  } | null
}

interface UseGeneratorPlanReturn {
  plan: UserPlan | null
  loading: boolean
  error: string | null
  isPro: boolean
  isStandard: boolean
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and track the current user's generator plan
 * 
 * Usage:
 * const { plan, loading, isPro } = useGeneratorPlan()
 * 
 * if (loading) return <LoadingSpinner />
 * if (!isPro) return <UpgradePrompt />
 * return <ProFeature />
 */
export function useGeneratorPlan(): UseGeneratorPlanReturn {
  const [plan, setPlan] = useState<UserPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlan = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if user is authenticated
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setPlan(null)
        setLoading(false)
        return
      }

      // Fetch user's plan
      const response = await fetch('/api/generator/user-plan')

      if (!response.ok) {
        throw new Error(`Failed to fetch plan: ${response.statusText}`)
      }

      const data = await response.json()
      setPlan(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load plan'
      setError(message)
      console.error('useGeneratorPlan error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlan()
  }, [])

  return {
    plan,
    loading,
    error,
    isPro: plan?.planType === 'PRO',
    isStandard: plan?.planType === 'STANDARD',
    refetch: fetchPlan,
  }
}
