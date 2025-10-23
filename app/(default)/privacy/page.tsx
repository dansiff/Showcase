import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - The Fusion Space Inc',
  description: 'How we handle your data and privacy.'
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-6 text-indigo-200/80">
        We respect your privacy. This summary outlines our approach to collecting and using your data. A comprehensive legal policy can be added upon request.
      </p>
      <h2 className="mt-8 text-xl font-semibold">What we collect</h2>
      <p className="mt-2 text-indigo-200/80">Account info, usage data, and payment details as needed to provide our services.</p>
      <h2 className="mt-6 text-xl font-semibold">How we use it</h2>
      <p className="mt-2 text-indigo-200/80">Operate the platform, improve features, and support billing.</p>
      <h2 className="mt-6 text-xl font-semibold">Your choices</h2>
      <p className="mt-2 text-indigo-200/80">You can access, update, or delete certain data via your account or by contacting us.</p>
    </main>
  );
}
