// app/tacos/layout.tsx
import TacoFooter from "@/components/ui/TacoFooter";
import Header from "@/components/ui/header";
import type { ReactNode } from "react";



export default function TacoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}