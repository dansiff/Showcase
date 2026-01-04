  
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
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
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
      <section className="max-w-6xl mx-auto mt-8 px-4 grid gap-4 md:grid-cols-3">
        <Link href="/generator" className="group relative rounded-xl p-6 aurora-card bg-gradient-to-br from-purple-800/40 to-pink-800/40 border border-purple-600/30 transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_60%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🚀</span>
              <h3 className="text-xl font-semibold text-amber-200">AI Website Generator</h3>
              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-400/30">FREE</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">Create professional websites in minutes. Start free, upgrade for advanced features. AI-powered builder with instant deployment.</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded bg-purple-500/30 text-purple-200 border border-purple-400/40 group-hover:bg-purple-400/40 transition-colors">
                <span>Build Now</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <Link href="/generator/pricing" onClick={(e) => e.stopPropagation()} className="text-xs text-purple-300 hover:text-purple-200 underline">
                View Pricing
              </Link>
            </div>
          </div>
        </Link>
        <Link href="/game" className="group relative rounded-xl p-6 aurora-card bg-gradient-to-br from-indigo-800/40 to-purple-800/40 border border-indigo-600/30 transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎮</span>
              <h3 className="text-xl font-semibold text-amber-200">Snack Arcade</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">Explore mini canvas & logic demos (Snake, Invaders, Tic Tac Taco) — showcases interaction, animation & state.</p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs px-3 py-1 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 group-hover:bg-indigo-400/40 transition-colors">
              <span>Enter Arcade</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </Link>
        <Link href="/taco" className="group relative rounded-xl p-6 aurora-card bg-gradient-to-br from-amber-800/30 to-red-800/40 border border-amber-600/30 transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-25 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.4),transparent_60%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌮</span>
              <h3 className="text-xl font-semibold text-amber-300">Order Tacos</h3>
            </div>
            <p className="text-sm text-amber-100/90 leading-relaxed">Live prototype ordering flow — build a cart, set pickup time, server-side persistence via Prisma.</p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs px-3 py-1 rounded bg-amber-500/30 text-amber-100 border border-amber-300/40 group-hover:bg-amber-400/40 transition-colors">
              <span>Start Order</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </Link>
      </section>
      <Workflows />
      <Features />
      <Suspense
        fallback={
          <section className="max-w-6xl mx-auto mt-12 px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aurora-card p-4">
                  <Skeleton className="h-24 w-full rounded-xl mb-3" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </section>
        }
      >
        <ClientsShowcase />
      </Suspense>
      <Testimonials />
      <Cta />
    </>
  );
}
