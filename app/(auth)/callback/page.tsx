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
      console.log("[CALLBACK] Starting auth callback handler");
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        console.error("[CALLBACK] Supabase client not available");
        router.push("/signin");
        return;
      }

      // Exchange the code for a session
      const code = searchParams.get("code");
      const type = searchParams.get("type"); // Check if this is email confirmation
      console.log("[CALLBACK] Code present:", !!code, "Type:", type);
      
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error("[CALLBACK] Error exchanging code:", exchangeError);
          setError(exchangeError.message);
          setTimeout(() => router.push("/signin"), 3000);
          return;
        }
        console.log("[CALLBACK] Code exchanged successfully");
        
        // If this is an email confirmation, show success page
        if (type === "email") {
          console.log("[CALLBACK] Email confirmation detected, redirecting to confirm page");
          router.push("/auth/confirm");
          return;
        }
      }

      // Get the session
      const { data: { session, user } } = await supabase.auth.getSession();
      console.log("[CALLBACK] Session status:", { 
        hasSession: !!session, 
        userId: user?.id,
        userMetadata: user?.user_metadata 
      });
      
      if (!session || !user) {
        console.error("[CALLBACK] No session found, redirecting to signin");
        router.push("/signin");
        return;
      }

      // Get role from user metadata (set during signup)
      const userRole = user.user_metadata?.role;
      const userName = user.user_metadata?.name;
      
      console.log("[CALLBACK] User metadata:", { role: userRole, name: userName });

      // Check if profile already exists
      try {
        const profileCheck = await fetch("/api/profile");
        if (profileCheck.ok) {
          const existingProfile = await profileCheck.json();
          console.log("[CALLBACK] Profile exists, redirecting based on role");
          
          // Redirect based on existing role
          if (existingProfile?.creator) {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
          return;
        }
      } catch (err) {
        console.log("[CALLBACK] No existing profile, will create one");
      }

      // Check for pending role from OAuth signup
      const pendingRole = localStorage.getItem("pendingRole");
      const finalRole = pendingRole || userRole || "fan";
      
      console.log("[CALLBACK] Final role:", finalRole, "(pending:", pendingRole, ", metadata:", userRole, ")");

      try {
        // Create profile via API
        console.log("[CALLBACK] Creating profile with role:", finalRole);
        const response = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            role: finalRole,
            name: userName || user.email?.split('@')[0] || 'User'
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[CALLBACK] Failed to create profile:", errorText);
        } else {
          console.log("[CALLBACK] Profile created successfully");
        }

        // Clear the pending role
        if (pendingRole) {
          localStorage.removeItem("pendingRole");
        }

        // Route based on role
        console.log("[CALLBACK] Redirecting to:", finalRole === "creator" ? "/dashboard" : "/");
        if (finalRole === "creator") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("[CALLBACK] Error during profile creation:", err);
        router.push("/dashboard"); // Default fallback
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
