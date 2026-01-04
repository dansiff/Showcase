"use client"

import { Sparkles, Zap, Shield, Palette, Code, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function GeneratorHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-20 sm:py-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(0px,calc(50%-52rem))] top-[max(0px,calc(50%-28rem))] h-[104rem] w-[104rem] opacity-20"
          viewBox="0 0 1155 678"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M577.5 226c127.623-21.5 273-55.5 365.5-143.5s173.373-152.5 234-139.5c61-12 21-134-125-149-146-15-357.5 43.5-452 99.5-94.5 56-51 151.5 92.5 225.5 143.5 74 165.5 141 -35.5 225.5-201 84.5-258 158.5-285 299"
            stroke="currentColor"
            className="text-purple-500"
            strokeWidth="2"
            fill="none"
            fillOpacity="0.1"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-950/50 px-4 py-2 text-sm font-semibold text-purple-900 dark:text-purple-200">
            <Sparkles className="h-4 w-4" />
            AI-Powered Website Creator
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Build Your Website in Minutes
          </h1>

          <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">
            Create professional, responsive websites with our AI-powered generator. No coding required. Launch instantly.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generator">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
                Start Building Free
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/generator/pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Free forever plan included. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}
