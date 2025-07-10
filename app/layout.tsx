import "./css/style.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode, ReactElement } from "react";
import { HeaderVisibilityProvider } from "@/components/layouts/LayoutContext";
import ClientLayoutShell from "@/components/layouts/ClientLayoutShell";

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

export const metadata = {
  title: "Sandoval Bro's",
  description: "A modern Websites as a service that is affordable.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${nacelle.variable} bg-gray-950 font-inter text-base text-gray-200 antialiased`}>
        <HeaderVisibilityProvider>
          <ClientLayoutShell>{children}</ClientLayoutShell>
        </HeaderVisibilityProvider>
      </body>
    </html>
  );
}
