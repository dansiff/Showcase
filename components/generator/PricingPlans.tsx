"use client"

import { CheckCircle2, Zap, Star, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { trackUpgradeClick } from '@/lib/analytics'

interface PricingPlan {
  id: string
  name: string
  type: 'STANDARD' | 'PRO'
  price: number | null
  description: string
  period: string
  badge?: string
  features: {
    name: string
    included: boolean
  }[]
  cta: {
    text: string
    href: string
    isPrimary?: boolean
  }
  highlight?: boolean
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'standard',
    name: 'Standard',
    type: 'STANDARD',
    price: null,
    description: 'Perfect for getting started with your online presence',
    period: 'Forever Free',
    features: [
      { name: 'Up to 3 websites', included: true },
      { name: 'Up to 10 pages per site', included: true },
      { name: 'Basic templates', included: true },
      { name: 'Mobile responsive', included: true },
      { name: 'Basic contact forms', included: true },
      { name: 'Email support', included: true },
      { name: 'Subdomain hosting', included: true },
      { name: 'SSL certificate', included: true },
      { name: 'Custom domain', included: false },
      { name: 'Advanced SEO tools', included: false },
      { name: 'Analytics integration', included: false },
      { name: 'E-commerce features', included: false },
    ],
    cta: {
      text: 'Start Free',
      href: '/generator',
      isPrimary: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    type: 'PRO',
    price: 2999, // $29.99/month
    description: 'For growing businesses that need advanced features',
    period: 'per month',
    badge: 'POPULAR',
    highlight: true,
    features: [
      { name: 'Unlimited websites', included: true },
      { name: 'Unlimited pages per site', included: true },
      { name: 'Advanced templates', included: true },
      { name: 'Mobile responsive', included: true },
      { name: 'Advanced forms & submissions', included: true },
      { name: 'Priority email & chat support', included: true },
      { name: 'Custom domain included', included: true },
      { name: 'Advanced SEO tools', included: true },
      { name: 'Google Analytics integration', included: true },
      { name: 'E-commerce features', included: true },
      { name: 'Booking system', included: true },
      { name: 'Custom code injection (JS/CSS)', included: true },
    ],
    cta: {
      text: 'Start Free Trial',
      href: '/generator/pro-checkout',
      isPrimary: true,
    },
  },
]

interface PricingPlansProps {
  isAuthenticated?: boolean
}

export default function PricingPlans({ isAuthenticated = false }: PricingPlansProps) {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Choose the plan that fits your needs. No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-6 xl:gap-8">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative rounded-2xl border transition-all duration-300 hover:shadow-lg',
                plan.highlight
                  ? 'border-purple-500/50 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900 ring-2 ring-purple-500/30 shadow-xl'
                  : 'border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800'
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-6">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 text-sm font-semibold text-white">
                    <Star className="h-3 w-3 fill-current" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Name & Description */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 flex items-baseline gap-1">
                  {plan.price ? (
                    <>
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        ${(plan.price / 100).toFixed(2)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                <Link href={plan.cta.href} className="w-full">
                  <Button
                    onClick={() => trackUpgradeClick(plan.name)}
                    className={cn(
                      'w-full gap-2 py-6 text-base font-semibold transition-all',
                      plan.cta.isPrimary
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-lg'
                        : 'border-2 border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'
                    )}
                  >
                    {plan.cta.text}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                {/* Divider */}
                <div className="my-8 border-t border-gray-200 dark:border-slate-700" />

                {/* Features List */}
                <div className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                      ) : (
                        <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-300 dark:text-gray-600" />
                      )}
                      <span
                        className={cn(
                          'text-sm',
                          feature.included
                            ? 'font-medium text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 line-through'
                        )}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 rounded-xl bg-blue-50 dark:bg-blue-950/20 p-8 border border-blue-200 dark:border-blue-900/50">
          <div className="mx-auto max-w-3xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I upgrade or downgrade my plan anytime?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! You can upgrade to Pro at any time, and your next billing cycle will reflect the new price.
                  If you downgrade, you'll keep access to pro features until the end of your current billing period.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Is there a free trial for Pro?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! Get 14 days free to test all Pro features. No credit card required to start the trial.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What happens if I exceed my plan limits?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  We'll notify you when you're approaching your limits. You can upgrade anytime, or
                  we can help you optimize your sites to stay within limits.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Do you offer refunds?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Need a custom plan? We offer enterprise solutions for agencies and large organizations.
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
