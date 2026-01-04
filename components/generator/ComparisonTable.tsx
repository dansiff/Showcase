"use client"

import { CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Feature {
  name: string
  standard: boolean | string
  pro: boolean | string
}

const COMPARISON_FEATURES: Feature[] = [
  { name: 'Number of Websites', standard: '3', pro: 'Unlimited' },
  { name: 'Pages Per Site', standard: '10', pro: 'Unlimited' },
  { name: 'Storage', standard: '5 GB', pro: '100 GB' },
  { name: 'Monthly Bandwidth', standard: '10 GB', pro: '500 GB' },
  { name: 'Basic Templates', standard: true, pro: true },
  { name: 'Advanced Templates', standard: false, pro: true },
  { name: 'Custom Domain', standard: false, pro: true },
  { name: 'Mobile Responsive', standard: true, pro: true },
  { name: 'SSL Certificate', standard: true, pro: true },
  { name: 'Basic Forms', standard: true, pro: true },
  { name: 'Form Submissions', standard: '100/mo', pro: 'Unlimited' },
  { name: 'Custom Code (JS/CSS)', standard: false, pro: true },
  { name: 'SEO Tools', standard: 'Basic', pro: 'Advanced' },
  { name: 'Google Analytics', standard: false, pro: true },
  { name: 'E-commerce Features', standard: false, pro: true },
  { name: 'Booking System', standard: false, pro: true },
  { name: 'Blog Platform', standard: true, pro: true },
  { name: 'Email Support', standard: true, pro: true },
  { name: 'Priority Support', standard: false, pro: true },
  { name: 'Subdomain Hosting', standard: true, pro: true },
  { name: 'API Access', standard: false, pro: true },
  { name: 'Monthly Price', standard: 'Free', pro: '$29.99' },
]

export default function ComparisonTable() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Detailed Feature Comparison
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            See exactly what you get with each plan
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Feature
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                  Standard
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {COMPARISON_FEATURES.map((feature, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    'transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50',
                    idx % 2 === 0 ? 'bg-white dark:bg-slate-900/50' : 'bg-gray-50 dark:bg-slate-800/30'
                  )}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {feature.name}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    {typeof feature.standard === 'boolean' ? (
                      feature.standard ? (
                        <CheckCircle2 className="mx-auto h-5 w-5 text-green-500" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-gray-300 dark:text-gray-600" />
                      )
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">{feature.standard}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    {typeof feature.pro === 'boolean' ? (
                      feature.pro ? (
                        <CheckCircle2 className="mx-auto h-5 w-5 text-green-500" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-gray-300 dark:text-gray-600" />
                      )
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">{feature.pro}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
