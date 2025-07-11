"use client";

import { createContext, useContext } from "react";

const HeaderVisibilityContext = createContext(true); // true = show default header

export const useHeaderVisibility = () => useContext(HeaderVisibilityContext);

export const HeaderVisibilityProvider = ({
    children,
    showHeader = true,
}: {
    children: React.ReactNode;
    showHeader?: boolean;
}) => (
    <HeaderVisibilityContext.Provider value={showHeader}>
        {children}
    </HeaderVisibilityContext.Provider>
);
