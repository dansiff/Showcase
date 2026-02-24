"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-red-900 text-center">Pricing & Plans</h1>
        <p className="text-lg text-gray-700 mb-12 text-center">
          Choose the plan that fits your business. All plans include onboarding, support, and access to new features.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Standard Plan */}
          <div className="border-2 border-amber-400 rounded-2xl p-8 shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold text-amber-600 mb-2">Standard</h2>
            <div className="text-3xl font-black text-red-900 mb-4">$49/mo</div>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li>✔️ Website hosting & updates</li>
              <li>✔️ Email support</li>
              <li>✔️ Basic analytics</li>
            </ul>
            <Link href="/pay/standard" className="bg-amber-500 hover:bg-amber-400 text-red-900 font-bold py-3 rounded-lg text-center transition-all">Get Started</Link>
          </div>
          {/* Blitz Plan */}
          <div className="border-2 border-red-400 rounded-2xl p-8 shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Blitz</h2>
            <div className="text-3xl font-black text-red-900 mb-4">$79/mo</div>
            <ul className="mb-6 space-y-2 text-gray-700">
              <li>✔️ Everything in Standard</li>
              <li>✔️ Priority support</li>
              <li>✔️ Advanced analytics</li>
              <li>✔️ Custom integrations</li>
            </ul>
            <Link href="/pay/blitz" className="bg-red-500 hover:bg-red-400 text-white font-bold py-3 rounded-lg text-center transition-all">Upgrade Now</Link>
          </div>
        </div>
        {/* Upsell & Common Problems */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-red-900 mb-4">Need More?</h2>
          <p className="mb-4 text-gray-700">Add-ons available: SEO boost, custom integrations, and more. <Link href="/contact" className="text-amber-600 underline">Contact us</Link> for a custom quote.</p>
          <h3 className="text-xl font-semibold text-amber-600 mt-8 mb-2">Common Problems We Solve</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Slow or unreliable websites</li>
            <li>Manual billing headaches</li>
            <li>No analytics or customer insights</li>
            <li>Difficulty updating content</li>
            <li>Missing online orders or leads</li>
            <li>Need for recurring revenue</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
