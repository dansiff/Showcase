import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Amatic_SC } from "next/font/google";
import TacoHeader from "@/components/layout/TacoHeader";
import { MapPin } from "lucide-react";

export const metadata = {
  title: "Querrepario Tacos",
  description: "Experience the best tacos in town with our fresh and authentic recipes.",
};

const inter = Inter({ 
  weight: ["400", "600"],
  subsets: ["latin"], 
  variable: "--font-inter", 
  display: "swap" 
});

const amatic = Amatic_SC({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
});

export default function TacoLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`min-h-screen flex flex-col bg-orange-50 ${inter.variable} ${amatic.variable} font-sans`}>
      <TacoHeader />
      <main className="container mx-auto px-4 py-6 flex-grow">{children}</main>
      <footer className="bg-gray-950 text-white px-4 py-8 mt-12">
        <div className="container mx-auto grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-brand text-orange-400 mb-2">Come Visit Us</h2>
            <p className="text-sm text-gray-400">4720 W Lake St, Chicago, IL 60644</p>
            <a href="https://www.google.com/maps?q=4720+W+Lake+St,+Chicago,+IL+60644" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline text-sm flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" /> Get Directions
            </a>
          </div>
          <div className="text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Querrepario Tacos. All rights reserved.</p>
            <p className="mt-1">Made with love and extra salsa 🌶️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
