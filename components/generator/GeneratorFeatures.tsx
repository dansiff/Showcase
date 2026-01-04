"use client"

import { Sparkles, Zap, Shield, Palette, Code, BarChart3, Download, Rocket, Smartphone } from 'lucide-react'

const FEATURES = [
  {
    icon: Palette,
    title: 'Drag & Drop Design',
    description: 'Intuitive editor that requires no design experience. Customize colors, fonts, and layouts with ease.',
  },
  {
    icon: Sparkles,
    title: 'AI Content Generation',
    description: 'Generate professional copy, descriptions, and meta text powered by AI. Save hours on content creation.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for performance. Your sites load instantly on all devices and networks.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Automatically responsive designs that look perfect on phones, tablets, and desktops.',
  },
  {
    icon: Code,
    title: 'SEO Optimized',
    description: 'Built-in SEO tools, meta tags, sitemaps, and best practices to rank higher.',
  },
  {
    icon: Rocket,
    title: 'One-Click Deploy',
    description: 'Deploy to the web instantly. Custom domain support with free SSL certificates.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Ready',
    description: 'Integrated Google Analytics and tracking. Monitor your website performance in real-time.',
  },
  {
    icon: Download,
    title: 'Export & Download',
    description: 'Download your site source code or export to popular hosting platforms anytime.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security, automatic backups, and 99.9% uptime guarantee.',
  },
]

export default function GeneratorFeatures() {
  return (
    <section className="relative py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Powerful features designed for modern businesses, startups, and creators.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 transition-all duration-300 hover:border-purple-500 hover:shadow-lg dark:hover:border-purple-400"
              >
                {/* Icon */}
                <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 p-3 group-hover:from-purple-200 group-hover:to-pink-200 dark:group-hover:from-purple-900/50 dark:group-hover:to-pink-900/50 transition-all">
                  <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
