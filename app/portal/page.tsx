// app/portal/page.tsx
// Unified portal hub - shows all available portals for the user

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import {
  detectAvailablePortals,
  portalConfig,
  type PortalType,
} from "@/lib/portal";
import { PortalHubClient } from "./PortalHubClient";

export const metadata = {
  title: "Portal Hub — The Fusion Space",
  description: "Access your portals",
};

async function getUserWithPortals() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/signin");
  }

  // Fetch user with relations, create if doesn't exist
  let user = await prisma.user.findUnique({
    where: { email: authUser.email! },
    include: {
      creator: true,
      profile: true,
    },
  });

  // If user doesn't exist in Prisma, create them
  if (!user) {
    console.log("[PORTAL] Creating Prisma user for:", authUser.email);
    user = await prisma.user.create({
      data: {
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        role: authUser.user_metadata?.role === "creator" ? "CREATOR" : "USER",
      },
      include: {
        creator: true,
        profile: true,
      },
    });

    // If they signed up as creator, create creator profile
    if (authUser.user_metadata?.role === "creator") {
      await prisma.creator.create({
        data: {
          userId: user.id,
          displayName: user.name || 'Creator',
          promoEndsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      });
      
      // Refresh user data to include creator
      user = await prisma.user.findUnique({
        where: { email: authUser.email! },
        include: {
          creator: true,
          profile: true,
        },
      });
    }
  }

  if (!user) {
    // This should never happen at this point, but TypeScript needs the check
    console.error("[PORTAL] User still null after creation attempt");
    redirect("/signin");
  }

  // Check for client intakes
  const clientIntakes = await prisma.clientIntake.findMany({
    where: { email: user.email },
    take: 1,
  });

  const portals = detectAvailablePortals(user, clientIntakes.length > 0);

  return { user, portals };
}

export default async function PortalHub() {
  const { user, portals } = await getUserWithPortals();

  // If only one portal available, redirect directly
  const activePortals = Object.entries(portals).filter(
    ([_, active]) => active
  ) as [PortalType, boolean][];

  if (activePortals.length === 1) {
    const [portalId] = activePortals[0];
    redirect(portalConfig[portalId].path);
  }

  return (
    <PortalHubClient
      user={{
        name: user.name,
        email: user.email,
      }}
      portals={portals}
      hasCreator={!!user.creator}
      hasFan={!!user.profile}
      hasClient={activePortals.some(([id]) => id === "client")}
    />
  );
}
