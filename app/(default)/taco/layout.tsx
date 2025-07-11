// app/tacos/layout.tsx
export const metadata = {
    title: "Querrepario Tacos",
    description: "Experience the best tacos in town with our fresh and authentic recipes.",
};
import type { ReactNode } from "react";



export default function TacoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}