import { Metadata } from 'next'
import { PageHeader, PageFooter } from '@/components/PageHeaderFooter'
import PricingPlans from '@/components/generator/PricingPlans'
import ComparisonTable from '@/components/generator/ComparisonTable'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Website Generator Pricing - Fusion Space',
  description: 'Choose the perfect plan for your website. Start free with Standard, or upgrade to Pro for advanced features.',
}

export default async function PricingPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <PageHeader />
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <PricingPlans isAuthenticated={!!user} />
        <ComparisonTable />

        {/* Coming Soon Section */}
        <section className="relative py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center sm:p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Coming Soon to Pro Plan
              </h2>
              <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
                We're working on exciting new features to help you grow your business even faster
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-white">
                  <div className="text-4xl mb-2">🤖</div>
                  <h3 className="font-semibold mb-2">AI Content Generation</h3>
                  <p className="text-sm text-indigo-100">Auto-generate page copy and descriptions</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-white">
                  <div className="text-4xl mb-2">🎨</div>
                  <h3 className="font-semibold mb-2">Advanced Design Tools</h3>
                  <p className="text-sm text-indigo-100">More control over colors, fonts, and layouts</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-white">
                  <div className="text-4xl mb-2">📧</div>
                  <h3 className="font-semibold mb-2">Email Marketing</h3>
                  <p className="text-sm text-indigo-100">Integrated email campaigns and automation</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-white">
                  <div className="text-4xl mb-2">📱</div>
                  <h3 className="font-semibold mb-2">Mobile App Export</h3>
                  <p className="text-sm text-indigo-100">Export your site as a mobile app</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-white">
                  <div className="text-4xl mb-2">🔌</div>
                  <h3 className="font-semibold mb-2">Third-Party Integrations</h3>
                  <p className="text-sm text-indigo-100">CRM, payment gateways, and more</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-white">
                  <div className="text-4xl mb-2">👥</div>
                  <h3 className="font-semibold mb-2">Team Collaboration</h3>
                  <p className="text-sm text-indigo-100">Invite team members to edit sites</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PageFooter />
    </>
  )
}
