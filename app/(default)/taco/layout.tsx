import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { MapPin } from "lucide-react"; // Ensure this is installed via npm install lucide-react

export const metadata = {
  title: "Querrepario Tacos",
  description: "Experience the best tacos in town with our fresh and authentic recipes.",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const nacelle = localFont({
  src: [
    { path: "/public/fonts/nacelle-regular.woff2", weight: "400", style: "normal" },
    { path: "/public/fonts/nacelle-italic.woff2", weight: "400", style: "italic" },
    { path: "/public/fonts/nacelle-semibold.woff2", weight: "600", style: "normal" },
    { path: "/public/fonts/nacelle-semibolditalic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-nacelle",
  display: "swap",
});

export default function TacoLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${nacelle.variable} bg-gray-950 font-inter text-base text-gray-200 antialiased`}>
        <div className="min-h-screen flex flex-col">
          {/* Taco-specific Header */}
          <header className="bg-gray-200 text-gray-800 p-4 text-center">
            <h1 className="text-2xl font-bold">¡Bienvenidos a Querrepario!</h1>
            <p className="text-sm">The home of legendary tacos—made fresh daily. Bold flavors, local ingredients, and a fiesta in every bite.</p>
            <button className="bg-yellow-300 text-gray-800 px-4 py-2 mt-2">See Our Menu</button>
          </header>

          {/* Main Content */}
          <main className="container mx-auto p-4 flex-grow">{children}</main>

          {/* Taco-specific Footer */}
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
      </body>
    </html>
  );
}