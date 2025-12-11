import dynamic from 'next/dynamic'
import { PageHeader, PageFooter } from '@/components/PageHeaderFooter'

const SushiOrder = dynamic(() => import('@/components/SushiOrder'), { ssr: false })

export default function SushiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-950 to-slate-900">
      <PageHeader theme="sushi" title="🍣 Sakura Sushi" subtitle="Authentic • Fresh • Exquisite" />
      <main className="pt-4 pb-12">
        <SushiOrder />
      </main>
      <PageFooter theme="sushi" />
    </div>
  )
}
