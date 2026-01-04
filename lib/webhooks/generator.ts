import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { 
  sendWelcomeEmail, 
  sendTrialStartedEmail,
  sendSubscriptionActiveEmail,
  sendSubscriptionCancelledEmail
} from '@/lib/email/service'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
})

/**
 * Handle website generator Pro plan subscription
 * Creates Stripe customer and subscription, then updates database
 */
export async function handleGeneratorProCheckout(
  userEmail: string,
  userId: string,
  billingEmail?: string
) {
  try {
    // 1. Get or create Stripe customer
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    })

    let customerId: string
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userId, // Store our userId for reference
      })
      customerId = customer.id
    }

    // 2. Get the Pro plan price (assuming it's already created in Stripe)
    // You should store this in an env var or database
    const STRIPE_GENERATOR_PRO_PRICE_ID = process.env.STRIPE_GENERATOR_PRO_PRICE_ID
    if (!STRIPE_GENERATOR_PRO_PRICE_ID) {
      throw new Error('Missing STRIPE_GENERATOR_PRO_PRICE_ID')
    }

    // 3. Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_GENERATOR_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/generator/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/generator/pricing`,
      metadata: {
        userId,
        purpose: 'generator_pro_upgrade',
      },
      billing_address_collection: 'required',
      customer_email: billingEmail || userEmail,
      // Trial period of 14 days
      subscription_data: {
        trial_period_days: 14,
      },
    })

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    }
  } catch (error) {
    console.error('[GENERATOR-CHECKOUT] Error:', error)
    throw error
  }
}

/**
 * Handle Stripe webhook for generator subscription events
 */
export async function handleGeneratorWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = (session.metadata as any)?.userId
      const purpose = (session.metadata as any)?.purpose

      if (purpose !== 'generator_pro_upgrade' || !userId) {
        return { handled: false }
      }

      try {
        // 1. Find or create Prisma user by email
        const customerEmail = session.customer_details?.email
        if (!customerEmail) {
          console.warn('[GENERATOR-WEBHOOK] No customer email in session')
          return { handled: false }
        }

        let user = await prisma.user.findUnique({
          where: { email: customerEmail },
        })

        if (!user) {
          user = await prisma.user.create({
            data: { email: customerEmail },
          })
        }

        // 2. Get Pro plan
        const proPlan = await prisma.generatorPlan.findUnique({
          where: { planType: 'PRO' },
        })

        if (!proPlan) {
          console.error('[GENERATOR-WEBHOOK] Pro plan not found')
          throw new Error('Pro plan not found')
        }

        // 3. Create subscription (using Stripe subscription ID)
        const existingSub = await prisma.generatorSubscription.findFirst({
          where: {
            userId: user.id,
            planId: proPlan.id,
          },
        })

        if (!existingSub) {
          await prisma.generatorSubscription.create({
            data: {
              userId: user.id,
              planId: proPlan.id,
              stripeSubId: session.subscription as string,
              stripeCustomerId: session.customer as string,
              status: 'active',
              currentPeriodStart: new Date(),
              // 14 days from now (trial period)
              currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            },
          })

          console.log('[GENERATOR-WEBHOOK] Subscription created:', {
            userId: user.id,
            planId: proPlan.id,
          })

          // Send trial started email
          await sendTrialStartedEmail({
            email: customerEmail,
            name: user.name || undefined,
            plan: 'Pro',
            trialDays: 14,
          }).catch(err => {
            console.error('[GENERATOR-WEBHOOK] Failed to send trial email:', err)
          })
        }

        return { handled: true }
      } catch (error) {
        console.error('[GENERATOR-WEBHOOK] Error processing subscription:', error)
        throw error
      }
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription

      const stripeSubId = subscription.id
      const status = subscription.status

      try {
        // Find and update the subscription
        const currentPeriodStart = subscription.current_period_start
          ? new Date(subscription.current_period_start * 1000)
          : undefined
        const currentPeriodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : undefined

        const updated = await prisma.generatorSubscription.updateMany({
          where: { stripeSubId },
          data: {
            status,
            currentPeriodStart,
            currentPeriodEnd,
          },
        })

        console.log('[GENERATOR-WEBHOOK] Subscription updated:', { stripeSubId, status })

        // If subscription just became active (trial ended, first payment), send confirmation
        if (status === 'active' && updated.count > 0) {
          const sub = await prisma.generatorSubscription.findFirst({
            where: { stripeSubId },
            include: { user: true, plan: true },
          })

          if (sub?.user?.email) {
            await sendSubscriptionActiveEmail({
              email: sub.user.email,
              name: sub.user.name || undefined,
              plan: sub.plan.name,
              nextBillingDate: sub.currentPeriodEnd || new Date(),
              amount: sub.plan.price?.toNumber() || 0,
            }).catch(err => {
              console.error('[GENERATOR-WEBHOOK] Failed to send subscription active email:', err)
            })
          }
        }

        return { handled: true }
      } catch (error) {
        console.error('[GENERATOR-WEBHOOK] Error updating subscription:', error)
        throw error
      }
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      try {
        // Find subscription before marking as canceled
        const sub = await prisma.generatorSubscription.findFirst({
          where: { stripeSubId: subscription.id },
          include: { user: true, plan: true },
        })

        // Mark subscription as canceled
        await prisma.generatorSubscription.updateMany({
          where: { stripeSubId: subscription.id },
          data: { status: 'canceled' },
        })

        console.log('[GENERATOR-WEBHOOK] Subscription canceled:', { stripeSubId: subscription.id })

        // Send cancellation email
        if (sub?.user?.email) {
          await sendSubscriptionCancelledEmail({
            email: sub.user.email,
            name: sub.user.name || undefined,
            plan: sub.plan.name,
            cancellationDate: new Date(),
          }).catch(err => {
            console.error('[GENERATOR-WEBHOOK] Failed to send cancellation email:', err)
          })
        }

        return { handled: true }
      } catch (error) {
        console.error('[GENERATOR-WEBHOOK] Error canceling subscription:', error)
        throw error
      }
    }

    default:
      return { handled: false }
  }
}
