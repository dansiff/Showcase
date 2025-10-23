import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bluesky Telepsych Case Study - The Fusion Space Inc',
  description: 'Custom EHR/EMR for telepsychiatry with video integration and automated billing.'
};

export default function BlueskyTelepsychCaseStudy() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Bluesky Telepsych — Telepsychiatry platform</h1>
      <p className="mt-3 text-indigo-200/80">Custom EHR/EMR solution for a psychiatry practice, featuring live video consultations and automated billing workflows.</p>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Scope</h2>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li>Migrated WordPress site to Wix for improved UX</li>
          <li>Built custom EHR/EMR software for psychiatric practice</li>
          <li>Integrated Twilio for live video patient sessions</li>
          <li>Automated billing and insurance workflows</li>
          <li>Lead DevOps overseeing India-based development team</li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Solution</h2>
        <p className="text-indigo-200/80">Developed a HIPAA-compliant telehealth platform on AWS with Twilio video integration, streamlining patient scheduling, documentation, and billing. Managed offshore development team to deliver on time and under budget.</p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Tech Stack</h2>
        <p className="text-indigo-200/80">AWS (EC2, RDS, S3), Twilio Video API, Wix (public site), custom EHR/EMR backend, automated billing integrations.</p>
      </section>

      <div className="mt-10">
        <a href="/contact" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Start a project</a>
      </div>
    </main>
  );
}
