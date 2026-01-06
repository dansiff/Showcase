'use client'

import dynamic from 'next/dynamic'
import { PageHeader, PageFooter } from '@/components/PageHeaderFooter'

const ItalianOrder = dynamic(() => import('@/components/ItalianOrder'), { ssr: false })

export default function ItalianPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      <PageHeader theme="italian" title="🍝 Trattoria Italia" subtitle="Family • Authentic • Delicious" />
      <main className="pt-4 pb-12">
        <ItalianOrder />
      </main>
      <PageFooter theme="italian" />
    </div>
  )
}
