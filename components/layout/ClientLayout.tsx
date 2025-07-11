"use client";

import { HeaderVisibilityProvider } from "@/components/layout/LayoutContext";
import Footer from "@/components/ui/footer";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        AOS.init({ once: true, disable: "phone", duration: 600, easing: "ease-out-sine" });
    }, []);

    return (
        <HeaderVisibilityProvider showHeader={false}>
            <main className="relative flex grow flex-col">{children}</main>
            <Footer />
        </HeaderVisibilityProvider>
    );
}
