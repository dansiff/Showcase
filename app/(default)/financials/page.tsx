import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Statements - The Fusion Space Inc',
  description: 'A placeholder for financial disclosures. Contact us for details.'
};

export default function FinancialsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Financial Statements</h1>
      <p className="mt-4 text-indigo-200/80">
        We’ll publish summarized financial information here when ready. If you need anything sooner,
        email finance@thefusionspace.com.
      </p>
    </main>
  );
}
