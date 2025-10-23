"use client";

import { useEffect, useState } from "react";

type Consent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const DEFAULT_CONSENT: Consent = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function setConsentCookie(consent: Consent) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(consent));
  const maxAge = 60 * 60 * 24 * 180; // 180 days
  document.cookie = `cookie_consent=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function getConsentFromCookie(): Consent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith("cookie_consent="));
  if (!match) return null;
  try {
    const raw = decodeURIComponent(match.split("=")[1] ?? "");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function CookiePreferencesPage() {
  const [consent, setConsent] = useState<Consent>(DEFAULT_CONSENT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load from cookie or localStorage
    const fromCookie = getConsentFromCookie();
    if (fromCookie) {
      setConsent({ necessary: true, analytics: !!fromCookie.analytics, marketing: !!fromCookie.marketing });
      return;
    }
    try {
      const fromStorage = localStorage.getItem("cookie_consent");
      if (fromStorage) {
        const parsed = JSON.parse(fromStorage);
        setConsent({ necessary: true, analytics: !!parsed.analytics, marketing: !!parsed.marketing });
      }
    } catch {}
  }, []);

  const save = () => {
    const value = { ...consent, necessary: true };
    try {
      localStorage.setItem("cookie_consent", JSON.stringify(value));
    } catch {}
    setConsentCookie(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const allowAll = () => {
    const value: Consent = { necessary: true, analytics: true, marketing: true };
    setConsent(value);
    try { localStorage.setItem("cookie_consent", JSON.stringify(value)); } catch {}
    setConsentCookie(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const denyAll = () => {
    const value: Consent = { necessary: true, analytics: false, marketing: false };
    setConsent(value);
    try { localStorage.setItem("cookie_consent", JSON.stringify(value)); } catch {}
    setConsentCookie(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Cookie Preferences</h1>
      <p className="mt-2 text-indigo-200/80">Manage how we use cookies on this device.</p>

      <div className="mt-8 rounded-lg border border-indigo-900/30 bg-indigo-950/30 p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">Necessary</h2>
            <p className="mt-1 text-sm text-indigo-200/70">Required for the site to function and cannot be disabled.</p>
          </div>
          <label className="inline-flex items-center gap-2 text-sm opacity-70">
            <input type="checkbox" checked disabled className="h-4 w-4" /> Required
          </label>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-indigo-900/30 bg-indigo-950/30 p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">Analytics</h2>
            <p className="mt-1 text-sm text-indigo-200/70">Helps us understand usage to improve the product (e.g., privacy-friendly analytics).</p>
          </div>
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={consent.analytics}
              onChange={(e) => setConsent((c) => ({ ...c, analytics: e.target.checked }))}
            />
            <span className="relative h-6 w-11 rounded-full bg-gray-300 transition-all peer-checked:bg-indigo-600">
              <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-all peer-checked:left-5" />
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-indigo-900/30 bg-indigo-950/30 p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">Marketing</h2>
            <p className="mt-1 text-sm text-indigo-200/70">Used to personalize ads and measure campaign performance.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={consent.marketing}
              onChange={(e) => setConsent((c) => ({ ...c, marketing: e.target.checked }))}
            />
            <span className="relative h-6 w-11 rounded-full bg-gray-300 transition-all peer-checked:bg-indigo-600">
              <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-all peer-checked:left-5" />
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={save}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Save preferences
        </button>
        <button
          onClick={allowAll}
          className="rounded-md border border-indigo-400 px-4 py-2 text-sm font-semibold text-indigo-100 hover:bg-indigo-900/30"
        >
          Allow all
        </button>
        <button
          onClick={denyAll}
          className="rounded-md border border-slate-500 px-4 py-2 text-sm font-semibold text-indigo-100 hover:bg-indigo-900/30"
        >
          Deny non-essential
        </button>
        {saved && <span className="text-sm text-green-400">Preferences saved</span>}
      </div>
    </main>
  );
}
