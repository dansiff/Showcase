  
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
import FlashyButton from "@/components/FlashyButton";

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />
      <Testimonials />
          <Cta />
        
    </>
  );
}
