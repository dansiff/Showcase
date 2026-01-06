import type { ReactNode } from "react";

// Standalone layout for game arcade - no default header/footer
export default function GameLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
