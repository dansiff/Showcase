import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Method - The Fusion Space Inc',
  description: 'How we plan, build, and ship.'
};

export default function MethodPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Our Method</h1>
      <ol className="mt-4 list-decimal space-y-3 pl-6 text-indigo-200/80">
        <li>Discover: Goals, audience, constraints.</li>
        <li>Design: Information architecture, flows, and UI.</li>
        <li>Build: Iterative development with weekly checkpoints.</li>
        <li>Launch: Validation, polish, and go-live checklists.</li>
        <li>Grow: Analytics, experiments, and continuous updates.</li>
      </ol>
    </main>
  );
}
