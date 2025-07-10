// app/tacos/layout.tsx
import TacoFooter from "@/components/ui/TacoFooter";
import Header from "@/components/ui/header";
import type { ReactNode } from "react";

export const metadata = {
  title: "Querrepario Tacos",
  description: "Best authentic tacos in town. Fresh, local, and always delicious!",
};

export default function TacosLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-yellow-950 text-yellow-100 min-h-screen flex flex-col">
      <Header
        links={[
          { href: "/tacos/menu", label: "Menu" },
          { href: "/tacos/order", label: "Order Now" },
        ]}
        variant="taco"
      />
      <main className="flex-grow px-4 py-6">{children}</main>
      <TacoFooter />
    </div>
  );
}