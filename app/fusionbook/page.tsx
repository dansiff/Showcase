import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarCheck2, CheckCircle2, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { businesses } from "@/data/fusionbook/seed";
import "./fusionbook.css";

export const metadata: Metadata = {
  title: "FusionBook | Booking & No-Show Demo",
  description: "A branded online booking and no-show reduction demo for appointment businesses.",
};

export default function FusionBookPage() {
  return (
    <div className="fb-root">
      <div className="fb-demo-banner"><span /> DEMO — Sample data for illustration</div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/fusionbook" className="flex items-center gap-3 text-slate-900">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#155d49] text-white"><CalendarCheck2 size={20} /></span>
            <span className="text-lg font-semibold tracking-tight">FusionBook</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-[#155d49]">The Fusion Space</Link>
        </div>
      </header>

      <main className="fb-hub-main">
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-20">
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#167459]"><Sparkles size={15} /> Booking that respects everyone’s time</p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-.045em] text-slate-950 sm:text-6xl">A fuller calendar. Fewer empty chairs.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">FusionBook gives appointment businesses an easy way to take bookings, collect a deposit, send reminders, and refill a last-minute cancellation.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#demo-businesses" className="inline-flex items-center gap-2 rounded-lg bg-[#155d49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#104b3b]">Explore the demos <ArrowRight size={16} /></a>
              <span className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600">No login · No real payments</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_14px_45px_rgba(27,48,42,.08)] sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">Straightforward pricing</p>
            <div className="mt-4 flex items-end gap-2"><span className="text-6xl font-semibold tracking-[-.06em] text-slate-950">$300</span><span className="pb-2 text-sm text-slate-500">one-time setup</span></div>
            <div className="mt-1 text-2xl font-semibold text-[#155d49]">+ $49 / month</div>
            <div className="my-6 h-px bg-slate-100" />
            <div className="grid gap-3 text-sm text-slate-600">
              {[["One branded booking page",CalendarCheck2],["Automatic appointment reminders",Clock3],["Deposits and no-show policies",ShieldCheck],["Waitlist offers when a spot opens",CheckCircle2]].map(([label,Icon]) => {
                const ItemIcon = Icon as typeof CheckCircle2;
                return <div key={label as string} className="flex items-center gap-3"><ItemIcon size={16} className="text-[#16805f]" />{label as string}</div>;
              })}
            </div>
            <p className="mt-6 text-xs leading-5 text-slate-400">Pricing shown for this sample product. Demo interactions are local and illustrative.</p>
          </div>
        </section>

        <section id="demo-businesses" className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#16805f]">Two different businesses</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">One booking flow. Your brand.</h2></div>
              <p className="max-w-md text-sm leading-6 text-slate-500">Choose a public booking page or open its owner dashboard. Each demo has separate services, staff, clients, and appointment history.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {businesses.map((business) => (
                <article key={business.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="h-2" style={{ backgroundColor: business.branding.accent }} />
                  <div className="p-6 sm:p-7">
                    <div className="flex items-start gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-sm font-bold" style={{ backgroundColor: business.branding.accentSoft, color: business.branding.primary }}>{business.branding.logoMark}</span>
                      <div><p className="text-xs font-semibold uppercase tracking-[.13em] text-slate-400">{business.profile.trade} · {business.profile.location}</p><h3 className="mt-1 text-xl font-semibold text-slate-950">{business.profile.name}</h3><p className="mt-1 text-sm text-slate-500">{business.profile.tagline}</p></div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-50 px-3 py-1.5">{business.services.length} services</span>
                      <span className="rounded-full bg-slate-50 px-3 py-1.5">{business.staff.length} team members</span>
                      <span className="rounded-full bg-slate-50 px-3 py-1.5">{business.clients.length} sample clients</span>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href={`/book/${business.slug}`} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: business.branding.primary }}>Preview booking <ArrowRight size={15} /></Link>
                      <Link href={`/fusionbook/${business.slug}/dashboard`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Owner dashboard</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="fb-hub-footer"><Link href="/fusionbook" className="font-semibold text-slate-600">FusionBook</Link><span>Independent demo · Sample data only</span><Link href="/" className="text-slate-500 hover:text-slate-800">The Fusion Space</Link></footer>
    </div>
  );
}
