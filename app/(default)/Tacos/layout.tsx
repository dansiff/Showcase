// app/tacos/layout.tsx
"use client";

// Update the import path below if the file exists with a different name or casing.
// For example, if the file is named 'headervariant.tsx' or 'Headervariant.tsx', update accordingly.
// If the file does not exist, create it at 'components/ui/HeaderVariant.tsx'.
import Header from "@/components/ui/header";
import TacoFooter from "@/components/ui/TacoFooter";

export default function TacosLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Header
                    links={[
                        { href: "/tacos/menu", label: "Menu" },
                        { href: "/tacos/order", label: "Order Now" },
                    ]}
                    variant="taco"
                />
                <main>{children}</main>
                <TacoFooter />
            </body>
        </html>
    );
}