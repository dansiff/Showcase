// app/platform/page.tsx
// Creator/Fan Platform Homepage - Welcoming landing page for the creator economy platform

import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import PlatformHero from "@/components/platform/PlatformHero";
import PlatformFeatures from "@/components/platform/PlatformFeatures";
import PlatformCTA from "@/components/platform/PlatformCTA";
import CreatorShowcase from "@/components/platform/CreatorShowcase";
import PageIllustration from "@/components/page-illustration";

export const metadata = {
  title: "FusionSpace — Where Creators & Fans Connect",
  description: "Join the creative community. Share your passion, support your favorites, and build meaningful connections.",
};

export default async function PlatformHome() {
  // Check auth status to personalize experience
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <PageIllustration />
      <PlatformHero isAuthenticated={!!user} />
      <CreatorShowcase />
      <PlatformFeatures />
      <PlatformCTA isAuthenticated={!!user} />
    </>
  );
}
