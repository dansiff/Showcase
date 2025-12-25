// components/ui/header.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./logo";
import { usePathname } from "next/navigation";
import { useHeader } from "@/components/layout/LayoutContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { SignOutButton } from "@/components/SignOutButton";

type HeaderVariant = "default" | "taco" | "transparent" | "light" | "aurora";

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
        active: "bg-yellow-800/60 text-white border border-yellow-600/50",
      };
    case "transparent":
      return {
        container: "bg-transparent text-white shadow-none",
        link: "text-white/90 hover:text-white transition-colors duration-200",
        button: "bg-white text-gray-900 hover:bg-gray-100 shadow-lg",
        active: "bg-white/20 text-white",
      };
    case "light":
      return {
        container: "bg-white/80 backdrop-blur-md text-gray-900 border-b border-gray-200/50 shadow-sm",
        link: "text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium",
        button: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/50 font-semibold",
        active: "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm",
      };
    case "aurora":
      return {
        container:
          "relative z-0 overflow-hidden bg-slate-950/90 backdrop-blur-xl text-slate-50 border border-indigo-500/20 shadow-[0_12px_50px_-28px_rgba(99,102,241,0.9)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:content-[''] after:bg-[radial-gradient(circle_at_12%_20%,rgba(99,102,241,0.18),transparent_36%),radial-gradient(circle_at_82%_10%,rgba(236,72,153,0.16),transparent_34%),radial-gradient(circle_at_20%_90%,rgba(14,165,233,0.12),transparent_42%)]",
        link: "text-slate-200 hover:text-white transition-colors duration-200 font-medium",
        button: "bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 text-slate-900 hover:from-sky-300 hover:via-indigo-400 hover:to-fuchsia-400 shadow-[0_10px_30px_-12px_rgba(59,130,246,0.75)]",
        active: "bg-white/10 text-white border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
      };
    case "default":
    default:
      return {
        container: "bg-gray-900/95 backdrop-blur-md text-white shadow-lg border-b border-gray-800",
        link: "text-gray-300 hover:text-white transition-colors duration-200 font-medium",
        button: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg hover:shadow-indigo-500/50",
        active: "bg-white/10 text-white border border-white/10",
      };
  }
}

export default function Header({ logo = <Logo />, className = "" }: HeaderProps) {
  const { config } = useHeader();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const styles = resolveHeaderStyles((config.variant as HeaderVariant) || "light");
  const links = config.links || [];

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      setIsSignedIn(!!session);
    };

    checkAuth();
  }, [pathname]);

  if (config.show === false) return null;

  return (
    <header className={`sticky top-0 z-40 w-full ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
        <div className={`relative flex h-14 items-center justify-between gap-4 rounded-xl px-6 transition-all ${styles.container}`}>
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
                  className={`aurora-ring rounded-lg px-3 py-2 text-sm transition-colors ${styles.link} ${
                    active ? styles.active ?? "" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA - Show sign out button if signed in, otherwise show default CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link 
                  href="/portal" 
                  className={`inline-flex items-center rounded-lg px-6 py-2.5 text-sm transition-all hover:scale-105 ${styles.button}`}
                >
                  Portal
                </Link>
                <SignOutButton className="!bg-transparent !border-gray-300" />
              </>
            ) : (
              config.cta && (
                <Link 
                  href={config.cta.href} 
                  className={`inline-flex items-center rounded-lg px-6 py-2.5 text-sm transition-all hover:scale-105 ${styles.button}`}
                >
                  {config.cta.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`aurora-ring inline-flex items-center justify-center rounded-lg p-2 md:hidden transition-colors ${styles.link}`}
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
          <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-3 pt-2">
            <div className={`rounded-xl px-4 py-3 ${styles.container}`}>
              <nav className="grid gap-2">
                {links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className={`aurora-ring rounded-lg px-4 py-2.5 text-sm transition-colors ${styles.link} ${
                        active ? styles.active ?? "" : ""
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                {isSignedIn ? (
                  <>
                    <Link 
                      href="/portal" 
                      className={`mt-2 inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm ${styles.button}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      Portal
                    </Link>
                    <div className="mt-2">
                      <SignOutButton className="w-full" />
                    </div>
                  </>
                ) : (
                  config.cta && (
                    <Link 
                      href={config.cta.href} 
                      className={`mt-2 inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm ${styles.button}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {config.cta.label}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
