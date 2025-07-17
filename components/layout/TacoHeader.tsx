// components/taco/TacoHeader.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function TacoHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative overflow-hidden bg-amber-800 text-white shadow-md">
      {/* 🔥 Chili SVG Pattern Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M38.8 62.5c-7.6-3.2-6.3-14.3-5.4-17.2.9-2.9 2.8-8.4 7.1-10.2 4.3-1.8 6.6.8 7.6 2.6 1.1 1.9 1.2 3.6 2.5 5.5 1.4 2.1 2.9 3.3 4.5 4.2 1.6.9 2.9 2.7 1.7 6.3-1.2 3.6-7.4 12.2-17.9 9.1z' fill='%23fff'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Branding */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-md">
              ¡Bienvenidos a Querrepario!
            </h1>
            <p className="hidden md:block mt-1 text-lg text-yellow-100 font-medium drop-shadow-sm">
              The home of legendary tacos—made fresh daily.
            </p>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav
          className={`mt-4 md:mt-6 transition-all duration-300 ease-in-out ${
            isMenuOpen ? "block" : "hidden md:block"
          }`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 text-lg font-semibold">
            <li>
              <Link href="/taco/menu" className="block py-2 hover:text-teal-300">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/taco/order" className="block py-2 hover:text-teal-300">
                Order
              </Link>
            </li>
            <li>
              <Link
                href="/taco/about"
                className="mt-2 md:mt-0 inline-block bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
              >
                See Our Story
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
