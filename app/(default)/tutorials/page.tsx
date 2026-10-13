import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tutorials - The Fusion Space Inc',
  description: 'Learn how to get the most out of our platform with step-by-step tutorials.'
};

export default function TutorialsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back to Home</Link>
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Tutorials</h1>
      <p className="mt-4 text-lg text-indigo-200/80">
        Step-by-step guides to help you build, customize, and launch your website.
      </p>

      <div className="mt-12 space-y-6">
        <TutorialItem
          title="Getting Started with The Fusion Space"
          description="Learn the basics of our platform and create your first page"
          duration="10 min"
          level="Beginner"
          href="/blog"
        />
        <TutorialItem
          title="Customizing Your Restaurant Theme"
          description="Personalize colors, fonts, and layouts to match your brand"
          duration="15 min"
          level="Intermediate"
          href="/blog"
        />
        <TutorialItem
          title="Setting Up Online Ordering"
          description="Configure payment processing and order management"
          duration="20 min"
          level="Intermediate"
          href="/blog"
        />
        <TutorialItem
          title="SEO Best Practices"
          description="Optimize your site for search engines and get discovered"
          duration="12 min"
          level="Beginner"
          href="/blog"
        />
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20">
        <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
        <p className="text-indigo-200/80 mb-6">
          Can't find what you're looking for? Our support team is here to help you succeed.
        </p>
        <Link href="/contact" className="inline-block px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors">
          Contact Support
        </Link>
      </div>
    </main>
  );
}

function TutorialItem({ title, description, duration, level, href }: { title: string; description: string; duration: string; level: string; href: string }) {
  return (
    <Link
      href={href}
      className="block p-6 rounded-xl border border-indigo-600/30 bg-indigo-950/30 hover:bg-indigo-900/40 hover:border-indigo-500/50 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-sm text-indigo-200/70 mb-3">{description}</p>
          <div className="flex items-center gap-4 text-xs text-indigo-300">
            <span className="px-2 py-1 rounded bg-indigo-900/50">{level}</span>
            <span>⏱️ {duration}</span>
          </div>
        </div>
        <div className="text-indigo-400">→</div>
      </div>
    </Link>
  );
}
