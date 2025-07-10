"use client";

import "./css/style.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/ui/header";
import { useHeaderVisibility, HeaderVisibilityProvider } from "@/components/layouts/LayoutContext";
import { usePathname } from "next/navigation";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const nacelle = localFont({
    src: [
        { path: "../public/fonts/nacelle-regular.woff2", weight: "400", style: "normal" },
        { path: "../public/fonts/nacelle-italic.woff2", weight: "400", style: "italic" },
        { path: "../public/fonts/nacelle-semibold.woff2", weight: "600", style: "normal" },
        { path: "../public/fonts/nacelle-semibolditalic.woff2", weight: "600", style: "italic" },
    ],
    variable: "--font-nacelle",
    display: "swap",
});

function LayoutShell({ children }: { children: React.ReactNode }) {
    const showHeader = useHeaderVisibility();
    const pathname = usePathname();
    const isTacosRoute = pathname.startsWith("/tacos");

    return (
        <html lang="en">
            <body className={`${inter.variable} ${nacelle.variable} bg-gray-950 font-inter text-base text-gray-200 antialiased`}>
                <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
                    {showHeader && !isTacosRoute && <Header />}
                    {children}
                </div>
            </body>
        </html>
    );
}