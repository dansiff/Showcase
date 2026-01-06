import type { ReactNode } from "react";

// Standalone layout for taco showcase - no default header/footer
export default function TacoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
