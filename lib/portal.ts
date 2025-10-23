// lib/portal.ts
// Utilities for detecting user's available portals and routing

import { User, Creator } from "@prisma/client";

export type PortalType = "fan" | "creator" | "client" | "admin";

export interface UserWithRelations extends User {
  creator?: Creator | null;
  profile?: any | null;
}

export interface AvailablePortals {
  fan: boolean;
  creator: boolean;
  client: boolean;
  admin: boolean;
}

/**
 * Detect which portals a user has access to
 */
export function detectAvailablePortals(
  user: UserWithRelations,
  hasClientIntakes: boolean = false
): AvailablePortals {
  return {
    fan: true, // Everyone can browse/consume content
    creator: !!user.creator, // Has creator profile
    client: hasClientIntakes, // Has active projects
    admin: user.role === "ADMIN", // Is admin
  };
}

/**
 * Get user's primary portal (highest priority)
 */
export function getPrimaryPortal(portals: AvailablePortals): PortalType {
  if (portals.admin) return "admin";
  if (portals.creator) return "creator";
  if (portals.client) return "client";
  return "fan";
}

/**
 * Get the default redirect path after login
 */
export function getDefaultPortalPath(
  user: UserWithRelations,
  hasClientIntakes: boolean = false
): string {
  const portals = detectAvailablePortals(user, hasClientIntakes);
  const activeCount = Object.values(portals).filter(Boolean).length;

  // If user has multiple portals, show hub
  if (activeCount > 1) {
    return "/portal";
  }

  // Single portal - go directly there
  if (portals.admin) return "/admin";
  if (portals.creator) return "/creator/dashboard";
  if (portals.client) return "/client/dashboard";
  return "/fan/discover";
}

/**
 * Portal metadata for UI rendering
 */
export const portalConfig = {
  fan: {
    id: "fan" as const,
    name: "Fan Portal",
    icon: "👥",
    description: "Discover creators and enjoy exclusive content",
    path: "/fan/discover",
    color: "blue",
  },
  creator: {
    id: "creator" as const,
    name: "Creator Portal",
    icon: "🎨",
    description: "Manage your content and grow your audience",
    path: "/creator/dashboard",
    color: "purple",
  },
  client: {
    id: "client" as const,
    name: "Client Portal",
    icon: "🏢",
    description: "Track your website projects and analytics",
    path: "/client/dashboard",
    color: "green",
  },
  admin: {
    id: "admin" as const,
    name: "Admin Panel",
    icon: "⚙️",
    description: "Platform administration and oversight",
    path: "/admin",
    color: "red",
  },
} as const;
