"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [key, setKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function login() {
    setError(null)
    try {
      const res = await fetch('/api/emily/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Login failed')
      // Cookie is set server-side, redirect to access
      router.push('/emily/access')
    } catch (e: any) {
      setError(e.message || 'Invalid key')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Emily Admin</h1>
          <p className="mt-2 text-sm text-gray-600">Enter your admin key to unlock the editor.</p>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-900 mb-2">Admin Key</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-200"
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') login() }}
            placeholder="••••••••"
          />
          <button
            onClick={login}
            className="w-full rounded-lg bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-black transition"
          >
            Login as Admin
          </button>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}
