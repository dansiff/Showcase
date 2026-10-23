import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const linkGroups = [
  {
    title: "Explore",
    links: [
      { label: "The offer", href: "/#offer" },
      { label: "How it works", href: "/#process" },
      { label: "Our work", href: "/#work" },
    ],
  },
  {
    title: "Examples & tools",
    links: [
      { label: "Morelia Restaurant", href: "/morelia" },
      { label: "Website generator", href: "/generator" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/About" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#101915] text-emerald-50">
      <div className="mx-auto max-w-6xl px-5 pb-7 pt-12 lg:px-8 lg:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))] lg:gap-8">
          <div className="max-w-xs">
            <Link href="/" className="font-nacelle text-xl font-semibold text-white">
              The Fusion Space<span className="text-amber-400">.</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-emerald-50/65">
              Professional websites, hosting, and domain management for one clear price.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 transition-colors hover:text-amber-200"
            >
              Start a project <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {linkGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-semibold text-white">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-emerald-50/60 transition-colors hover:text-amber-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-emerald-50/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} The Fusion Space Inc</span>
          <span>Websites without the technical headaches.</span>
        </div>
      </div>
    </footer>
  );
}