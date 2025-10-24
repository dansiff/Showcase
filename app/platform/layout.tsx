// app/platform/layout.tsx
// Layout for the creator/fan platform homepage

import { Inter } from "next/font/google";
import Link from "next/link";
import { Sparkles, Home, LogIn, UserPlus } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} font-inter antialiased`}>
      {/* Platform Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/platform" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                FusionSpace
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/fan/discover"
                className="text-indigo-200/80 hover:text-white transition-colors text-sm font-medium"
              >
                Discover
              </Link>
              <Link
                href="/creator/demo"
                className="text-indigo-200/80 hover:text-white transition-colors text-sm font-medium"
              >
                For Creators
              </Link>
              <Link
                href="/"
                className="flex items-center gap-1 text-indigo-200/80 hover:text-white transition-colors text-sm font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Main Site</span>
              </Link>

              {/* Auth Buttons */}
              <div className="flex items-center gap-3 ml-2">
                <Link
                  href="/platform/signin"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:text-purple-300 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/platform/signup"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-16">{children}</main>

      {/* Platform Footer */}
      <footer className="relative bg-gradient-to-b from-transparent to-white/[0.02] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">FusionSpace</span>
              </div>
              <p className="text-sm text-indigo-200/60">
                Where creativity meets community. Build, share, and thrive.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/fan/discover"
                    className="text-sm text-indigo-200/60 hover:text-white transition-colors"
                  >
                    Discover Creators
                  </Link>
                </li>
                <li>
                  <Link
                    href="/creator/dashboard"
                    className="text-sm text-indigo-200/60 hover:text-white transition-colors"
                  >
                    Creator Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/portal"
                    className="text-sm text-indigo-200/60 hover:text-white transition-colors"
                  >
                    Portal Hub
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/creator/demo"
                    className="text-sm text-indigo-200/60 hover:text-white transition-colors"
                  >
                    Creator Demo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-indigo-200/60 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-indigo-200/60 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/About"
                    className="text-sm text-indigo-200/60 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-indigo-200/60 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-sm text-indigo-200/60 hover:text-white transition-colors"
                  >
                    Main Website
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-indigo-200/60">
              © 2025 FusionSpace. A product of The Fusion Space Inc.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-indigo-200/60 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-indigo-200/60 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-indigo-200/60 hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
