"use client";

import { useEffect, useState } from "react";

export default function CreatorSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ageRestricted, setAgeRestricted] = useState(false);
  const [revenueSharePercent, setRevenueSharePercent] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/creator/settings", { cache: "no-store" });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setAgeRestricted(Boolean(data.ageRestricted));
          if (typeof data.revenueSharePercent === 'number') setRevenueSharePercent(data.revenueSharePercent);
          if (data.isAdmin) setIsAdmin(true);
        } else if (res.status === 401) {
          setError("Please sign in to manage your creator settings.");
        } else {
          setError("Failed to load settings");
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/creator/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ageRestricted,
          ...(isAdmin && typeof revenueSharePercent === 'number' ? { revenueSharePercent } : {}),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Save failed (${res.status})`);
      }
      setSavedAt(Date.now());
    } catch (e: any) {
      setError(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Creator Settings</h1>
      <p className="mt-1 text-sm text-gray-600">Manage preferences for your public creator profile.</p>

      <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Age-restricted content</h2>
            <p className="mt-1 text-sm text-gray-600">
              When enabled, visitors must confirm they are 18+ before viewing your content.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={ageRestricted}
              disabled={loading || saving}
              onChange={(e) => setAgeRestricted(e.target.checked)}
            />
            <span className="relative h-6 w-11 rounded-full bg-gray-300 transition-all peer-checked:bg-indigo-600">
              <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-all peer-checked:left-5" />
            </span>
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={save}
            disabled={loading || saving}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save settings"}
          </button>
          {savedAt > 0 && (
            <span className="text-sm text-green-600">Saved</span>
          )}
          {error && (
            <span className="text-sm text-red-600">{error}</span>
          )}
        </div>
      </div>

      {/* Revenue share policy (read-only for creators, editable for admins) */}
      <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold">Revenue share</h2>
          <p className="text-sm text-gray-600">
            Our standard platform fee is {typeof revenueSharePercent === 'number' ? `${revenueSharePercent}%` : '—'} on net receipts (after payment processing fees and applicable taxes). Custom deals are available at our discretion.
            <a className="ml-1 text-indigo-600 underline" href="/terms/revenue-share" target="_blank" rel="noreferrer">Read policy</a>.
          </p>
          {isAdmin && (
            <div className="mt-2 flex items-center gap-3">
              <label className="text-sm text-gray-700" htmlFor="revshare">Override percent</label>
              <input
                id="revshare"
                type="number"
                min={5}
                max={30}
                step={1}
                className="w-24 rounded-md border px-2 py-1 text-sm"
                value={typeof revenueSharePercent === 'number' ? revenueSharePercent : 15}
                onChange={(e) => setRevenueSharePercent(parseInt(e.target.value || '0', 10))}
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={save}
            disabled={loading || saving}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save settings"}
          </button>
          {savedAt > 0 && (
            <span className="text-sm text-green-600">Saved</span>
          )}
          {error && (
            <span className="text-sm text-red-600">{error}</span>
          )}
        </div>
      </div>
    </div>
  );
}
