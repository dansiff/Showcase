import Link from "next/link";

export const metadata = {
  title: "Asset Management for Airbnb & Rentals | The Fusion Space Inc.",
  description:
    "Full-service asset management for Airbnb, short-term, and mid-term rentals — pricing, operations, and guest experience handled by The Fusion Space Inc.",
};

const workflow = [
  {
    title: "Discovery & audit",
    detail: "We review each property, current listings, pricing data, restrictions, and vendor stack to set the baseline.",
  },
  {
    title: "Revenue plan",
    detail: "Dynamic pricing rules, minimum stay strategy, channel mix, and occupancy targets tuned for your market seasonality.",
  },
  {
    title: "Launch & setup",
    detail: "Listing optimization, photography brief, amenity gap-closing, smart lock + guidebook setup, and cleaning standards.",
  },
  {
    title: "Distribution",
    detail: "Airbnb, Vrbo, Booking.com, and direct-book funnels with consistent rates, calendars, and payouts.",
  },
  {
    title: "Operations",
    detail: "Guest messaging, ID checks, cleaners and maintenance SLAs, issue triage, and on-call escalation playbooks.",
  },
  {
    title: "Reporting",
    detail: "Monthly performance deck: ADR, RevPAR, occupancy, channel mix, 5-star rate, and next-month actions.",
  },
];

const offers = [
  {
    name: "Launch & Rehab",
    price: "One-time from $1.5k",
    bullets: [
      "Audit, pricing model, and launch calendar",
      "Listing rewrite + asset prep checklist",
      "Vendor alignment (cleaners, maintenance, linens)",
      "Direct-book funnel and guidebook setup",
    ],
  },
  {
    name: "Full-Service Management",
    price: "% of gross nightly revenue",
    bullets: [
      "Dynamic pricing and channel management",
      "24/7 guest comms with SLA coverage",
      "Turnover scheduling, inspections, restock playbooks",
      "Issue resolution with owner-approved spend caps",
    ],
    highlight: "Most popular",
  },
  {
    name: "Portfolio Growth",
    price: "Custom for 5+ doors",
    bullets: [
      "Multi-unit pacing and calendar strategy",
      "Owner reporting and cash-flow modeling",
      "Design upgrades with ROI tracking",
      "Owner portal + monthly executive review",
    ],
  },
];

const proofPoints = [
  "Occupancy and ADR tuned weekly with market comps",
  "Guest satisfaction frameworks to protect 5-star ratings",
  "Vendor bench (cleaning, maintenance, staging) we manage end-to-end",
  "Owner visibility: clear approvals, spend limits, and scheduled reporting",
];

export default function AssetManagementPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-24 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
              The Fusion Space Inc.
              <span className="text-white/70">Asset management</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
                Airbnb and rental assets managed like a performance portfolio.
              </h1>
              <p className="text-lg text-slate-200/90 sm:text-xl">
                We run pricing, distribution, and guest experience so your furnished rentals keep cash flowing — without you fielding late-night messages or guessing the right nightly rate.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-200/80">
              <span className="rounded-full bg-white/5 px-3 py-1">Dynamic pricing</span>
              <span className="rounded-full bg-white/5 px-3 py-1">Guest ops</span>
              <span className="rounded-full bg-white/5 px-3 py-1">OTA + direct</span>
              <span className="rounded-full bg-white/5 px-3 py-1">Owner reporting</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="mailto:hello@thefusionspace.com?subject=Asset%20Manager%20Consult"
                className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/40 transition hover:-translate-y-0.5 hover:shadow-cyan-400/50"
              >
                Book a consult
              </Link>
              <Link
                href="/portal"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-400/60 hover:text-cyan-100"
              >
                View client portal
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">What we handle</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Pricing, guest comms, turnovers, compliance checks, payouts, and reporting.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Who this is for</p>
                <p className="mt-2 text-lg font-semibold text-white">Airbnb, short-term, and mid-term rentals that need consistent NOI.</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-indigo-500/20 p-6 shadow-2xl shadow-cyan-500/10 lg:max-w-[420px]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100">Offer at a glance</p>
            <div className="space-y-3 text-slate-100">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                <div>
                  <p className="font-semibold">Revenue discipline</p>
                  <p className="text-sm text-slate-200/90">Dynamic pricing, channel mix, stay rules, and rate fences to protect ADR and occupancy.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-indigo-300" />
                <div>
                  <p className="font-semibold">Guest experience ops</p>
                  <p className="text-sm text-slate-200/90">Scripted messaging, ID checks, automations, and on-call coverage to guard 5-star reviews.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                <div>
                  <p className="font-semibold">Owner visibility</p>
                  <p className="text-sm text-slate-200/90">Approvals, spend caps, payouts, and monthly performance reports — no surprises.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm text-cyan-50">
              Currently onboarding select portfolios in 2026. Reach out to reserve your slot.
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-cyan-500/20" />
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-cyan-200">Workflow</p>
            <h2 className="text-3xl font-bold text-white">How we run your assets</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {workflow.map((step) => (
            <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">Step</span>
              </div>
              <p className="mt-3 text-sm text-slate-200/90">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-slate-900/40 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.12em] text-cyan-200">Offers</p>
              <h2 className="text-3xl font-bold text-white">Pick the level that fits</h2>
            </div>
            <Link
              href="mailto:hello@thefusionspace.com?subject=Asset%20Manager%20Offer"
              className="rounded-full border border-cyan-400/50 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:-translate-y-0.5 hover:border-cyan-300"
            >
              Ask about availability
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {offers.map((offer) => (
              <div
                key={offer.name}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-cyan-500/10"
              >
                {offer.highlight && (
                  <span className="absolute right-4 top-4 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-50">
                    {offer.highlight}
                  </span>
                )}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">{offer.name}</h3>
                  <p className="text-sm text-cyan-100">{offer.price}</p>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-200/90">
                  {offer.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.12em] text-cyan-200">Why us</p>
            <h2 className="text-3xl font-bold text-white">Built for owners who want consistent NOI, not chaos.</h2>
            <p className="text-lg text-slate-200/90">
              The Fusion Space Inc. blends revenue management with tight operations. We work as your asset manager — transparent approvals, disciplined pricing, and guest experience that protects ratings.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {proofPoints.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-cyan-900/30 p-6 shadow-lg shadow-cyan-500/10">
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-white">What happens after you reach out</h3>
              <ol className="space-y-2 text-sm text-slate-200/90">
                <li>1) 20-minute fit call to align on goals, markets, and current constraints.</li>
                <li>2) We return a mini-plan: revenue targets, ops changes, and launch timeline.</li>
                <li>3) Sign off, then we onboard vendors, listings, and automations within 2 weeks.</li>
              </ol>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="mailto:hello@thefusionspace.com?subject=Asset%20Manager%20Intro"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  Schedule a fit call
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-300"
                >
                  Start onboarding
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
