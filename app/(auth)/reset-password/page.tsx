"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mode, setMode] = useState<"request" | "update">("request");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If the user was redirected back with a recovery session, show the update form
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }: any) => {
      if (data?.user) setMode("update");
    });
  }, []);

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setError("Client not available");
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) setError(error.message);
    else setStatus("Check your email for a reset link.");
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setError("Client not available");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setError(error.message);
    else setStatus("Password updated. You can close this tab and sign in.");
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Reset your password
            </h1>
          </div>
          <div className="mx-auto max-w-[400px]">
            {mode === "request" ? (
              <form onSubmit={requestReset}>
                <div>
                  <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="email">Email</label>
                  <input id="email" type="email" className="form-input w-full" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mt-6">
                  <button className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]">
                    Send reset link
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={updatePassword}>
                <div>
                  <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="password">New password</label>
                  <input id="password" type="password" className="form-input w-full" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
                </div>
                <div className="mt-6">
                  <button className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]">
                    Update password
                  </button>
                </div>
              </form>
            )}
            {status && <p className="mt-4 text-sm text-green-400">{status}</p>}
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
