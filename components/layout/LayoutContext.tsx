// components/layout/LayoutContext.tsx
"use client";
import { createContext, useState, ReactNode, useContext } from "react";

// Define the context type
export const HeaderVisibilityContext = createContext<{
  isHeaderVisible: boolean;
  setHeaderVisible: (visible: boolean) => void;
} | undefined>(undefined);

// Custom hook to safely use the context
export function useHeaderVisibility() {
  const context = useContext(HeaderVisibilityContext);
  if (context === undefined) {
    throw new Error("useHeaderVisibility must be used within a HeaderVisibilityProvider");
  }
  return context;
}

// Provider component
export function HeaderVisibilityProvider({ children }: { children: ReactNode }) {
  const [isHeaderVisible, setHeaderVisible] = useState(true);

  return (
    <HeaderVisibilityContext.Provider value={{ isHeaderVisible, setHeaderVisible }}>
      {children}
    </HeaderVisibilityContext.Provider> 
  );
}