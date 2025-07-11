"use client";

import { useHeaderVisibility } from "@/components/layouts/LayoutContext";
import Header from "@/components/ui/header";
import type { ReactNode } from "react";

export default function ClientLayoutShell({
  children,
}: {
  children: ReactNode;
}) {
  const showHeader = useHeaderVisibility();

  return (
    <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
      {showHeader && <Header />}
      {children}
    </div>
  );
}
// This layout shell is used to wrap the main content of the application.