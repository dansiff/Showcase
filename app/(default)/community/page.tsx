import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community - The Fusion Space Inc',
  description: 'Find ways to connect and participate.'
};

export default function CommunityPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Community</h1>
      <p className="mt-4 text-indigo-200/80">We’re building out our community spaces. For now, reach us via contact@thefusionspace.com.</p>
    </main>
  );
}
