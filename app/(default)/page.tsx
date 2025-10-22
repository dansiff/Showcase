  
export const metadata = {
  title: "Sandoval Bro's - Website As A Service",
  description: "Professional websites tailored to your business needs",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Cta from "@/components/cta";
import ClientsShowcase from "@/components/ClientsShowcase";

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />
      <ClientsShowcase />
      <Testimonials />
      <Cta />
    </>
  );
}
