"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [mode, setMode] = useState<'key' | 'email'>('key')
  const [key, setKey] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function login() {
    setError(null)
    try {
      const body = mode === 'key' 
        ? { key }
        : { email, password }

      const res = await fetch('/api/emily/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Login failed')
      // Cookie is set server-side, redirect to dashboard
      router.push('/emily/dashboard')
    } catch (e: any) {
      setError(e.message || 'Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Emily Admin</h1>
          <p className="mt-2 text-sm text-gray-600">Enter your credentials to unlock the editor.</p>
        </div>
        
        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('key')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
              mode === 'key' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Admin Key
          </button>
          <button
            onClick={() => setMode('email')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
              mode === 'email' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Email & Password
          </button>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          {mode === 'key' ? (
            <>
              <label className="block text-sm font-medium text-gray-900 mb-2">Admin Key</label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={key}
                onChange={e => setKey(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') login() }}
                placeholder="••••••••"
              />
            </>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
              <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') login() }}
                placeholder="••••••••"
              />
            </>
          )}
          <button
            onClick={login}
            className="w-full rounded-lg bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-black transition"
          >
            Login as Admin
          </button>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          Need to manage admins? <a href="/emily/admin/manage" className="underline hover:text-gray-700">Go to Admin Manager</a>
        </p>
      </div>
    </div>
  )
}
