import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, PageFooter } from '@/components/PageHeaderFooter'
import { CheckCircle2, Sparkles, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Upgrade Successful - Fusion Space',
  description: 'Your Pro plan is active. Start building advanced websites.',
}

export default function SuccessPage() {
  return (
    <>
      <PageHeader />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
              <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-6">
                <CheckCircle2 className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Pro!
          </h1>

          {/* Message */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Your subscription is active and your 14-day free trial has started. You now have access to all Pro features.
          </p>

          {/* Features List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-8 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              What's Included in Pro:
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <span className="text-gray-700 dark:text-gray-300">Unlimited websites</span>
              </div>
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <span className="text-gray-700 dark:text-gray-300">Unlimited pages per site</span>
              </div>
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <span className="text-gray-700 dark:text-gray-300">Custom domain included</span>
              </div>
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <span className="text-gray-700 dark:text-gray-300">Advanced SEO tools</span>
              </div>
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <span className="text-gray-700 dark:text-gray-300">E-commerce features</span>
              </div>
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <span className="text-gray-700 dark:text-gray-300">Booking system</span>
              </div>
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <span className="text-gray-700 dark:text-gray-300">Analytics integration</span>
              </div>
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <span className="text-gray-700 dark:text-gray-300">Priority support</span>
              </div>
            </div>
          </div>

          {/* Trial Info */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              14-Day Free Trial Active
            </h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Start building immediately. Your trial gives you full access to all Pro features at no charge. After 14 days, billing will begin at $29.99/month.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/generator">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 w-full">
                <Rocket className="mr-2 h-5 w-5" />
                Start Building
              </Button>
            </Link>
            <Link href="/generator/pricing">
              <Button variant="outline" size="lg">
                Back to Generator
              </Button>
            </Link>
          </div>

          {/* Support */}
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Questions? Visit our{' '}
            <Link href="/contact" className="text-purple-600 dark:text-purple-400 hover:underline">
              help center
            </Link>{' '}
            or contact our{' '}
            <Link href="mailto:support@fusionspace.io" className="text-purple-600 dark:text-purple-400 hover:underline">
              support team
            </Link>
            .
          </p>
        </div>
      </main>
      <PageFooter />
    </>
  )
}
