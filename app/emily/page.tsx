"use client"
import { useState } from 'react'

export default function EmilyLanding() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function startCheckout() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/emily/checkout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Checkout error')
      if (data.url) window.location.href = data.url
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white">
      {/* Hero with subtle gradient backdrop */}
      <section className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-40 bg-gradient-to-r from-pink-50 via-white to-pink-50 rounded-b-3xl" />
        </div>

        <div className="relative pt-10 pb-8">
          <div className="grid gap-10 md:grid-cols-5 items-start">
            <div className="md:col-span-3">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">Emily’s exclusive studio</h1>
              <p className="mt-4 text-[15px] leading-7 text-gray-600 max-w-xl">
                Unlock premium photo sets, behind‑the‑scenes notes, and a cozy private chat.
                No account needed — purchase once and get 30 days of access instantly.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={startCheckout}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg bg-pink-600 px-5 py-3 text-white text-sm font-medium shadow-sm hover:bg-pink-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Redirecting…' : 'Get Access'}
                </button>
                <span className="text-sm text-gray-500">One‑time payment • Cancel anytime</span>
              </div>

              {error && (
                <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 inline-block">{error}</p>
              )}

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Feature title="Premium gallery" desc="Curated sets, updated regularly." />
                <Feature title="Private chat" desc="Leave notes, get replies." />
                <Feature title="Voice clips" desc="Occasional audio drops." />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="rounded-2xl border bg-white shadow-sm">
                <div className="aspect-[4/3] rounded-t-2xl bg-[linear-gradient(135deg,#fde7ef,white)] flex items-center justify-center">
                  <div className="h-20 w-20 rounded-xl bg-white/70 border border-pink-100 shadow-sm" />
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-gray-900">Studio Preview</h3>
                  <p className="mt-1 text-sm text-gray-500">Soft, editorial sets with notes from Emily. Minimal, modern vibe.</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2"><Dot /> 12+ premium photo sets</li>
                    <li className="flex items-center gap-2"><Dot /> Private chat access</li>
                    <li className="flex items-center gap-2"><Dot /> Voice messages</li>
                    <li className="flex items-center gap-2"><Dot /> Video coming soon</li>
                  </ul>
                  <div className="mt-5">
                    <button
                      onClick={startCheckout}
                      disabled={loading}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition disabled:opacity-70"
                    >
                      {loading ? 'Preparing…' : 'Get 30‑day Access'}
                    </button>
                  </div>
                  <p className="mt-3 text-[12px] text-gray-500">Secure checkout by Stripe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery teaser */}
      <section className="py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Featured sets</h2>
          <span className="text-sm text-gray-500">Updated weekly</span>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Morning light" />
          <Card title="Soft studio tones" />
          <Card title="Film grain edit" />
          <Card title="Monochrome study" />
        </div>
      </section>

      {/* Creator note */}
      <section className="pb-14">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">A note from Emily</h3>
          <p className="mt-2 text-[15px] leading-7 text-gray-600">
            Thanks for supporting my work! I’m building this space to share sets I love,
            small writings, and voice notes. I read every message in the private chat.
            Video is coming soon — I’m testing formats that feel right.
          </p>
          <div className="mt-5">
            <button
              onClick={startCheckout}
              disabled={loading}
              className="rounded-lg bg-gray-900 px-5 py-3 text-white text-sm font-medium hover:bg-black transition disabled:opacity-70"
            >
              {loading ? 'Redirecting…' : 'Join the Studio'}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">FAQ</h3>
            <p className="mt-2 text-sm text-gray-600">Quick answers about access, content, and privacy.</p>
          </div>
          <div className="md:col-span-2 grid gap-4">
            <Faq q="Do I need an account?" a="No. Purchase and you’ll be redirected to your private access page automatically." />
            <Faq q="How long do I have access?" a="30 days from purchase. You can buy again anytime." />
            <Faq q="What’s included?" a="Premium photo sets, creator notes, private chat, and occasional voice clips. Video is in development." />
            <Faq q="Is checkout secure?" a="Yes, payments are processed by Stripe. We never store card details." />
          </div>
        </div>
      </section>
    </div>
  )
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  )
}

function Dot() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-pink-600" aria-hidden />
}

function Card({ title }: { title: string }) {
  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="aspect-[4/3] bg-[conic-gradient(at_10%_10%,#fef2f8_0deg,#ffffff_120deg,#fef2f8_260deg)]" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          <span className="text-[11px] text-gray-500">Premium</span>
        </div>
      </div>
    </div>
  )
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm font-medium text-gray-900">{q}</p>
      <p className="mt-1 text-sm text-gray-600">{a}</p>
    </div>
  )
}
