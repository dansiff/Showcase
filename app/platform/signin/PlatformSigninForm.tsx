"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { showToast } from "@/components/ui/toast";
import { Sparkles, ArrowLeft, Mail, Lock } from "lucide-react";

type Provider = "google";

const providers: { id: Provider; name: string; icon: string }[] = [
  { id: "google", name: "Google", icon: "🔍" },
];

export default function PlatformSigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMsg("Auth not available");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        data: {
          rememberMe,
          source: "platform", // Track that this came from platform
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data?.session) {
      showToast("Welcome back! Redirecting...", "success", 1500);
      
      // Redirect to portal hub (it will route to appropriate dashboard)
      setTimeout(() => {
        window.location.href = "/portal";
      }, 800);
    } else {
      setErrorMsg("Sign in failed. Please try again.");
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: Provider) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMsg("Auth not available");
      return;
    }

    // Store that this is a platform login
    localStorage.setItem("authSource", "platform");

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/callback?source=platform`,
        flowType: 'pkce',
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
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-indigo-200/70">Sign in to continue creating and connecting</p>
          </div>

          {/* OAuth buttons */}
          <div className="space-y-3 mb-6">
            {providers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleOAuthSignIn(p.id)}
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

          {/* Email form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-white">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <Link
                  href="/reset-password"
                  className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-indigo-200/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-indigo-200/70">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-indigo-200/60">
            Don't have an account?{" "}
            <Link
              href="/platform/signup"
              className="font-medium text-purple-300 hover:text-purple-200 transition-colors"
            >
              Get started free
            </Link>
          </p>
        </div>

        {/* Bottom note */}
        <p className="mt-6 text-center text-xs text-indigo-200/40">
          By signing in, you agree to our{" "}
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
