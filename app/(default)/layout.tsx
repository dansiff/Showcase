import type { ReactNode } from "react";

// Optional: Section-specific metadata
export const metadata = {
  title: "Sandoval Bro's",
  description: "The modern affordable website as a service.",
};

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* You can add section-specific nav, banners, etc. here */}
      {children}
    </div>
  );
}