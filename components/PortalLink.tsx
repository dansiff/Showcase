"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export default function PortalLink() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      setIsSignedIn(!!session);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return null; // Don't flash UI while checking
  }

  if (!isSignedIn) {
    return (
      <Link
        href="/signin"
        className="inline-flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/50 transition-all hover:scale-105"
      >
        Sign In
      </Link>
    );
  }

  return (
    <Link
      href="/portal"
      className="inline-flex items-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/50 transition-all hover:scale-105"
    >
      Go to Portal →
    </Link>
  );
}
