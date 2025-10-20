"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password || !name || !company) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }
    if (password.length < 10) {
      setErrorMsg("Password must be at least 10 characters.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMsg("Supabase client not available.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // when signUp succeeds, supabase returns a user in data.user (may be null if confirmation required)
      const userId = (data as any)?.user?.id;

      // If user id is present, persist profile to our server API
      if (userId) {
        try {
          const resp = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, name, company }),
          })

          if (!resp.ok) {
            const json = await resp.json().catch(() => ({}));
            throw new Error(json?.error || `Profile save failed: ${resp.status}`)
          }

          setSuccessMsg('Account created — redirecting...')
          setTimeout(() => router.push('/dashboard'), 1200)
          return;
        } catch (err: any) {
          setErrorMsg(err?.message ?? String(err))
          return;
        }
      }

      // If no user id returned (email confirmation flow), show success message
      setSuccessMsg('Confirmation email sent. Please check your inbox.')
      return;
    } catch (err: any) {
      setErrorMsg(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setErrorMsg("Supabase client not available");
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="name">
          Name <span className="text-red-500">*</span>
        </label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-input w-full" placeholder="Your full name" required />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="company">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} type="text" className="form-input w-full" placeholder="Your company name" required />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="email">
          Work Email <span className="text-red-500">*</span>
        </label>
        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-input w-full" placeholder="Your work email" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-indigo-200/65" htmlFor="password">
          Password <span className="text-red-500">*</span>
        </label>
        <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-input w-full" placeholder="Password (at least 10 characters)" required />
      </div>

  {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
  {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}

      <div className="mt-6 space-y-5">
        <button type="submit" disabled={loading} className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 text-white">
          {loading ? "Creating..." : "Register"}
        </button>

        <div className="flex items-center gap-3 text-center text-sm italic text-gray-600 before:h-px before:flex-1 before:bg-gradient-to-r before:from-transparent before:via-gray-400/25 after:h-px after:flex-1 after:bg-gradient-to-r after:from-transparent after:via-gray-400/25">
          or
        </div>

        <button type="button" onClick={handleGoogle} className="btn relative w-full bg-gradient-to-b from-gray-800 to-gray-800/60 text-gray-300">
          Sign Up with Google
        </button>
      </div>
    </form>
  );
}
