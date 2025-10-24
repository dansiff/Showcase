import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Revenue Share Policy - The Fusion Space Inc',
  description: 'How creator earnings are calculated: platform fee, payouts, refunds, chargebacks, taxes, and custom deals.'
}

export default function RevenueSharePolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Revenue Share Policy</h1>
      <p className="mt-3 text-indigo-200/80">Effective: October 24, 2025</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p className="text-indigo-200/80">Our standard platform fee is 15% of net receipts. We define net receipts as the gross amount paid by the customer minus payment processing fees (e.g., Stripe) and any taxes collected on top (e.g., VAT/GST). What remains is split between the creator and the platform.</p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Definitions</h2>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li><strong>Gross</strong>: Total charged to the customer.</li>
          <li><strong>Payment processing fees</strong>: Fees charged by Stripe or other processors.</li>
          <li><strong>Taxes</strong>: VAT/GST or sales tax collected on top, when applicable. Taxes are not subject to revenue share.</li>
          <li><strong>Net receipts</strong>: Gross − processing fees − taxes.</li>
          <li><strong>Platform fee</strong>: The percentage taken by The Fusion Space Inc from net receipts.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Standard fee and tiers</h2>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li>Standard platform fee: <strong>15%</strong> of net receipts.</li>
          <li>Volume tier: <strong>12%</strong> if your account exceeds <strong>$10,000 MRR</strong> for two consecutive months.</li>
          <li>Launch promo (optional): <strong>13%</strong> for your first 90 days.</li>
          <li>Minimum per-transaction fee: <strong>$0.50</strong> (to cover micro-transactions).</li>
          <li>Custom deals: Available at our discretion, documented per account.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Payouts</h2>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li>Payout cadence: Weekly, with a 7-day rolling hold to cover refunds/chargebacks.</li>
          <li>Instant payouts (when supported) may incur an additional fee.</li>
          <li>Chargebacks or unpaid invoices are deducted from your next payout.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Refunds and disputes</h2>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li>Full refund within 14 days: Platform fee is reversed.</li>
          <li>Partial refunds: Fees are reversed pro‑rata.</li>
          <li>Disputes/chargebacks: Associated amounts and processor fees are deducted from future payouts.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Taxes</h2>
        <p className="text-indigo-200/80">Creators are responsible for their own tax obligations. Where required, we may collect VAT/GST from customers. Taxes collected on top are excluded from revenue share.</p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Custom deals</h2>
        <p className="text-indigo-200/80">We offer customized pricing for select partners based on volume, exclusivity, or strategic alignment. These agreements are approved at our discretion and documented in your account settings.</p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Examples</h2>
        <p className="text-indigo-200/80">A $10.00 purchase with $0.59 in processor fees and no tax:</p>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li>Net receipts = 1000 − 59 − 0 = 941¢</li>
          <li>Platform fee (15%) = 141¢</li>
          <li>Creator payout = 800¢</li>
        </ul>
      </section>

      <div className="mt-10">
        <a href="/contact" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Discuss a custom deal</a>
      </div>
    </main>
  )
}
