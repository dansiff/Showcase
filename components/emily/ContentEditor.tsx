"use client"
import { useEffect, useState } from 'react'

export default function ContentEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/emily/content', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load content')
      const note = data.content?.note
      if (note) {
        setTitle(note.title || '')
        setBody(note.body || '')
        setMediaUrls(Array.isArray(note.mediaUrls) ? note.mediaUrls : [])
      }
    } catch (e: any) {
      setError(e.message || 'Error loading content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'content')
    try {
      const res = await fetch('/api/emily/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Upload failed')
      setMediaUrls((m) => [...m, data.url])
    } catch (e: any) {
      setError(e.message || 'Upload error')
    } finally {
      e.target.value = ''
    }
  }

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/emily/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'note', title, body, mediaUrls }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to save')
    } catch (e: any) {
      setError(e.message || 'Save error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-sm text-gray-500">Loading editor…</div>

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm grid gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-900">Title</label>
        <input className="mt-1 w-full border rounded-lg px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900">Body</label>
        <textarea className="mt-1 w-full border rounded-lg px-3 py-2 min-h-28" value={body} onChange={e => setBody(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-900">Media</label>
          <input type="file" accept="image/*,audio/*" onChange={onUpload} />
        </div>
        {mediaUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {mediaUrls.map((u, i) => (
              <a key={i} href={u} target="_blank" rel="noreferrer" className="aspect-square rounded-xl border bg-gray-50 overflow-hidden" />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={save} disabled={saving} className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm disabled:opacity-70">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
