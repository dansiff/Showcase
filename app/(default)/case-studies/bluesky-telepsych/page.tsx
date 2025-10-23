import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bluesky Telepsych Case Study - The Fusion Space Inc',
  description: 'Telehealth-focused site with accessibility, trust, and contact routing.'
};

export default function BlueskyTelepsychCaseStudy() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Bluesky Telepsych — Telehealth web presence</h1>
      <p className="mt-3 text-indigo-200/80">A trustworthy, ADA-conscious site with clear contact flows to route patients to appropriate care.</p>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Goals</h2>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li>Improve information architecture for patients</li>
          <li>Ensure accessibility and compliance best practices</li>
          <li>Connect inquiry flows to the right team quickly</li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Solution</h2>
        <p className="text-indigo-200/80">We restructured content, added accessibility checks, and built contact pathways that reduce handoffs and form abandonment.</p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Tech</h2>
        <p className="text-indigo-200/80">Next.js, Tailwind CSS, analytics, email routing.</p>
      </section>

      <div className="mt-10">
        <a href="/contact" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Start a project</a>
      </div>
    </main>
  );
}
