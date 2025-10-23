import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - The Fusion Space Inc',
  description: 'Insights, updates, and stories from our team.'
};

export default function BlogIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-4 text-indigo-200/80">Posts coming soon. In the meantime, explore our Changelog and Features.</p>
    </main>
  );
}
