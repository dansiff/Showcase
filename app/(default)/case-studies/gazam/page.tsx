import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gazam Case Study - The Fusion Space Inc',
  description: 'Modernized product marketing site with speed and conversion focus.'
};

export default function GazamCaseStudy() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Gazam — Product site modernization</h1>
      <p className="mt-3 text-indigo-200/80">A modern, fast marketing site with clear conversion paths and a maintainable component system.</p>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Goals</h2>
        <ul className="list-disc pl-6 text-indigo-200/80">
          <li>Improve performance and Core Web Vitals</li>
          <li>Unify design system for rapid content updates</li>
          <li>Increase form conversions</li>
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Solution</h2>
        <p className="text-indigo-200/80">We implemented a Next.js + Tailwind stack, modular sections, and accessible components. Content edits now ship faster with fewer regressions.</p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Tech</h2>
        <p className="text-indigo-200/80">Next.js, Tailwind CSS, Vercel, form integrations.</p>
      </section>

      <div className="mt-10">
        <a href="/contact" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Start a project</a>
      </div>
    </main>
  );
}
