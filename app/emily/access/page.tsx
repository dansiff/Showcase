import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import dynamic from 'next/dynamic'

const EmilyChat = dynamic(() => import('@/components/emily/Chat'), { ssr: false })

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

export default async function EmilyAccessPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('emily_access')?.value
  const ok = await hasValidAccess(token)
  if (!ok) redirect('/emily')

  return (
    <div className="grid gap-8">
      <section className="prose max-w-none">
        <h1 className="text-2xl font-semibold">Welcome! 🎉</h1>
        <p className="text-gray-700">
          Thanks for supporting Emily. Enjoy the private feed and leave a note below.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-4 bg-white/70">
          <h3 className="font-semibold mb-2">Gallery</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square rounded bg-gray-200" />
            <div className="aspect-square rounded bg-gray-200" />
            <div className="aspect-square rounded bg-gray-200" />
          </div>
        </div>
        <div className="rounded-xl border p-4 bg-white/70">
          <h3 className="font-semibold mb-2">Voice clips</h3>
          <p className="text-gray-600 text-sm">Audio drops appear here. Coming soon.</p>
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Private chat</h3>
        <EmilyChat />
      </section>
    </div>
  )
}
