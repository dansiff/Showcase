import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - The Fusion Space Inc',
  description: 'Terms and conditions for using our services.'
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-6 text-indigo-200/80">
        These terms govern your use of The Fusion Space Inc products and services. This is a simplified placeholder; a full legal version can be added upon request.
      </p>
      <h2 className="mt-8 text-xl font-semibold">1. Use of Service</h2>
      <p className="mt-2 text-indigo-200/80">You agree to use the service responsibly and comply with applicable laws.</p>
      <h2 className="mt-6 text-xl font-semibold">2. Accounts</h2>
      <p className="mt-2 text-indigo-200/80">You are responsible for maintaining the security of your account.</p>
      <h2 className="mt-6 text-xl font-semibold">3. Payments</h2>
      <p className="mt-2 text-indigo-200/80">All fees are billed as stated on our Pricing page or in signed proposals.</p>
      <h2 className="mt-6 text-xl font-semibold">4. Content</h2>
      <p className="mt-2 text-indigo-200/80">You retain rights to your content; you grant us the licenses needed to operate the service.</p>
      <h2 className="mt-6 text-xl font-semibold">5. Liability</h2>
      <p className="mt-2 text-indigo-200/80">Service is provided as-is to the fullest extent permitted by law.</p>
    </main>
  );
}
