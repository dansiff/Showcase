  
export const metadata = {
  title: "The Fusion Space Inc — Website As A Service",
  description: "Professional websites tailored to your business needs",
};

import PageIllustration from "@/components/page-illustration";
import Script from "next/script";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Cta from "@/components/cta";
import ClientsShowcase from "@/components/ClientsShowcase";
import Link from 'next/link';

export default function Home() {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-5KDKFXLS";
  const isProd = process.env.NODE_ENV === "production";
  return (
    <>
      {/* Google Tag Manager – only on homepage and only in production */}
      {isProd && (
        <>
          <Script id="gtm-base" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}
      <PageIllustration />
      <Hero />
      {/* Quick internal experience CTAs */}
      <section className="max-w-6xl mx-auto mt-8 px-4 grid gap-4 md:grid-cols-2">
        <Link href="/game" className="group relative rounded-xl p-6 bg-gradient-to-br from-indigo-800/70 to-purple-800/70 border border-indigo-600/40 hover:border-pink-400/60 transition-colors">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
          <h3 className="text-xl font-semibold text-amber-200 mb-1">Play Snack Arcade</h3>
          <p className="text-sm text-slate-300 leading-relaxed">Explore mini canvas & logic demos (Snake, Invaders, Tic Tac Taco) — showcases interaction, animation & state.</p>
          <div className="mt-4 inline-block text-xs px-3 py-1 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">Enter Arcade →</div>
        </Link>
        <Link href="/taco" className="group relative rounded-xl p-6 bg-gradient-to-br from-amber-800/40 to-red-800/50 border border-amber-600/40 hover:border-red-400/60 transition-colors">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-25 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.4),transparent_60%)]" />
          <h3 className="text-xl font-semibold text-amber-300 mb-1">Order Pickup Tacos</h3>
          <p className="text-sm text-amber-100/90 leading-relaxed">Live prototype ordering flow — build a cart, set pickup time, server-side persistence via Prisma.</p>
          <div className="mt-4 inline-block text-xs px-3 py-1 rounded bg-amber-500/30 text-amber-100 border border-amber-300/40">Start Order →</div>
        </Link>
      </section>
      <Workflows />
      <Features />
      <ClientsShowcase />
      <Testimonials />
      <Cta />
    </>
  );
}
