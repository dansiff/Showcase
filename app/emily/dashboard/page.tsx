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
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-[15px] leading-7 text-gray-600">
            Manage content, view stats, and customize Emily's page.
          </p>
        </div>

        {/* DB Error Warning */}
        {dbError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Database connection issue.</strong> Stats may not be current. The content editor below will still work.
              Check your DATABASE_URL in Vercel environment variables.
            </p>
          </div>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StudioCard title="Active Access Tokens" subtitle="Buyers with access">
            <div className="text-3xl font-semibold text-gray-900">{accessTokenCount}</div>
          </StudioCard>
          <StudioCard title="Messages" subtitle="Total chat messages">
            <div className="text-3xl font-semibold text-gray-900">{messageCount}</div>
          </StudioCard>
          <StudioCard title="Gallery Items" subtitle="Uploaded media">
            <div className="text-3xl font-semibold text-gray-900">{note?.mediaUrls?.length || 0}</div>
          </StudioCard>
        </div>

        {/* Quick links */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href="/emily/admin/manage"
              className="p-4 border rounded-xl hover:bg-gray-50 transition text-center"
            >
              <div className="text-sm font-medium text-gray-900">Manage Admins</div>
              <div className="text-xs text-gray-500 mt-1">Add/remove team</div>
            </a>
            <a
              href="/emily/access"
              className="p-4 border rounded-xl hover:bg-gray-50 transition text-center"
            >
              <div className="text-sm font-medium text-gray-900">View Access Page</div>
              <div className="text-xs text-gray-500 mt-1">See buyer view</div>
            </a>
            <a
              href="/emily"
              className="p-4 border rounded-xl hover:bg-gray-50 transition text-center"
            >
              <div className="text-sm font-medium text-gray-900">Landing Page</div>
              <div className="text-xs text-gray-500 mt-1">Public view</div>
            </a>
            <LogoutButton />
          </div>
        </div>

        {/* Content Editor */}
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Editor</h2>
          <p className="text-sm text-gray-600 mb-6">
            Upload images, add captions, and customize the content that buyers see on the access page.
          </p>
          <AdminEditor admin={admin} />
        </div>

        {/* Current Content Preview */}
        {note && (
          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Gallery Content</h2>
            <div className="rounded-xl border p-6 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-2">{note.title || 'Untitled'}</h3>
              <p className="text-sm text-gray-600 mb-4">{note.body || 'No description'}</p>
              {note.mediaUrls && note.mediaUrls.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {note.mediaUrls.map((url: string, i: number) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="aspect-square rounded-lg border bg-white overflow-hidden hover:ring-2 hover:ring-pink-200 transition"
                    >
                      <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              )}
              {(!note.mediaUrls || note.mediaUrls.length === 0) && (
                <p className="text-sm text-gray-500">No media uploaded yet. Use the editor above to add images.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
