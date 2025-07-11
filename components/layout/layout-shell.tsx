"use client";

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer"; // optional
import { useHeaderVisibility } from "./LayoutContext";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const showHeader = useHeaderVisibility();

  return (
    <>
      {showHeader && (
        <Header
          links={[
            { href: "/signin", label: "Sign In" },
            { href: "/signup", label: "Register" },
          ]}
        />
      )}
      <main>{children}</main>
      <Footer />
    </>
  );
}
