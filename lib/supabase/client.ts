import { createBrowserClient } from "@supabase/ssr";

// Don't create a browser client at build-time (server) — only create on the
// browser at runtime where window is available. This prevents build errors
// when NEXT_PUBLIC_SUPABASE_* are not set during static export or server build.
export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") return null;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // return a client that will throw only when actually used in the browser
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
