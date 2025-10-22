"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        router.push("/signin");
        return;
      }

      // Exchange the code for a session
      const code = searchParams.get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error("Error exchanging code:", exchangeError);
          setError(exchangeError.message);
          setTimeout(() => router.push("/signin"), 3000);
          return;
        }
      }

      // Get the session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/signin");
        return;
      }

      // Check for pending role from OAuth signup
      const pendingRole = localStorage.getItem("pendingRole");
      
      if (pendingRole) {
        try {
          // Set the role via profile API
          const response = await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: pendingRole }),
          });

          if (!response.ok) {
            console.error("Failed to set role:", await response.text());
          }

          // Clear the pending role
          localStorage.removeItem("pendingRole");

          // Route based on role
          if (pendingRole === "creator") {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        } catch (err) {
          console.error("Error setting role:", err);
          router.push("/dashboard"); // Default fallback
        }
      } else {
        // No pending role (regular signin), check user's existing role
        try {
          const response = await fetch("/api/profile");
          if (response.ok) {
            const profile = await response.json();
            if (profile?.creator) {
              router.push("/dashboard");
            } else {
              router.push("/");
            }
          } else {
            router.push("/dashboard"); // Default fallback
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          router.push("/dashboard"); // Default fallback
        }
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">Authentication error: {error}</p>
        <p className="text-gray-600">Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
      <p className="text-gray-600">Completing sign-in...</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
