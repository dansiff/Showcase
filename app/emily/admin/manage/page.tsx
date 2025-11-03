"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Admin {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export default function AdminManagePage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Create form
  const [showCreate, setShowCreate] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    loadAdmins()
  }, [])

  async function loadAdmins() {
    try {
      setLoading(true)
      const res = await fetch('/api/emily/admin/list')
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/emily/admin')
          return
        }
        throw new Error('Failed to load admins')
      }
      const data = await res.json()
      setAdmins(data.admins || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createAdmin() {
    setCreateError(null)
    try {
      const res = await fetch('/api/emily/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          name: newName || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to create admin')
      
      // Reset form and reload
      setNewEmail('')
      setNewPassword('')
      setNewName('')
      setShowCreate(false)
      loadAdmins()
    } catch (err: any) {
      setCreateError(err.message)
    }
  }

  async function deleteAdmin(id: string, email: string) {
    if (!confirm(`Delete admin ${email}?`)) return
    try {
      const res = await fetch(`/api/emily/admin/delete?id=${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete admin')
      loadAdmins()
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Admin Management</h1>
            <p className="mt-2 text-sm text-gray-600">Manage admin accounts for Emily&apos;s platform</p>
          </div>
          <button
            onClick={() => router.push('/emily/dashboard')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Create admin form */}
        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="mb-6 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition text-sm font-medium"
          >
            + Add New Admin
          </button>
        ) : (
          <div className="mb-6 p-6 border rounded-2xl bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Admin</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="Admin name"
                />
              </div>
              {createError && <p className="text-sm text-red-600">{createError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={createAdmin}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition text-sm font-medium"
                >
                  Create Admin
                </button>
                <button
                  onClick={() => {
                    setShowCreate(false)
                    setCreateError(null)
                    setNewEmail('')
                    setNewPassword('')
                    setNewName('')
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admins list */}
        <div className="border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    No admins yet. Create one above to get started.
                  </td>
                </tr>
              ) : (
                admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{admin.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{admin.name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteAdmin(admin.id, admin.email)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Info box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Migration Note:</strong> You can still use the legacy admin key (EMILY_ADMIN_KEY) to log in. 
            Once you&apos;ve created admin accounts here, you can optionally remove the key from your environment variables.
          </p>
        </div>
      </div>
    </div>
  )
}
