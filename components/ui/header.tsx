// components/ui/header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./logo";
import { usePathname } from "next/navigation";


const pathname = usePathname();


type HeaderVariant = "default" | "taco" | "transparent" | "light";

interface HeaderProps {
  logo?: React.ReactNode;
  links?: { href: string; label: string }[];
  className?: string;
  isAuthenticated?: boolean;
  userName?: string;
  rightContent?: React.ReactNode;
  variant?: HeaderVariant;
}

function resolveHeaderStyles(variant: HeaderVariant = "default") {
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
        link: "text-white hover:opacity-80 transition",
        button: "bg-white text-black hover:bg-gray-200",
      };
    case "light":
      return {
        container: "bg-white/80 text-gray-800 border-b border-gray-200 shadow-sm",
        link: "text-gray-800 hover:text-black",
        button: "bg-gray-200 text-black hover:bg-gray-300",
      };
    case "default":
    default:
      return {
        container: "bg-gray-900 text-white shadow-md border-b border-gray-800",
        link: "text-white hover:text-indigo-300 transition",
        button: "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold",
      };
  }
}


export default function Header({
  logo = <Logo />,
  links = [
    { href: "/signin", label: "Sign In" },
    { href: "/signup", label: "Register" },
  ],
  className = "",
  isAuthenticated = false,
  userName,
  rightContent,
  variant = "default",
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const styles = resolveHeaderStyles(variant);

  return (
    <header className={`z-30 mt-2 w-full md:mt-5 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`relative flex h-14 items-center justify-between gap-3 rounded-2xl px-3 ${styles.container}`}>
          {/* Branding */}
          <div className="flex flex-1 items-center">
            <Link href="/" aria-label="Homepage">
              {logo}
            </Link>
          </div>

          {/* Desktop Links */}
          <ul className="hidden flex-1 items-center justify-end gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <li>
                  <Link href="/dashboard" className={styles.link}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/signout" className={`btn-sm ${styles.button}`}>
                    Sign Out
                  </Link>
                </li>
              </>
            ) : (
              links.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className={`btn-sm ${idx === links.length - 1 ? styles.button : styles.link}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))
            )}
            {rightContent && <li>{rightContent}</li>}
          </ul>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>

          {/* Mobile Menu */}
          {mobileOpen && (
            <ul className={`absolute top-full left-0 right-0 z-40 flex flex-col px-4 py-4 shadow-lg md:hidden ${styles.container}`}>
              {links.map((link, idx) => (
                <li key={idx} className="mb-2">
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
