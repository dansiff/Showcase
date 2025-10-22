  
export const metadata = {
    title: "Website As A Service",
  description: "Main Marketing page",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Cta from "@/components/cta";
import TacoShowcaseButton from "../../components/TacoShowcaseButton";
import Link from "next/link";


export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      {/* Quick access to a creator profile (replace 'demo' with an existing user's name) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <div className="rounded-md bg-indigo-900/20 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Preview a creator profile</h3>
            <p className="text-sm text-gray-400">Replace 'demo' with a real creator name from your database.</p>
          </div>
          <Link href="/creator/demo" className="btn bg-indigo-600 text-white px-4 py-2 rounded-md">
            Open /creator/demo
          </Link>
        </div>
      </section>
      <Workflows />
      <Features />
      <Testimonials />
          <Cta />
          <TacoShowcaseButton />
    </>
  );
}
