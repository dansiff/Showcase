import type { ReactNode } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { HeaderProvider } from "@/components/layout/LayoutContext";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <HeaderProvider
      initial={{
        show: true,
        variant: "light",
        links: [
          { href: "/", label: "Home" },
          { href: "/About", label: "About" },
          { href: "/Showcasesites", label: "Our Work" },
          { href: "/signin", label: "Sign In" },
        ],
        cta: { href: "/signup?role=creator", label: "Get Started" },
      }}
    >
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </HeaderProvider>
  );
}