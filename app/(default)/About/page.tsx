import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe2, Headphones, LockKeyhole, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "About | The Fusion Space Inc",
  description: "Professional websites and practical support for local businesses.",
};

const services = [
  [Globe2, "Domain management", "Help connecting and managing the web address customers use to find your business."],
  [Server, "Hosting", "A home for your website, included with the current three-year package."],
  [LockKeyhole, "SSL", "Secure HTTPS for your website and its visitors."],
  [Headphones, "Basic support", "Practical help and small updates to keep your website useful."],
] as const;

export default function AboutPage() {
  return (
    <main className="bg-[#f6f1e7] text-[#18261e]">
      <section className="bg-[#101915] px-5 py-20 text-white sm:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
            About The Fusion Space
          </p>
          <h1 className="mt-4 max-w-3xl font-nacelle text-4xl font-semibold leading-tight sm:text-6xl">
            A professional website, without the technical headaches.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/70">
            We help local businesses get a clear, professional home online. We design and build the site, then take care of the practical details that keep it available to customers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b07b22]">What we handle</p>
          <h2 className="mt-3 font-nacelle text-3xl font-semibold sm:text-4xl">
            One connected service for your online presence.
          </h2>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(([Icon, title, description]) => (
            <article key={title} className="border-t-2 border-[#c58d2e] pt-5">
              <Icon className="h-6 w-6 text-[#1f5c43]" aria-hidden="true" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#537460]">{description}</p>
            </article>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-[#18261e]/15 pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-[#537460]">
            The current package is $200 for three years, with $25 per year after that. See the full package details before getting started.
          </p>
          <Link
            href="/#offer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#1f5c43] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#174932]"
          >
            See the offer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}