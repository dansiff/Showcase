import { Metadata } from "next";
import Link from "next/link";
import { Check, Zap, Rocket, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing & Plans - Sandoval Bro's",
  description: "Professional website development with unbeatable prices. Choose the plan that fits your needs.",
};

const plans = [
  {
    name: "Standard Plan",
    price: 2500,
    monthly: 49,
    description: "Perfect for small businesses and startups looking to establish their online presence",
    features: [
      "Custom website design & development",
      "Mobile-responsive design",
      "SEO optimization",
      "Contact forms & integrations",
      "Google Analytics setup",
      "SSL certificate included",
      "Monthly hosting ($49/mo)",
      "Email support",
      "Content management system",
      "Social media integration",
    ],
    icon: Rocket,
    color: "from-blue-500 to-indigo-600",
    checkoutUrl: "/pay/standard",
    popular: false,
    buildTime: "2-3 weeks",
  },
  {
    name: "Blitz Plan",
    price: 3999,
    monthly: 79,
    description: "Fast-track your launch with our 48-hour rapid development service",
    features: [
      "Everything in Standard Plan",
      "48-hour delivery guarantee",
      "Priority development",
      "Advanced animations & interactions",
      "E-commerce integration (if needed)",
      "Custom checkout solutions",
      "Premium monthly hosting ($79/mo)",
      "Priority support (24/7)",
      "Expedited revisions",
      "Google Ads setup assistance",
      "Advanced analytics dashboard",
    ],
    icon: Zap,
    color: "from-purple-500 to-pink-600",
    checkoutUrl: "/pay/blitz",
    popular: true,
    buildTime: "48 hours",
    badge: "Most Popular",
  },
];

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-1.5 mb-6">
            <Check className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400">
            Professional websites with unbeatable prices. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? "border-purple-500/50 bg-gradient-to-br from-purple-950/50 to-indigo-950/50 ring-2 ring-purple-500/20"
                    : "border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-800/50"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                    {plan.badge}
                  </div>
                )}

                {/* Card Content */}
                <div className="p-8 sm:p-10">
                  {/* Icon */}
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.color} shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Plan Name & Build Time */}
                  <div className="mb-4">
                    <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="inline-flex items-center gap-2 rounded-full bg-gray-800/50 px-3 py-1 text-sm text-gray-300">
                      <Zap className="h-3.5 w-3.5" />
                      {plan.buildTime} delivery
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-6 text-gray-400">{plan.description}</p>

                  {/* Pricing */}
                  <div className="mb-8 rounded-2xl bg-gray-900/50 p-6 border border-gray-800">
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-bold text-white">${plan.price.toLocaleString()}</span>
                        <span className="text-gray-400">one-time</span>
                      </div>
                      <p className="text-sm text-gray-500">Build fee (paid upfront)</p>
                    </div>
                    <div className="border-t border-gray-800 pt-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-white">${plan.monthly}</span>
                        <span className="text-gray-400">/month</span>
                      </div>
                      <p className="text-sm text-gray-500">Hosting & maintenance (recurring)</p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-purple-400' : 'text-indigo-400'}`} />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href={plan.checkoutUrl}
                    className={`group/btn flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/50"
                        : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-500/50"
                    }`}
                  >
                    Get Started
                    <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>

                {/* Decorative gradient */}
                <div className={`absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br ${plan.color} opacity-20 blur-3xl transition-opacity group-hover:opacity-30`} />
              </div>
            );
          })}
        </div>

        {/* Special Offer Banner */}
        <div className="mx-auto max-w-4xl rounded-3xl border border-yellow-500/30 bg-gradient-to-r from-yellow-950/30 to-orange-950/30 p-8 text-center backdrop-blur">
          <div className="mb-4 text-4xl">🎉</div>
          <h3 className="mb-3 text-2xl font-bold text-white">Limited Time Offer</h3>
          <p className="mb-6 text-lg text-gray-300">
            First 3 clients get <span className="font-bold text-yellow-400">$500 OFF</span> the Standard Plan!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/pay/standard"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105"
            >
              Claim Your Discount
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Questions about which plan is right for you?</p>
          <Link
            href="/About"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Learn more about us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
