import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Templates - The Fusion Space Inc',
  description: 'Browse our collection of website templates and themes.'
};

export default function TemplatesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back to Home</Link>
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Website Templates</h1>
      <p className="mt-4 text-lg text-indigo-200/80 max-w-3xl">
        Explore our curated collection of modern, responsive website templates. From restaurants to gaming arcades, we've got you covered.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <TemplateCard
          title="Taco Restaurant"
          description="Vibrant food ordering system with custom theming"
          href="/taco"
          icon="🌮"
        />
        <TemplateCard
          title="Sushi Bar"
          description="Elegant sushi ordering experience"
          href="/sushi"
          icon="🍣"
        />
        <TemplateCard
          title="Italian Restaurant"
          description="Classic Italian dining menu system"
          href="/italian"
          icon="🍝"
        />
        <TemplateCard
          title="Game Arcade"
          description="Interactive gaming showcase platform"
          href="/game"
          icon="🎮"
        />
        <TemplateCard
          title="Media Showcase"
          description="Beautiful gallery for content creators"
          href="/media-showcase"
          icon="📸"
        />
        <TemplateCard
          title="Coming Soon"
          description="More templates in development"
          href="#"
          icon="✨"
          disabled
        />
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20">
        <h2 className="text-2xl font-bold mb-3">Need a Custom Template?</h2>
        <p className="text-indigo-200/80 mb-6">
          Can't find what you're looking for? We can create a custom template tailored to your specific business needs.
        </p>
        <Link href="/contact" className="inline-block px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors">
          Contact Us
        </Link>
      </div>
    </main>
  );
}

function TemplateCard({ title, description, href, icon, disabled }: { title: string; description: string; href: string; icon: string; disabled?: boolean }) {
  const Component = disabled ? 'div' : Link;
  return (
    <Component
      href={href}
      className={`group relative rounded-xl p-6 border transition-all ${
        disabled
          ? 'border-gray-700 bg-gray-900/40 opacity-60 cursor-not-allowed'
          : 'border-indigo-600/30 bg-indigo-950/30 hover:bg-indigo-900/40 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10'
      }`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-indigo-200/70">{description}</p>
      {!disabled && (
        <div className="mt-4 text-indigo-400 text-sm font-medium group-hover:text-indigo-300">
          View Template →
        </div>
      )}
    </Component>
  );
}
