// app/tacos/layout.tsx
"use client";

// Update the import path below if the file exists with a different name or casing.
// For example, if the file is named 'headervariant.tsx' or 'Headervariant.tsx', update accordingly.
// If the file does not exist, create it at 'components/ui/HeaderVariant.tsx'.
import Header from "@/components/ui/header";
import TacoFooter from "@/components/ui/TacoFooter";
import type { ReactNode } from "react";

export const metadata = {
  title: "Querrepario Tacos",
  description: "Best authentic tacos in town. Fresh, local, and always delicious!",
};
export default function TacosLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-yellow-950 text-yellow-100">
        <Header
          links={[
            { href: "/tacos/menu", label: "Menu" },
            { href: "/tacos/order", label: "Order Now" },
          ]}
          variant="taco"
        />
        <main className="min-h-screen px-4 py-6">{children}</main>
        <TacoFooter />
      </body>
    </html>
  );
}
