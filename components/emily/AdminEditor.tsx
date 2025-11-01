"use client"
import ContentEditor from '@/components/emily/ContentEditor'

export default function AdminEditor({ admin }: { admin: boolean }) {
  if (!admin) return null
  return (
    <div>
      <h3 className="font-semibold mb-2 text-gray-900">Editor (admin)</h3>
      <ContentEditor />
    </div>
  )
}
