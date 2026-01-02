// File: app/layout.tsx (Server Component Root Layout)
import "./css/style.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { HeaderProvider } from "@/components/layout/LayoutContext";
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
      <body className={`${inter.variable} ${nacelle.variable} bg-gray-950 font-inter text-base text-gray-200 antialiased overflow-x-hidden`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 px-3 py-2 rounded bg-indigo-600 text-white text-sm">Skip to content</a>
        <HeaderProvider>
          <div className="sticky top-0 z-40 backdrop-blur-md bg-gray-950/80 border-b border-gray-800" role="banner">
            <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 h-12" aria-label="Primary">
              <Link href="/" className="text-sm font-semibold tracking-wide text-indigo-300 hover:text-indigo-200">Fusion Space</Link>
              <div className="flex items-center gap-5 text-xs">
                <Link href="/media-showcase" className="text-gray-300 hover:text-indigo-300 transition-colors" aria-label="Go to media showcase gallery">Gallery</Link>
                <Link href="/game" className="text-gray-300 hover:text-pink-300 transition-colors" aria-label="Go to Snack Arcade games page">Arcade</Link>
                <Link href="/taco" className="text-gray-300 hover:text-amber-300 transition-colors" aria-label="Go to Taco ordering page">Tacos</Link>
                <Link href="/portal" className="text-gray-400 hover:text-gray-200" aria-label="Go to user portal hub">Portal</Link>
              </div>
            </nav>
          </div>
          <main id="main" role="main" className="min-h-screen" aria-live="polite">
            {children}
          </main>
        </HeaderProvider>
      </body>
    </html>
  );
}
