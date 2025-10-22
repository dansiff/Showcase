// components/layout/LayoutContext.tsx
"use client";
import { createContext, useState, ReactNode, useContext } from "react";

export type HeaderLink = { href: string; label: string };
export type HeaderCTA = { href: string; label: string };
export type HeaderVariant = "light" | "dark" | "transparent" | "taco";

export type HeaderConfig = {
  show?: boolean;
  variant?: HeaderVariant;
  links?: HeaderLink[];
  cta?: HeaderCTA | null;
};

type HeaderContextType = {
  config: HeaderConfig;
  setConfig: (cfg: Partial<HeaderConfig>) => void;
};

const defaultConfig: HeaderConfig = {
  show: true,
  variant: "light",
  links: [
    { href: "/creators", label: "Creators" },
    { href: "/about", label: "About" },
    { href: "/signin", label: "Sign in" },
    { href: "/signup", label: "Sign up" },
  ],
  cta: { href: "/signup?role=creator", label: "Become a creator" },
};

export const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useHeader must be used within HeaderProvider");
  return ctx;
}

// Backwards compatibility hooks
export function useHeaderVisibility() {
  const { config, setConfig } = useHeader();
  return {
    isHeaderVisible: !!config.show,
    setHeaderVisible: (visible: boolean) => setConfig({ show: visible }),
  };
}

export function HeaderProvider({ children, initial }: { children: ReactNode; initial?: Partial<HeaderConfig> }) {
  const [config, setConfigState] = useState<HeaderConfig>({ ...defaultConfig, ...initial });
  const setConfig = (cfg: Partial<HeaderConfig>) => setConfigState((prev) => ({ ...prev, ...cfg }));
  return <HeaderContext.Provider value={{ config, setConfig }}>{children}</HeaderContext.Provider>;
}