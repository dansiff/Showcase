import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers - The Fusion Space Inc',
  description: 'Join our team and help build the future.'
};

export default function CareersPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Careers</h1>
      <p className="mt-4 text-indigo-200/80">We’re not hiring for specific roles yet. Introduce yourself at careers@thefusionspace.com.</p>
    </main>
  );
}
