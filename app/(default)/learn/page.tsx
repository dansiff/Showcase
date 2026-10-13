import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Learn - The Fusion Space Inc',
  description: 'Educational resources to help you master web development and business growth.'
};

export default function LearnPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back to Home</Link>
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Learning Center</h1>
      <p className="mt-4 text-lg text-indigo-200/80 max-w-3xl">
        Master modern web development, business strategy, and digital marketing with our comprehensive learning resources.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <LearningPathCard
          title="Web Development Basics"
          description="Learn HTML, CSS, JavaScript, and React fundamentals"
          level="Beginner"
          duration="8 weeks"
          lessons={24}
          href="/tutorials"
        />
        <LearningPathCard
          title="Restaurant Website Mastery"
          description="Build and optimize restaurant websites that convert"
          level="Intermediate"
          duration="4 weeks"
          lessons={16}
          href="/tutorials"
        />
        <LearningPathCard
          title="Digital Marketing Essentials"
          description="SEO, social media, and online advertising strategies"
          level="Beginner"
          duration="6 weeks"
          lessons={20}
          href="/blog"
        />
        <LearningPathCard
          title="Advanced Customization"
          description="Master theming, plugins, and custom integrations"
          level="Advanced"
          duration="10 weeks"
          lessons={32}
          href="/tutorials"
        />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Quick Start Guides</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <GuideCard
            title="Launch in 30 Minutes"
            description="Get your website online fast"
            icon="⚡"
            href="/tutorials"
          />
          <GuideCard
            title="SEO Checklist"
            description="Optimize for search engines"
            icon="🔍"
            href="/blog"
          />
          <GuideCard
            title="Payment Setup"
            description="Accept online payments"
            icon="💳"
            href="/pricing"
          />
        </div>
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20">
        <h2 className="text-2xl font-bold mb-3">Ready to Build Something Amazing?</h2>
        <p className="text-indigo-200/80 mb-6">
          Join thousands of businesses using The Fusion Space to create stunning websites.
        </p>
        <div className="flex gap-4">
          <Link href="/signup" className="inline-block px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors">
            Get Started Free
          </Link>
          <Link href="/contact" className="inline-block px-6 py-3 rounded-lg border border-indigo-500/50 hover:bg-indigo-900/40 text-indigo-200 font-semibold transition-colors">
            Talk to Sales
          </Link>
        </div>
      </div>
    </main>
  );
}

function LearningPathCard({ title, description, level, duration, lessons, href }: { title: string; description: string; level: string; duration: string; lessons: number; href: string }) {
  return (
    <Link
      href={href}
      className="group relative rounded-xl p-6 border border-indigo-600/30 bg-indigo-950/30 hover:bg-indigo-900/40 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/10"
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-indigo-200/70 mb-4">{description}</p>
      <div className="flex items-center gap-4 text-xs text-indigo-300">
        <span className="px-2 py-1 rounded bg-indigo-900/50">{level}</span>
        <span>⏱️ {duration}</span>
        <span>📚 {lessons} lessons</span>
      </div>
      <div className="mt-4 text-indigo-400 text-sm font-medium group-hover:text-indigo-300">
        Start Learning →
      </div>
    </Link>
  );
}

function GuideCard({ title, description, icon, href }: { title: string; description: string; icon: string; href: string }) {
  return (
    <Link
      href={href}
      className="group p-6 rounded-xl border border-indigo-600/30 bg-indigo-950/30 hover:bg-indigo-900/40 hover:border-indigo-500/50 transition-all"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-indigo-200/70">{description}</p>
    </Link>
  );
}
