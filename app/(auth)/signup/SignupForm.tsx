"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Provider = "google" | "discord" | "facebook" | "twitter";

const providers: { id: Provider; name: string; icon: string }[] = [
  { id: "google", name: "Google", icon: "🔍" },
  { id: "discord", name: "Discord", icon: "💬" },
  { id: "facebook", name: "Facebook", icon: "👍" },
  { id: "twitter", name: "Twitter", icon: "🐦" },
];

export default function SignupForm() {
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
      setErrorMsg("Auth not available.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      const userId = data?.user?.id;
      if (userId) {
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
        setTimeout(() => router.push(role === "creator" ? "/dashboard" : "/"), 1200);
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
      setErrorMsg("Auth not available.");
      return;
    }

    localStorage.setItem("pendingRole", role);

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 flex gap-3 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setRole("fan")}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition ${
            role === "fan"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Sign up as a fan
        </button>
        <button
          type="button"
          onClick={() => setRole("creator")}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition ${
            role === "creator"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Sign up as a creator
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {providers.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleOAuthSignup(p.id)}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
          >
            <span className="text-lg">{p.icon}</span>
            Continue with {p.name}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">Or with email</span>
        </div>
      </div>

      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="At least 8 characters"
            required
          />
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
            {successMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {loading ? "Creating account..." : `Sign up as ${role}`}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </p>
    </div>
  );
}
