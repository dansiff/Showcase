import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gazam Case Study - The Fusion Space Inc',
  description: 'Full-stack EHR/EMR solution for multi-clinic pain management with subscription model.'
};

export default function GazamCaseStudy() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Gazam — EHR/EMR SaaS for pain clinics</h1>
      <p className="mt-3 text-indigo-200/80">End-to-end tech stack management for Dr. Barry Ring's multi-clinic pain management software, sold on a subscription basis to pain clinics nationwide.</p>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Scope</h2>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li>Managed full web presence and tech infrastructure</li>
          <li>Data migration from local storage to Azure SQL Database</li>
          <li>Integrated Twilio for live video consultations</li>
          <li>Automated patient intake with form auto-fill (insurance, demographics, medical history)</li>
          <li>Multi-tenant subscription billing and clinic onboarding</li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Solution</h2>
        <p className="text-indigo-200/80">Built a React.js EHR/EMR platform hosted on Azure, streamlining clinic workflows by automating paperwork, enabling telehealth video, and centralizing patient records in a secure cloud database. Reduced administrative overhead and improved compliance for multiple clinic locations.</p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Tech Stack</h2>
        <p className="text-indigo-200/80">React.js, Azure (App Service, SQL Database), Twilio Video API, subscription billing integrations, data migration tooling.</p>
      </section>

      <div className="mt-10">
        <a href="/contact" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Start a project</a>
      </div>
    </main>
  );
}
