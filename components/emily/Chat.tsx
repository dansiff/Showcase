"use client"
import { useEffect, useRef, useState } from 'react'

type Msg = {
  id: string
  sender: string
  type: string
  content?: string | null
  url?: string | null
  createdAt: string
}

export default function EmilyChat() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/emily/messages', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load messages')
      setMessages(data.messages || [])
    } catch (e: any) {
      setError(e.message || 'Error loading messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  async function send() {
    if (!text.trim()) return
    const payload = { type: 'text', content: text.trim() }
    setText('')
    try {
      const res = await fetch('/api/emily/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to send')
      setMessages(m => [...m, data.message])
    } catch (e: any) {
      setError(e.message || 'Error sending')
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-4 grid gap-3 shadow-sm">
      <div className="h-64 overflow-y-auto rounded-xl border bg-white p-3 space-y-3">
        {loading && <div className="text-gray-500 text-sm">Loading…</div>}
        {!loading && messages.length === 0 && <div className="text-gray-500 text-sm">Say hello 👋</div>}
        {messages.map(m => (
          <div key={m.id} className={m.sender === 'buyer' ? 'text-right' : 'text-left'}>
            <div
              className={`inline-flex max-w-[80%] px-3 py-2 rounded-2xl text-sm shadow-sm ${
                m.sender === 'buyer'
                  ? 'bg-pink-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-900 rounded-tl-sm'
              }`}
            >
              {m.type === 'text' ? m.content : (
                <a className="underline" href={m.url || '#'} target="_blank" rel="noreferrer">{m.url}</a>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
          placeholder="Write a message…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send() }}
        />
        <button className="bg-pink-600 hover:bg-pink-700 text-white rounded-lg px-4 transition" onClick={send}>Send</button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
