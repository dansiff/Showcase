// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies(); // asynchronous
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options?: any) => {
          // next/headers cookies() is read-only in server components, so set/remove are no-ops
        },
        remove: (name: string, options?: any) => {
          // next/headers cookies() is read-only in server components, so set/remove are no-ops
        },
      },
    }
  );
}
