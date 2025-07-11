import type { ReactNode } from "react";
import { Inter } from "next/font/google";
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

export default function TacoLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`min-h-screen flex flex-col ${inter.variable}`}>
      <TacoHeader />
      <main className="container mx-auto p-4 flex-grow">{children}</main>
      <footer className="bg-gray-900 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Querrepario Tacos. All rights reserved.</p>
        <div className="space-y-3 mt-2">
          <h3 className="text-sm font-semibold">Find Us</h3>
          <p className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <a
              href="https://www.google.com/maps?q=4720+W+Lake+St,+Chicago,+IL+60644"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline"
            >
              4720 W Lake St, Chicago, IL
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}