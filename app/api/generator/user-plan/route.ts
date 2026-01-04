import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/generator/user-plan
 * Returns the current user's generator plan information
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find or create user in Prisma
    let prismaUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (!prismaUser) {
      prismaUser = await prisma.user.create({
        data: { email: user.email },
      })
    }

    // Get user's active subscription
    let subscription = await prisma.generatorSubscription.findFirst({
      where: {
        userId: prismaUser.id,
        status: 'active',
      },
      include: {
        plan: true,
      },
    })

    // Default to Standard plan if no subscription
    if (!subscription) {
      const standardPlan = await prisma.generatorPlan.findUnique({
        where: { planType: 'STANDARD' },
      })

      if (!standardPlan) {
        return NextResponse.json(
          { error: 'Standard plan not found. Please run seeding.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        planType: standardPlan.planType,
        plan: {
          id: standardPlan.id,
          name: standardPlan.name,
          maxSites: standardPlan.maxSites,
          maxPages: standardPlan.maxPages,
          customDomain: standardPlan.customDomain,
          advancedSEO: standardPlan.advancedSEO,
          analyticsIntegration: standardPlan.analyticsIntegration,
          ecommerceFeatures: standardPlan.ecommerceFeatures,
          bookingFeatures: standardPlan.bookingFeatures,
          customCodes: standardPlan.customCodes,
          apiAccess: standardPlan.apiAccess,
          prioritySupport: standardPlan.prioritySupport,
          formSubmissions: standardPlan.formSubmissions,
          storageGb: standardPlan.storageGb,
          bandwidthGb: standardPlan.bandwidthGb,
        },
        subscription: null,
      })
    }

    return NextResponse.json({
      planType: subscription.plan.planType,
      plan: {
        id: subscription.plan.id,
        name: subscription.plan.name,
        maxSites: subscription.plan.maxSites,
        maxPages: subscription.plan.maxPages,
        customDomain: subscription.plan.customDomain,
        advancedSEO: subscription.plan.advancedSEO,
        analyticsIntegration: subscription.plan.analyticsIntegration,
        ecommerceFeatures: subscription.plan.ecommerceFeatures,
        bookingFeatures: subscription.plan.bookingFeatures,
        customCodes: subscription.plan.customCodes,
        apiAccess: subscription.plan.apiAccess,
        prioritySupport: subscription.plan.prioritySupport,
        formSubmissions: subscription.plan.formSubmissions,
        storageGb: subscription.plan.storageGb,
        bandwidthGb: subscription.plan.bandwidthGb,
      },
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      },
    })
  } catch (error) {
    console.error('[API] Error fetching user plan:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch plan',
      },
      { status: 500 }
    )
  }
}
