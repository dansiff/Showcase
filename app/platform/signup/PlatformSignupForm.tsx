"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Sparkles, ArrowLeft, Mail, Lock, User, Palette, Heart } from "lucide-react";

type Provider = "google";

const providers: { id: Provider; name: string; icon: string }[] = [
  { id: "google", name: "Google", icon: "🔍" },
];

export default function PlatformSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams?.get("role");
  
  const [role, setRole] = useState<"creator" | "fan">(
    roleParam === "creator" ? "creator" : "fan"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password || !name) {
      setErrorMsg("Please fill out all fields.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setErrorMsg("Please enter a valid email.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMsg("Auth not available. Check console for details.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name, 
            role,
            source: "platform", // Track signup source
          },
        },
      });

      if (error) {
        if (error.message?.toLowerCase().includes("already registered") || 
            error.message?.toLowerCase().includes("already exists") ||
            error.status === 422) {
          setErrorMsg(
            "This email is already registered. Please sign in instead."
          );
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      const userId = data?.user?.id;
      
      if (userId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          setSuccessMsg("Confirmation email sent. Check your inbox!");
          return;
        }

        const resp = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, name, role }),
        });

        if (!resp.ok) {
          const json = await resp.json().catch(() => ({}));
          throw new Error(json?.error || `Profile creation failed`);
        }

        setSuccessMsg("Account created! Redirecting...");
        
        // Redirect to portal (which will route to creator dashboard or fan discover)
        setTimeout(() => {
          window.location.href = "/portal";
        }, 1200);
        return;
      }

      setSuccessMsg("Confirmation email sent. Check your inbox!");
    } catch (err: any) {
      setErrorMsg(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: Provider) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMsg("Auth not available. Check console for details.");
      return;
    }

    localStorage.setItem("pendingRole", role);
    localStorage.setItem("authSource", "platform");

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/callback?source=platform`,
        flowType: "pkce",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center py-12 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md">
        {/* Back to platform */}
        <Link
          href="/platform"
          className="inline-flex items-center gap-2 text-indigo-200/60 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Platform
        </Link>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">FusionSpace</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join FusionSpace</h1>
            <p className="text-indigo-200/70">Create your account and start connecting</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-white/5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setRole("creator")}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                role === "creator"
                  ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-indigo-200/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Palette className="w-6 h-6" />
              <span className="text-sm font-semibold">Creator</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("fan")}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                role === "fan"
                  ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-indigo-200/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Heart className="w-6 h-6" />
              <span className="text-sm font-semibold">Fan</span>
            </button>
          </div>

          {/* OAuth buttons */}
          <div className="space-y-3 mb-6">
            {providers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleOAuthSignup(p.id)}
                className="w-full flex items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-white/10 transition backdrop-blur-sm"
              >
                <span className="text-lg">{p.icon}</span>
                Continue with {p.name}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-950 px-4 text-indigo-200/60">Or with email</span>
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
              {errorMsg}
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-200 text-sm">
              {successMsg}
            </div>
          )}

          {/* Email form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-indigo-200/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-indigo-200/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </div>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-indigo-200/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm"
                placeholder="At least 8 characters"
                required
              />
              <p className="mt-1 text-xs text-indigo-200/50">
                Must be at least 8 characters long
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {loading ? "Creating account..." : `Sign Up as ${role === "creator" ? "Creator" : "Fan"}`}
            </button>
          </form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-indigo-200/60">
            Already have an account?{" "}
            <Link
              href="/platform/signin"
              className="font-medium text-purple-300 hover:text-purple-200 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Bottom note */}
        <p className="mt-6 text-center text-xs text-indigo-200/40">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-indigo-200/60">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-indigo-200/60">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
