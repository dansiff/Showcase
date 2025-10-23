"use client";

import { useEffect, useState } from "react";

type RequestRow = {
  id: string;
  creator: { id: string; displayName: string; userId: string };
  amountCents?: number | null;
  method: string;
  cadence?: string | null;
  status: string;
  notes?: string | null;
  createdAt: string;
};

export default function AdminPayoutsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchRows = async (status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const qs = status ? `?status=${encodeURIComponent(status)}` : "";
      const res = await fetch(`/api/admin/payouts/requests${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error((await res.json()).error || `Load failed (${res.status})`);
      const data = await res.json();
      setRows(data.requests || []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRows(); }, []);

  const updateRow = async (id: string, patch: { status?: string; notes?: string }) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/payouts/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error((await res.json()).error || `Update failed (${res.status})`);
      await fetchRows(filter || undefined);
    } catch (e: any) {
      setError(e?.message ?? "Update failed");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold">Payout Requests</h1>
      <p className="mt-1 text-sm text-gray-600">Review and update payout request statuses.</p>

      <div className="mt-4 flex items-center gap-3">
        <select className="rounded-md border px-3 py-2 text-sm" value={filter} onChange={(e) => { setFilter(e.target.value); fetchRows(e.target.value || undefined); }}>
          <option value="">All</option>
          <option value="requested">Requested</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </select>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      <div className="mt-6 overflow-x-auto rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-2">Creator</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Cadence</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Notes</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6" colSpan={7}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-4 py-6" colSpan={7}>No requests</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2">{r.creator?.displayName || r.creator?.id}</td>
                  <td className="px-4 py-2">{typeof r.amountCents === 'number' ? `$${(r.amountCents/100).toFixed(2)}` : '—'}</td>
                  <td className="px-4 py-2">{r.method}</td>
                  <td className="px-4 py-2">{r.cadence || '—'}</td>
                  <td className="px-4 py-2">
                    <select
                      className="rounded-md border px-2 py-1"
                      value={r.status}
                      onChange={(e) => updateRow(r.id, { status: e.target.value })}
                      disabled={savingId === r.id}
                    >
                      <option value="requested">requested</option>
                      <option value="approved">approved</option>
                      <option value="paid">paid</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      defaultValue={r.notes || ''}
                      className="w-64 rounded-md border px-2 py-1"
                      onBlur={(e) => updateRow(r.id, { notes: e.target.value })}
                      disabled={savingId === r.id}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                      onClick={() => updateRow(r.id, { status: 'approved' })}
                      disabled={savingId === r.id}
                    >Approve</button>
                    <button
                      className="ml-2 rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                      onClick={() => updateRow(r.id, { status: 'paid' })}
                      disabled={savingId === r.id}
                    >Mark Paid</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
