  
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
      <Workflows />
      <Features />
      <ClientsShowcase />
      <Testimonials />
      <Cta />
    </>
  );
}
