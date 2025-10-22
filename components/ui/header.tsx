// components/ui/header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./logo";
import { usePathname } from "next/navigation";
import { useHeader } from "@/components/layout/LayoutContext";

type HeaderVariant = "default" | "taco" | "transparent" | "light";

interface HeaderProps {
  logo?: React.ReactNode;
  className?: string;
}

function resolveHeaderStyles(variant: HeaderVariant = "light") {
  switch (variant) {
    case "taco":
      return {
        container: "bg-yellow-900/90 text-yellow-100 border-b-2 border-yellow-700 shadow-md backdrop-blur-sm",
        link: "text-yellow-100 hover:text-white transition-all duration-200",
        button: "bg-red-600 hover:bg-red-500 text-white font-semibold shadow-lg",
      };
    case "transparent":
      return {
        container: "bg-transparent text-white shadow-none",
        link: "text-white/90 hover:text-white transition-colors duration-200",
        button: "bg-white text-gray-900 hover:bg-gray-100 shadow-lg",
      };
    case "light":
      return {
        container: "bg-white/80 backdrop-blur-md text-gray-900 border-b border-gray-200/50 shadow-sm",
        link: "text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium",
        button: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/50 font-semibold",
      };
    case "default":
    default:
      return {
        container: "bg-gray-900/95 backdrop-blur-md text-white shadow-lg border-b border-gray-800",
        link: "text-gray-300 hover:text-white transition-colors duration-200 font-medium",
        button: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg hover:shadow-indigo-500/50",
      };
  }
}

export default function Header({ logo = <Logo />, className = "" }: HeaderProps) {
  const { config } = useHeader();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const styles = resolveHeaderStyles((config.variant as HeaderVariant) || "light");
  const links = config.links || [];

  if (config.show === false) return null;

  return (
    <header className={`sticky top-0 z-40 w-full ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2">
        <div className={`relative flex h-16 items-center justify-between gap-4 rounded-2xl px-6 transition-all ${styles.container}`}>
          {/* Branding */}
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Homepage" className="inline-flex items-center gap-2 transition-transform hover:scale-105">
              {logo}
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-4 py-2 text-sm ${styles.link} ${
                    active ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          {config.cta && (
            <div className="hidden md:block">
              <Link 
                href={config.cta.href} 
                className={`inline-flex items-center rounded-lg px-6 py-2.5 text-sm transition-all hover:scale-105 ${styles.button}`}
              >
                {config.cta.label}
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className={`inline-flex items-center justify-center rounded-lg p-2 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${styles.link}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="md:hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-4">
            <div className={`rounded-2xl px-4 py-3 ${styles.container}`}>
              <nav className="grid gap-2">
                {links.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={`rounded-lg px-4 py-2.5 text-sm transition-colors ${styles.link}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {config.cta && (
                  <Link 
                    href={config.cta.href} 
                    className={`mt-2 inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm ${styles.button}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {config.cta.label}
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
