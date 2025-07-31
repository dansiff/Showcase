// app/pricing/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Pricing - Commission-Based Web Design",
  description: "No upfront cost. We build and host your store, and only take a commission from successful sales.",
};

export default function PricingPage() {
  return (
    <section className="bg-white text-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-indigo-500 via-amber-500 to-red-500 bg-clip-text text-transparent">
            Commission-Based Web Design
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            No upfront fees. We design your online store, you keep control, and we only earn when you do—through a small commission on each Stripe-verified sale.
          </p>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-24">
          {[
            {
              title: "We Design & Build",
              desc: "A custom-tailored website ready to showcase your brand, products, and services.",
              icon: "🛠️",
            },
            {
              title: "You Launch & Sell",
              desc: "We connect Stripe and help you start selling physical or digital goods instantly.",
              icon: "🚀",
            },
            {
              title: "You Earn, We Earn",
              desc: "You keep your revenue, and we take a small commission per transaction. That’s it.",
              icon: "💸",
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="p-6 border rounded-xl hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Commission Tiers */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold text-center mb-6">
            Transparent Commission Tiers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                label: "Starter Brands",
                percent: "15%",
                desc: "For new or small brands under $5k monthly sales",
              },
              {
                label: "Scaling Businesses",
                percent: "10%",
                desc: "For mid-size businesses doing $5k–$20k monthly",
              },
              {
                label: "High Volume",
                percent: "7%",
                desc: "For operations exceeding $20k/month in verified sales",
              },
            ].map((tier, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-6 rounded-lg border border-indigo-200 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold text-indigo-600">
                  {tier.label}
                </h3>
                <p className="text-4xl font-extrabold text-gray-800 mt-2">
                  {tier.percent}
                </p>
                <p className="mt-2 text-sm text-gray-600">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Example Use Cases */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold text-center mb-10">
            Who Is This For?
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
            {["Taco Shops & Restaurants", "Ebook & Course Creators", "Startup Founders", "Merch & Apparel Brands"].map(
              (title, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg bg-white hover:bg-indigo-50 transition"
                >
                  <span className="text-indigo-600 font-semibold">
                    {title}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Ready to get started?
          </h3>
          <p className="text-gray-600 mb-6">
            We’ll help you launch your brand with zero up-front investment.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full shadow hover:bg-indigo-700 transition"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </section>
  );
}
