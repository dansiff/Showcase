import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payout Schedule - The Fusion Space Inc',
  description: 'Standard payout cadence, instant payout rules, timelines, and requirements.'
}

export default function PayoutsPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Payout Schedule</h1>
      <p className="mt-3 text-indigo-200/80">How and when creators get paid.</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Standard cadence</h2>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li>Weekly payouts by default.</li>
          <li>7‑day rolling hold to cover refunds and chargebacks.</li>
          <li>Minimum payout: $10.00 (after fees and holds).</li>
          <li>Payment methods: Stripe Connect (recommended), Bank Wire, PayPal.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Instant payouts</h2>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li>Request a one‑off payout from your dashboard.</li>
          <li>Instant payouts may include an additional processing fee.</li>
          <li>Processing time: typically 1–2 business days depending on method.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Compliance & verification</h2>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li>KYC and tax info may be required before your first payout.</li>
          <li>We may hold funds for additional review in case of elevated dispute rates.</li>
        </ul>
      </section>

      <div className="mt-10">
        <a href="/dashboard/payouts" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Configure payouts</a>
      </div>
    </main>
  )
}
