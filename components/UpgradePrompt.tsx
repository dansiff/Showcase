"use client"

import { Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface UpgradePromptProps {
  feature: string
  description?: string
}

export default function UpgradePrompt({
  feature,
  description = 'This feature is available on our Pro plan',
}: UpgradePromptProps) {
  return (
    <div className="rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-50" />
          <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3">
            <Star className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Unlock {feature}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {description}
      </p>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-slate-700">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          <strong>Pro Plan includes:</strong>
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 text-left">
          <li>✓ Unlimited websites</li>
          <li>✓ {feature}</li>
          <li>✓ Advanced SEO tools</li>
          <li>✓ E-commerce features</li>
          <li>✓ Priority support</li>
          <li>✓ And much more...</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/generator/pricing">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 w-full">
            Upgrade to Pro
          </Button>
        </Link>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Try Pro free for 14 days. No credit card required.
      </p>
    </div>
  )
}
