import Link from "next/link";

export const metadata = {
  title: "Creators — Showcase",
  description: "A clean, modern landing for creators and fans to join the platform.",
};

export default function CreatorsHome() {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100">For creators and fans</span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Build, monetize, and grow your audience
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Launch your creator profile in minutes. Publish posts, sell subscriptions, and connect with your community—all in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/signup?role=creator" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Become a creator
              </Link>
              <Link href="/signup" className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50">
                Sign up as a fan
              </Link>
              <Link href="/creator/demo" className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900">
                View demo profile →
              </Link>
            </div>
            <p className="mt-3 text-xs text-gray-500">No credit card required. Cancel anytime.</p>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm"/>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <Feature
            title="Create and publish"
            desc="Post text, images, or videos. Share free or premium content with flexible visibility controls."
          />
          <Feature
            title="Subscriptions with Stripe"
            desc="Offer tiers and recurring memberships powered by Stripe for secure, global payments."
          />
          <Feature
            title="Engage your fans"
            desc="Likes and insights help you learn what resonates and grow your community over time."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <Step index={1} title="Create account" desc="Sign up as a creator or fan in under a minute." />
          <Step index={2} title="Set up tiers" desc="Add subscription plans and pricing with Stripe." />
          <Step index={3} title="Publish posts" desc="Share content with fans—free or premium." />
          <Step index={4} title="Get paid" desc="Grow your audience and earnings over time." />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h3 className="text-2xl font-semibold">Ready to start?</h3>
          <p className="mt-2 text-gray-600">Join as a creator or sign up as a fan to follow your favorites.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/signup?role=creator" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
              Become a creator
            </Link>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50">
              Sign up as a fan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Step({ index, title, desc }: { index: number; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
        {index}
      </div>
      <h4 className="mt-4 text-base font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}
