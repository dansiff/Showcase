import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security - The Fusion Space Inc',
  description: 'Report vulnerabilities and view our security posture.'
};

export default function SecurityPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Security</h1>
      <p className="mt-4 text-indigo-200/80">We take security seriously. If you believe you have found a vulnerability, please email security@thefusionspace.com. Include steps to reproduce and any relevant details.</p>
    </main>
  );
}
