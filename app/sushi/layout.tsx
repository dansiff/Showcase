import type { ReactNode } from "react";

// Standalone layout for sushi showcase - no default header/footer
export default function SushiLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
