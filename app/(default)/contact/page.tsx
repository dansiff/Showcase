import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - The Fusion Space Inc',
  description: 'Get in touch with our team.'
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-4 text-indigo-200/80">Email us at contact@thefusionspace.com or book a call through our intake form.</p>
    </main>
  );
}
