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
        
        // Important: exchangeCodeForSession retrieves the code_verifier from localStorage
        // If it fails with "code verifier should be non-empty", the verifier was lost
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error("[CALLBACK] Error exchanging code:", exchangeError);
          console.log("[CALLBACK] Exchange error details:", {
            message: exchangeError.message,
            status: exchangeError.status,
            name: exchangeError.name,
          });
          
          // Check if we already have a valid session despite the error
          const { data: { session: existingSession } } = await supabase.auth.getSession();
          
          if (existingSession) {
            console.log("[CALLBACK] Found existing session despite exchange error, continuing...");
          } else {
            // Only show error if it's NOT a code verifier issue
            if (exchangeError.message && !exchangeError.message.includes("code verifier")) {
              setError(exchangeError.message);
              setTimeout(() => router.push(isPlatformAuth ? "/platform/signin" : "/signin"), 3000);
              return;
            }
            
            // Code verifier issue - likely cache/storage problem
            console.warn("[CALLBACK] Code verifier error - may need to sign in again");
            setError("Authentication session expired. Please sign in again.");
            setTimeout(() => router.push(isPlatformAuth ? "/platform/signin" : "/signin"), 2000);
            return;
          }
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
        console.log("[CALLBACK] Checking for existing profile...");
        const profileCheck = await fetch("/api/profile");
        console.log("[CALLBACK] Profile check response:", profileCheck.status);
        
        if (profileCheck.ok) {
          const existingProfile = await profileCheck.json();
          console.log("[CALLBACK] Existing profile found:", {
            hasId: !!existingProfile.id,
            role: existingProfile.role,
            hasCreator: !!existingProfile.creator,
          });
          
          // Profile exists - just clear pending data and redirect
          localStorage.removeItem("pendingRole");
          localStorage.removeItem("authSource");
          
          console.log("[CALLBACK] Redirecting existing user to portal");
          window.location.href = "/portal";
          return;
        }
      } catch (err) {
        console.log("[CALLBACK] No existing profile or error checking, will create one:", err);
      }

      // Check for pending role from OAuth signup
      const pendingRole = localStorage.getItem("pendingRole");
      const finalRole = pendingRole || userRole || "fan";
      
      console.log("[CALLBACK] Final role:", finalRole, "(pending:", pendingRole, ", metadata:", userRole, ")");

      try {
        // Create profile via API - this ensures Prisma user exists
        console.log("[CALLBACK] Creating new profile with:", {
          role: finalRole,
          name: userName || user.email?.split('@')[0] || 'User',
          userEmail: user.email,
        });
        
        const response = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            role: finalRole,
            name: userName || user.email?.split('@')[0] || 'User'
          }),
        });

        console.log("[CALLBACK] Profile creation response:", {
          status: response.status,
          ok: response.ok,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[CALLBACK] Failed to create profile:", {
            status: response.status,
            error: errorText,
          });
          
          // Don't fail completely - portal will create user if needed
          console.warn("[CALLBACK] Continuing to portal despite profile creation error");
        } else {
          const result = await response.json();
          console.log("[CALLBACK] Profile created successfully:", result);
        }

        // Clear the pending role and auth source
        if (pendingRole) {
          localStorage.removeItem("pendingRole");
        }
        localStorage.removeItem("authSource");
        console.log("[CALLBACK] Cleared localStorage");

        // Route to portal hub - use window.location for full page refresh
        console.log("[CALLBACK] Redirecting to portal hub at /portal");
        window.location.href = "/portal";
      } catch (err) {
        console.error("[CALLBACK] Error during profile creation:", err);
        // Even on error, try to redirect to portal
        console.log("[CALLBACK] Redirecting to portal despite error");
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
