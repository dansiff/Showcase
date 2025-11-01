import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EmilyChat from '@/components/emily/Chat'
import StudioCard from '@/components/emily/StudioCard'
import AdminEditor from '@/components/emily/AdminEditor'

async function hasValidAccess(token: string | undefined | null) {
  if (!token) return false
  // Use any to avoid type error until prisma generate is run
  const record = await (prisma as any).accessToken.findFirst({
    where: {
      token,
      revoked: false,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  })
  return !!record
}

function isAdmin(cookieVal: string | undefined) {
  const key = process.env.EMILY_ADMIN_KEY
  if (!key) return false
  return cookieVal === key
}

export default async function EmilyAccessPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('emily_access')?.value
  const adminCookie = cookieStore.get('emily_admin')?.value
  const ok = await hasValidAccess(token)
  if (!ok) redirect('/emily')
  const admin = isAdmin(adminCookie)

  // Load content (note section)
  const note = await (prisma as any).emilyContent.findUnique({ where: { section: 'note' } })

  return (
    <div className="bg-white">
      {/* Hero-lite intro */}
      <section className="pt-10 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Welcome to the studio 🎉</h1>
        <p className="mt-2 text-[15px] leading-7 text-gray-600">{note?.title || 'Thanks for supporting Emily. Enjoy the private feed and leave a note below.'}</p>
      </section>

      {/* Content area */}
      <section className="grid md:grid-cols-2 gap-6">
        <StudioCard title="Gallery" subtitle="More sets are added throughout the month.">
          <div className="grid grid-cols-3 gap-2">
            {(note?.mediaUrls ?? []).slice(0, 3).map((u: string, i: number) => (
              <a key={i} className="aspect-square rounded-xl border bg-gray-50 overflow-hidden" href={u} target="_blank" rel="noreferrer" />
            ))}
            {(!note?.mediaUrls || note.mediaUrls.length === 0) && (
              <>
                <div className="aspect-square rounded-xl bg-[conic-gradient(at_10%_10%,#fef2f8_0deg,#ffffff_120deg,#fef2f8_260deg)]" />
                <div className="aspect-square rounded-xl bg-[linear-gradient(135deg,#fde7ef,white)]" />
                <div className="aspect-square rounded-xl bg-gray-100" />
              </>
            )}
          </div>
        </StudioCard>
        <StudioCard title="Voice clips" subtitle="Audio drops appear here. Video is coming soon.">
          <p className="text-gray-600 text-sm">Stay tuned.</p>
        </StudioCard>
      </section>

      {/* Chat */}
      <section className="mt-8 grid gap-6">
        <h3 className="font-semibold mb-2 text-gray-900">Private chat</h3>
        <EmilyChat />
        <AdminEditor admin={admin} />
      </section>
    </div>
  )
}
