import type { ReactNode } from "react";



export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* You can add section-specific nav, banners, etc. here */}
      {children}
    </div>
  );
}