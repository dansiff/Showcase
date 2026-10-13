import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Knowledge Base - The Fusion Space Inc',
  description: 'Find answers to common questions and explore our documentation.'
};

export default function KnowledgeBasePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back to Home</Link>
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Knowledge Base</h1>
      <p className="mt-4 text-lg text-indigo-200/80">
        Find answers, learn best practices, and explore our documentation.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <CategoryCard
          title="Getting Started"
          description="Learn the basics and set up your first website"
          icon="🚀"
          articleCount={12}
          href="/tutorials"
        />
        <CategoryCard
          title="Customization"
          description="Customize themes, layouts, and branding"
          icon="🎨"
          articleCount={18}
          href="/tutorials"
        />
        <CategoryCard
          title="Payments & Billing"
          description="Manage subscriptions and payment processing"
          icon="💳"
          articleCount={8}
          href="/pricing"
        />
        <CategoryCard
          title="Integrations"
          description="Connect with third-party services and APIs"
          icon="🔌"
          articleCount={15}
          href="/integrations"
        />
        <CategoryCard
          title="Troubleshooting"
          description="Solve common issues and technical problems"
          icon="🔧"
          articleCount={22}
          href="/contact"
        />
        <CategoryCard
          title="Best Practices"
          description="Tips for SEO, performance, and growth"
          icon="⭐"
          articleCount={10}
          href="/blog"
        />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
        <div className="space-y-4">
          <ArticleLink
            title="How do I change my website theme?"
            category="Customization"
            href="/tutorials"
          />
          <ArticleLink
            title="Setting up Stripe for payments"
            category="Payments"
            href="/pricing"
          />
          <ArticleLink
            title="Connecting a custom domain"
            category="Getting Started"
            href="/contact"
          />
          <ArticleLink
            title="Optimizing images for faster loading"
            category="Best Practices"
            href="/blog"
          />
        </div>
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20">
        <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
        <p className="text-indigo-200/80 mb-6">
          Can't find what you're looking for? Our support team is ready to assist you.
        </p>
        <Link href="/contact" className="inline-block px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors">
          Contact Support
        </Link>
      </div>
    </main>
  );
}

function CategoryCard({ title, description, icon, articleCount, href }: { title: string; description: string; icon: string; articleCount: number; href: string }) {
  return (
    <Link
      href={href}
      className="group relative rounded-xl p-6 border border-indigo-600/30 bg-indigo-950/30 hover:bg-indigo-900/40 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/10"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-indigo-200/70 mb-3">{description}</p>
      <div className="text-xs text-indigo-300">{articleCount} articles</div>
    </Link>
  );
}

function ArticleLink({ title, category, href }: { title: string; category: string; href: string }) {
  return (
    <Link
      href={href}
      className="block p-4 rounded-lg border border-indigo-600/20 bg-indigo-950/20 hover:bg-indigo-900/30 hover:border-indigo-500/40 transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="font-medium mb-1">{title}</h4>
          <span className="text-xs text-indigo-300">{category}</span>
        </div>
        <div className="text-indigo-400">→</div>
      </div>
    </Link>
  );
}
