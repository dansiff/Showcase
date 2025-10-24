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

      // Check if this came from platform
      const isPlatformAuth = searchParams.get("source") === "platform" || 
                             localStorage.getItem("authSource") === "platform";
      console.log("[CALLBACK] Platform auth:", isPlatformAuth);

      // Exchange the code for a session (only for OAuth flows)
      const code = searchParams.get("code");
      const type = searchParams.get("type"); // Check if this is email confirmation
      console.log("[CALLBACK] Code present:", !!code, "Type:", type);
      
      if (code) {
        console.log("[CALLBACK] Attempting code exchange for OAuth flow");
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error("[CALLBACK] Error exchanging code:", exchangeError);
          // Only show error if it's a real OAuth flow failure
          if (exchangeError.message && !exchangeError.message.includes("code verifier")) {
            setError(exchangeError.message);
            setTimeout(() => router.push(isPlatformAuth ? "/platform/signin" : "/signin"), 3000);
            return;
          }
          console.log("[CALLBACK] Code exchange error ignored (likely false alarm)");
        } else {
          console.log("[CALLBACK] Code exchanged successfully");
        }
        
        // If this is an email confirmation, show success page
        if (type === "email") {
          console.log("[CALLBACK] Email confirmation detected, redirecting to confirm page");
          router.push("/confirm");
          return;
        }
      } else {
        console.log("[CALLBACK] No code present, checking for existing session");
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
        router.push(isPlatformAuth ? "/platform/signin" : "/signin");
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
          console.log("[CALLBACK] Profile exists, redirecting to portal");
          
          // Ensure Prisma user exists by email before routing
          const ensureUserResp = await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              role: existingProfile.role || "USER",
              name: userName || user.email?.split('@')[0] || 'User'
            }),
          });
          
          if (!ensureUserResp.ok) {
            console.log("[CALLBACK] Could not ensure user, but continuing to portal");
          }
          
          // Clear any pending data
          localStorage.removeItem("pendingRole");
          localStorage.removeItem("authSource");
          
          // Redirect to portal (always goes through portal hub for routing)
          window.location.href = "/portal";
          return;
        }
      } catch (err) {
        console.log("[CALLBACK] No existing profile or error checking, will create one");
      }

      // Check for pending role from OAuth signup
      const pendingRole = localStorage.getItem("pendingRole");
      const finalRole = pendingRole || userRole || "fan";
      
      console.log("[CALLBACK] Final role:", finalRole, "(pending:", pendingRole, ", metadata:", userRole, ")");

      try {
        // Create profile via API - this ensures Prisma user exists
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
          
          // Don't fail completely - portal will create user if needed
          console.warn("[CALLBACK] Continuing to portal despite profile creation error");
        } else {
          console.log("[CALLBACK] Profile created successfully");
        }

        // Clear the pending role and auth source
        if (pendingRole) {
          localStorage.removeItem("pendingRole");
        }
        localStorage.removeItem("authSource");

        // Route to portal hub - use window.location for full page refresh
        console.log("[CALLBACK] Redirecting to portal hub");
        window.location.href = "/portal";
      } catch (err) {
        console.error("[CALLBACK] Error during profile creation:", err);
        // Even on error, try to redirect to portal
        window.location.href = "/portal";
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
