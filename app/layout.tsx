// File: app/layout.tsx (Server Component Root Layout)
import "./css/style.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { HeaderProvider } from "@/components/layout/LayoutContext";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import Link from 'next/link';
// import ClientLayoutShell from "@/components/layout/ClientLayoutShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const nacelle = localFont({
  src: [
    { path: "../public/fonts/nacelle-regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/nacelle-italic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/nacelle-semibold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/nacelle-semibolditalic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-nacelle",
  display: "swap",
});

export const metadata = {
  title: "The Fusion Space Inc",
  description: "Modern websites as a service by The Fusion Space Inc.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} ${nacelle.variable} bg-gray-950 font-inter text-base text-gray-200 antialiased overflow-x-hidden`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 px-3 py-2 rounded bg-indigo-600 text-white text-sm">Skip to content</a>
        <AnalyticsProvider>
          <HeaderProvider>
            <main id="main" role="main" className="min-h-screen" aria-live="polite">
              {children}
            </main>
          </HeaderProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
