import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | The Fusion Space Inc",
  description: "Tell us about your business website project.",
};

const contactEmail = "contact@thefusionspace.com";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f6f1e7] text-[#18261e]">
      <section className="bg-[#101915] px-5 py-20 text-white sm:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
            Start a project
          </p>
          <h1 className="mt-4 max-w-3xl font-nacelle text-4xl font-semibold leading-tight sm:text-6xl">
            Tell us what your business needs online.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/70">
            Share a little about your business, the customers you serve, and what you want your website to do. We will follow up by email.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <div>
          <h2 className="font-nacelle text-3xl font-semibold">One simple package</h2>
          <p className="mt-4 max-w-xl leading-7 text-[#537460]">
            The current offer is $200 for the first three years, including the website, hosting, domain management, and SSL. After that, ongoing service is $25 per year.
          </p>
          <Link
            href="/#offer"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-[#1f5c43] hover:text-[#174932]"
          >
            Review what is included <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="border-t-2 border-[#c58d2e] pt-6">
          <Mail className="h-7 w-7 text-[#b07b22]" aria-hidden="true" />
          <h2 className="mt-4 font-nacelle text-2xl font-semibold">Email us</h2>
          <p className="mt-3 text-sm leading-6 text-[#537460]">
            Include your business name, the best way to reach you, and a few details about the site you have in mind.
          </p>
          <a
            href={`mailto:${contactEmail}?subject=Website%20project%20inquiry`}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#1f5c43] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#174932]"
          >
            {contactEmail}
          </a>
        </div>
      </section>
    </main>
  );
}