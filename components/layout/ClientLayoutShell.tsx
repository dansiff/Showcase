// components/layouts/clientlayoutshells.tsx
"use client";
import { usePathname } from "next/navigation";
import { useHeaderVisibility } from "@/components/layout/LayoutContext";
import Link from "next/link";
import { ReactNode } from "react";

export default function ClientLayoutShells({ children }: { children: ReactNode }) {
  const { isHeaderVisible } = useHeaderVisibility();
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith("/taco"); // Updated to match renamed folder

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && isHeaderVisible && (
        <header className="bg-gray-900 text-white p-4">
          <h1>Sandoval Bro's</h1>
         <nav>
  <Link href="/" className="mr-4">Home</Link>
  <Link href="/About" className="mr-4">About</Link>
  <Link href="/Catalog">Services</Link>
  <Link href="/taco"></Link>
</nav>
        </header>
      )}
      <main className="container mx-auto p-4 flex-grow">{children}</main>
      <footer className="bg-gray-900 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Sandoval Bro's. All rights reserved.</p>
      </footer>
    </div>
  );
}