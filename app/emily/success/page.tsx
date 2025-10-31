"use client"
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function EmilySuccess() {
  const params = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading'|'ok'|'error'>('loading')
  const [message, setMessage] = useState<string>('Confirming your purchase…')

  useEffect(() => {
    const sessionId = params.get('session_id')
    if (!sessionId) {
      setStatus('error')
      setMessage('Missing session_id in URL')
      return
    }
    ;(async () => {
      try {
        const res = await fetch(`/api/emily/confirm?session_id=${encodeURIComponent(sessionId)}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to confirm')
        setStatus('ok')
        setMessage('Access ready! Redirecting…')
        // small delay to ensure cookie set
        setTimeout(() => router.replace('/emily/access'), 600)
      } catch (e: any) {
        setStatus('error')
        setMessage(e.message || 'Something went wrong')
      }
    })()
  }, [params, router])

  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold">{status === 'loading' ? 'Please wait…' : status === 'ok' ? 'Success' : 'There was an issue'}</h1>
      <p className="mt-3 text-gray-600">{message}</p>
    </div>
  )
}
