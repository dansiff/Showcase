import { createBrowserClient } from "@supabase/ssr";
import { validateEnvVars } from "@/lib/env";

// Don't create a browser client at build-time (server) — only create on the
// browser at runtime where window is available. This prevents build errors
// when NEXT_PUBLIC_SUPABASE_* are not set during static export or server build.
export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") return null;
  // memoize on window to avoid re-creating the client
  const win = window as any;
  if (win.__supabase_client) return win.__supabase_client;

  validateEnvVars();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const client = createBrowserClient(url, anon);
  win.__supabase_client = client;
  return client;
}
