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
    <div className="grid gap-8">
      <section className="text-center py-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Emily’s Exclusive Collection</h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Support Emily and unlock premium photos, behind‑the‑scenes notes, and a cozy private chat.
          No account needed — purchase once, get a private access link for 30 days.
        </p>
        <div className="mt-6">
          <button
            onClick={startCheckout}
            disabled={loading}
            className="rounded-lg bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 font-medium disabled:opacity-70"
          >
            {loading ? 'Redirecting…' : 'Get Access'}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="rounded-xl border p-5 bg-white/60">
          <h3 className="font-semibold">Premium gallery</h3>
          <p className="text-gray-600 text-sm mt-1">Curated photos updated regularly.</p>
        </div>
        <div className="rounded-xl border p-5 bg-white/60">
          <h3 className="font-semibold">Private chat</h3>
          <p className="text-gray-600 text-sm mt-1">Say hi and leave a note for Emily.</p>
        </div>
        <div className="rounded-xl border p-5 bg-white/60">
          <h3 className="font-semibold">Voice clips</h3>
          <p className="text-gray-600 text-sm mt-1">Occasional audio messages and BTS.</p>
        </div>
      </section>
    </div>
  )
}
