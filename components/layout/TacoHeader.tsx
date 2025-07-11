"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function TacoHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-amber-800 text-white p-4 md:p-6 text-center shadow-md relative">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">¡Bienvenidos a Querrepario!</h1>
          <p className="text-lg mt-2 hidden md:block">The home of legendary tacos—made fresh daily.</p>
        </div>
        <button
          className="md:hidden text-white p-2 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:flex md:space-x-4 md:mt-0 mt-4 absolute md:static top-full left-0 w-full bg-amber-800 md:bg-transparent z-10`}
      >
        <Link href="/taco/menu" className="block md:inline-block p-2 hover:text-teal-300">
          Menu
        </Link>
        <Link href="/taco/order" className="block md:inline-block p-2 hover:text-teal-300">
          Order
        </Link>
        <button className="block md:inline-block bg-red-600 text-white px-4 py-2 mt-2 md:mt-0 rounded-full hover:bg-red-700 transition duration-300 w-full md:w-auto">
          See Our Menu
        </button>
      </nav>
    </header>
  );
}