import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integrations - The Fusion Space Inc',
  description: 'Integrate with the tools you already use.'
};

export default function IntegrationsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Integrations</h1>
      <p className="mt-4 text-indigo-200/80">Stripe, Supabase, NextAuth, and more. Let us know what else you need.</p>
    </main>
  );
}
