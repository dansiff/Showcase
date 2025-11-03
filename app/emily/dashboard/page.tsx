import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StudioCard from '@/components/emily/StudioCard'
import AdminEditor from '@/components/emily/AdminEditor'
import LogoutButton from '@/components/emily/LogoutButton'

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic'
export const revalidate = 0

function isAdmin(cookieVal: string | undefined) {
  const key = process.env.EMILY_ADMIN_KEY
  if (!key) return false
  return cookieVal === key
}

export default async function EmilyDashboardPage() {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get('emily_admin')?.value
  const admin = isAdmin(adminCookie)

  // Redirect if not admin
  if (!admin) {
    redirect('/emily/admin')
  }

  // Load content stats with error handling and timeout
  let note = null
  let messageCount = 0
  let accessTokenCount = 0
  let dbError = false

  try {
    // Set a timeout for DB queries
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout')), 5000)
    )

    const queryPromise = Promise.allSettled([
      (prisma as any).emilyContent.findUnique({ where: { section: 'note' } }),
      (prisma as any).emilyMessage.count(),
      (prisma as any).accessToken.count({ where: { revoked: false } }),
    ])

    const results = await Promise.race([queryPromise, timeout]) as any

    if (results[0]?.status === 'fulfilled') note = results[0].value
    if (results[1]?.status === 'fulfilled') messageCount = results[1].value
    if (results[2]?.status === 'fulfilled') accessTokenCount = results[2].value
  } catch (err) {
    console.error('[EMILY-DASHBOARD] DB query error:', err)
    dbError = true
    // Continue with default values
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with gradient */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl blur-3xl opacity-30" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-pink-900 to-purple-900 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage content, view analytics, and customize Emily's experience
                </p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-full text-sm font-medium text-pink-900">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Admin Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DB Error Warning */}
        {dbError && (
          <div className="mb-6 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-yellow-900">Database Connection Issue</p>
                <p className="text-sm text-yellow-800 mt-1">
                  Stats may not be current, but the content editor below will still work.
                  <a href="/docs/VERCEL_DB_FIX.md" className="underline ml-1 hover:text-yellow-900">
                    See fix instructions →
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Active Buyers</span>
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {accessTokenCount}
              </div>
              <p className="text-xs text-gray-500 mt-2">With valid access tokens</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Messages</span>
                <span className="text-2xl">💬</span>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                {messageCount}
              </div>
              <p className="text-xs text-gray-500 mt-2">Total chat messages</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Gallery</span>
                <span className="text-2xl">🖼️</span>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {note?.mediaUrls?.length || 0}
              </div>
              <p className="text-xs text-gray-500 mt-2">Uploaded media items</p>
            </div>
          </div>
        </div>

        {/* Quick Actions - Enhanced */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/emily/admin/manage"
              className="group relative p-5 bg-white border-2 border-gray-200 rounded-2xl hover:border-pink-300 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">⚙️</div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-pink-600 transition">
                Manage Admins
              </div>
              <div className="text-xs text-gray-500 mt-1">Add/remove team</div>
            </a>
            
            <a
              href="/emily/access"
              className="group relative p-5 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">👁️</div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition">
                Buyer View
              </div>
              <div className="text-xs text-gray-500 mt-1">Preview access page</div>
            </a>
            
            <a
              href="/emily"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-5 bg-white border-2 border-gray-200 rounded-2xl hover:border-purple-300 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">🏠</div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition">
                Landing Page
              </div>
              <div className="text-xs text-gray-500 mt-1">Public view</div>
            </a>
            
            <LogoutButton />
          </div>
        </div>

        {/* Content Editor Section - Enhanced */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">✨</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Content Editor</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Upload images, add captions, and customize what buyers see
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <AdminEditor admin={admin} />
            </div>
          </div>
        </div>

        {/* Current Content Preview - Enhanced */}
        {note && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🖼️</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Current Gallery</h2>
                <p className="text-sm text-gray-600 mt-1">Live preview of published content</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {note.title || 'Untitled Gallery'}
                </h3>
                <p className="text-sm text-gray-600">
                  {note.body || 'No description provided'}
                </p>
              </div>
              {note.mediaUrls && note.mediaUrls.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {note.mediaUrls.map((url: string, i: number) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="group aspect-square rounded-xl border-2 border-gray-200 bg-white overflow-hidden hover:border-pink-400 hover:shadow-lg transition-all"
                    >
                      <img 
                        src={url} 
                        alt={`Gallery ${i + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <span className="text-4xl mb-3 block">📷</span>
                  <p className="text-sm text-gray-600">
                    No media uploaded yet. Use the editor above to add your first images.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Need help? Check the <a href="/docs/EMILY_MULTI_ADMIN.md" className="text-pink-600 hover:underline">admin documentation</a> or <a href="/docs/VERCEL_DB_FIX.md" className="text-pink-600 hover:underline">database troubleshooting</a>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
