import type { ReactNode } from "react";
import Header from "@/components/ui/header";
import { HeaderProvider } from "@/components/layout/LayoutContext";



export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <HeaderProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        {children}
      </div>
    </HeaderProvider>
  );
}