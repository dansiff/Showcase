// app/layout.tsx
import "./css/style.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/ui/header";
import {
  useHeaderVisibility,
  HeaderVisibilityProvider,
} from "@/components/layouts/LayoutContext";
import type { ReactNode, ReactElement } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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

// Must be declared **outside client component**
export const metadata = {
  title: "Sandoval Bro's",
  description: "A modern, modular websites service that is affordable and local.",
};

function LayoutShell({ children }: { children: ReactNode }): ReactElement {
  const showHeader = useHeaderVisibility();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${nacelle.variable} bg-gray-950 font-inter text-base text-gray-200 antialiased`}>
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          {showHeader && <Header />}
          {children}
        </div>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <HeaderVisibilityProvider>
      <LayoutShell>{children}</LayoutShell>
    </HeaderVisibilityProvider>
  );
}
