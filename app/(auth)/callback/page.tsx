"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return router.push("/signin");
    supabase.auth.getSession().then(({ data }: any) => {
      if (data?.session) {
        router.push("/dashboard");
      } else {
        router.push("/signin");
      }
    });
  }, [router]);

  return <p className="text-center mt-20">Completing sign-in...</p>;
}
