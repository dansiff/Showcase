"use client";

import { useEffect, useState } from "react";

type Prefs = {
  payoutCadence?: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
  payoutMethod?: "STRIPE_CONNECT" | "BANK_WIRE" | "PAYPAL";
  promoEndsAt?: string | null;
};

export default function PayoutsSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({});
  const [amountCents, setAmountCents] = useState<number | "">("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/creator/payouts/preferences", { cache: "no-store" });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setPrefs(data || {});
        } else if (res.status === 401) {
          setError("Please sign in to manage payouts.");
        } else {
          setError("Failed to load preferences");
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to load preferences");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const savePrefs = async () => {
    setSaving(true);
    setStatus(null);
    setError(null);
    try {
      const res = await fetch("/api/creator/payouts/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error((await res.json()).error || `Save failed (${res.status})`);
      setStatus("Preferences saved");
    } catch (e: any) {
      setError(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const requestInstantPayout = async () => {
    setSaving(true);
    setStatus(null);
    setError(null);
    try {
      const res = await fetch("/api/creator/payouts/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents: amountCents === "" ? undefined : amountCents, method: prefs.payoutMethod, cadence: prefs.payoutCadence }),
      });
      if (!res.ok) throw new Error((await res.json()).error || `Request failed (${res.status})`);
      setStatus("Instant payout requested. We’ll email you once processed.");
      setAmountCents("");
    } catch (e: any) {
      setError(e?.message ?? "Request failed");
    } finally {
      setSaving(false);
    }
  };

  const promoBadge = prefs.promoEndsAt ? (() => {
    const ends = new Date(prefs.promoEndsAt!);
    const remaining = Math.max(0, Math.ceil((ends.getTime() - Date.now()) / (1000*60*60*24)));
    return remaining > 0 ? `Launch promo active • ${remaining} days left at 13%` : null;
  })() : null;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Payout settings</h1>
      <p className="mt-1 text-sm text-gray-600">Configure how and when you get paid. Standard schedule is weekly with a 7‑day rolling hold.</p>
      {promoBadge && <div className="mt-3 rounded bg-indigo-50 px-3 py-2 text-sm text-indigo-700">{promoBadge}</div>}

      <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Payout cadence</label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              value={prefs.payoutCadence || "WEEKLY"}
              onChange={(e) => setPrefs((p) => ({ ...p, payoutCadence: e.target.value as any }))}
              disabled={loading || saving}
            >
              <option value="WEEKLY">Weekly (Standard)</option>
              <option value="BIWEEKLY">Every 2 weeks</option>
              <option value="MONTHLY">Monthly</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">We hold funds for 7 days to cover refunds and disputes.</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Payout method</label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              value={prefs.payoutMethod || "STRIPE_CONNECT"}
              onChange={(e) => setPrefs((p) => ({ ...p, payoutMethod: e.target.value as any }))}
              disabled={loading || saving}
            >
              <option value="STRIPE_CONNECT">Stripe Connect (recommended)</option>
              <option value="BANK_WIRE">Bank wire</option>
              <option value="PAYPAL">PayPal</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Stripe Connect gives fastest, most reliable payouts.</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button onClick={savePrefs} disabled={loading || saving} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">Save preferences</button>
          {status && <span className="text-sm text-green-600">{status}</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold">Instant payout</h2>
        <p className="mt-1 text-sm text-gray-600">Request a one‑off payout outside your normal schedule. Instant payouts may include an additional fee.</p>
        <div className="mt-3 flex items-center gap-3">
          <label htmlFor="amount" className="text-sm text-gray-700">Amount (USD ¢)</label>
          <input id="amount" type="number" min={0} className="w-40 rounded-md border px-2 py-1 text-sm" value={amountCents} onChange={(e) => setAmountCents(e.target.value === '' ? '' : parseInt(e.target.value, 10))} />
          <button onClick={requestInstantPayout} disabled={loading || saving} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">Request</button>
        </div>
        <p className="mt-1 text-xs text-gray-500">We’ll review and process within 1–2 business days.</p>
      </div>
    </div>
  );
}
