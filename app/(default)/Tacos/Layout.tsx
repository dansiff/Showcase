// app/tacos/layout.tsx
"use client";

import Header from "@/components/ui/header";
import { ReactNode } from "react";

export default function TacosLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-200 font-inter">
            <Header
                links={[
                    { href: "/tacos/menu", label: "Menu" },
                    { href: "/tacos/order", label: "Order Now" },
                ]}
                className="sticky top-0 z-40 bg-gray-900/70 backdrop-blur-md shadow-lg"
            />
            <main className="relative z-10 px-4 pt-6 sm:px-6 lg:px-8">{children}</main>

            {/* Optional: footer or background decoration layer */}
            <div className="absolute inset-0 -z-10 opacity-10 bg-[url('/images/tortilla-texture.png')] bg-repeat" />
        </div>
    );
}
