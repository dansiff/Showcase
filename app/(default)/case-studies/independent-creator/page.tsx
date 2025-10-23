import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Independent Creator Platform Case Study - The Fusion Space Inc',
  description: 'Custom creator platform with subscription tiers, gated posts, and age-restriction tooling.'
};

export default function IndependentCreatorCaseStudy() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Independent Creator — Monetization platform</h1>
      <p className="mt-3 text-indigo-200/80">In-progress build: subscriptions, gated content, creator analytics, and compliance-first controls.</p>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Objectives</h2>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li>Offer multiple subscription tiers with perks</li>
          <li>Gate premium posts and media by tier</li>
          <li>Provide age-restriction toggles and consent overlays</li>
          <li>Creator-friendly dashboard and analytics</li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Solution</h2>
        <p className="text-indigo-200/80">We designed a full-stack platform with tiered subscriptions via Stripe, post-level gating, and an AgeGate overlay backed by a toggle in creator settings.</p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Stack</h2>
        <p className="text-indigo-200/80">Next.js App Router, TypeScript, Prisma on Postgres, Supabase Auth, Stripe, Tailwind CSS.</p>
      </section>

      <div className="mt-10">
        <a href="/intake" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Plan your build</a>
      </div>
    </main>
  );
}
