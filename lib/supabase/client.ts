import { createBrowserClient } from "@supabase/ssr";
import { validateEnvVars } from "@/lib/env";

// Don't create a browser client at build-time (server) — only create on the
// browser at runtime where window is available. This prevents build errors
// when NEXT_PUBLIC_SUPABASE_* are not set during static export or server build.
export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    console.log("[SUPABASE] Cannot create client: window is undefined (SSR)");
    return null;
  }
  
  // memoize on window to avoid re-creating the client
  const win = window as any;
  if (win.__supabase_client) {
    console.log("[SUPABASE] Returning cached client");
    return win.__supabase_client;
  }

  console.log("[SUPABASE] Creating new client");
  console.log("[SUPABASE] URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("[SUPABASE] Anon key present:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  try {
    validateEnvVars();
  } catch (err) {
    console.error("[SUPABASE] Env validation failed:", err);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    console.error("[SUPABASE] Missing required env vars");
    console.error("[SUPABASE] URL present:", !!url);
    console.error("[SUPABASE] Anon key present:", !!anon);
    return null;
  }

  const client = createBrowserClient(url, anon);
  win.__supabase_client = client;
  console.log("[SUPABASE] Client created successfully");
  return client;
}
