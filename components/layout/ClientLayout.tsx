// components/layout/ClientLayout.tsx
"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useHeaderVisibility } from "./LayoutContext";

interface ClientLayoutProps {
  children: ReactNode;
  showHeader?: boolean; // Optional prop to override context
}

export default function ClientLayout({ children, showHeader }: ClientLayoutProps) {
  const { isHeaderVisible, setHeaderVisible } = useHeaderVisibility();
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith("/taco") || !showHeader; // Hide if /taco or showHeader is false

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && isHeaderVisible && (
        <header className="bg-gray-900 text-white p-4">
          <h1>Sandoval Bro's</h1>
          <nav>
            <a href="/" className="mr-4">Home</a>
            <a href="/About" className="mr-4">About</a>
            <a href="/services">Services</a>
            <a href="/taco">Taco</a>
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