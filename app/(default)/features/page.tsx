import { Metadata } from 'next';
import Features from '@/components/features';

export const metadata: Metadata = {
  title: 'Features - The Fusion Space Inc',
  description: 'Explore the core features we deliver out of the box.',
};

export default function FeaturesPage() {
  return (
    <main className="py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="mb-6 text-3xl font-bold">Features</h1>
        <p className="mb-10 text-indigo-200/80">
          From fast foundations to scalable subscriptions, here are the highlights.
        </p>
      </div>
      <Features />
    </main>
  );
}
