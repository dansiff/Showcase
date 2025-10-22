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
        button: "bg-red-600 hover:bg-red-500 text-white font-semibold",
      };
    case "transparent":
      return {
        container: "bg-transparent text-white shadow-none",
        link: "text-white/90 hover:text-white",
        button: "bg-white text-gray-900 hover:bg-gray-100",
      };
    case "light":
      return {
        container: "supports-[backdrop-filter]:bg-white/70 bg-white text-gray-900 border-b border-gray-200 backdrop-blur",
        link: "text-gray-700 hover:text-gray-900",
        button: "bg-gray-900 text-white hover:bg-gray-800",
      };
    case "default":
    default:
      return {
        container: "bg-gray-900 text-white shadow-md border-b border-gray-800",
        link: "text-white/90 hover:text-white",
        button: "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold",
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`relative flex h-16 items-center justify-between gap-4 rounded-xl px-4 ${styles.container}`}>
          {/* Branding */}
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Homepage" className="inline-flex items-center gap-2">
              {logo}
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${styles.link} ${active ? "ring-1 ring-inset ring-gray-300/40" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          {config.cta && (
            <div className="hidden md:block">
              <Link href={config.cta.href} className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${styles.button}`}>
                {config.cta.label}
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
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
          <div className={`mx-auto max-w-7xl px-4 sm:px-6 pb-4` }>
            <div className={`rounded-xl px-4 py-3 ${styles.container}`}>
              <nav className="grid gap-2">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className={`rounded-md px-3 py-2 text-sm font-medium ${styles.link}`}>
                    {link.label}
                  </Link>
                ))}
                {config.cta && (
                  <Link href={config.cta.href} className={`mt-1 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${styles.button}`}>
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
