import React from 'react'

interface CommissionRecord {
  clientName: string
  siteId: string
  saleAmount: number
  commissionRate: number
  payoutStatus: 'pending' | 'paid'
  saleDate: string
}

const sampleData: CommissionRecord[] = [
  {
    clientName: 'Acme Corp',
    siteId: 'site-001',
    saleAmount: 120,
    commissionRate: 0.25,
    payoutStatus: 'paid',
    saleDate: '2026-02-01',
  },
  {
    clientName: 'Beta LLC',
    siteId: 'site-002',
    saleAmount: 90,
    commissionRate: 0.2,
    payoutStatus: 'pending',
    saleDate: '2026-02-10',
  },
]

export default function CommissionDashboard() {
  return (
    <div className="max-w-3xl mx-auto bg-slate-800/40 border border-slate-700 rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-bold text-violet-300 mb-4">Commission Tracking Dashboard</h2>
      <table className="w-full text-slate-200 mb-6">
        <thead>
          <tr className="bg-slate-900">
            <th className="py-2 px-3 text-left">Client</th>
            <th className="py-2 px-3 text-left">Site ID</th>
            <th className="py-2 px-3 text-left">Sale Amount</th>
            <th className="py-2 px-3 text-left">Commission</th>
            <th className="py-2 px-3 text-left">Status</th>
            <th className="py-2 px-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {sampleData.map((record, idx) => (
            <tr key={idx} className="border-b border-slate-700">
              <td className="py-2 px-3">{record.clientName}</td>
              <td className="py-2 px-3">{record.siteId}</td>
              <td className="py-2 px-3">${record.saleAmount.toFixed(2)}</td>
              <td className="py-2 px-3">{(record.saleAmount * record.commissionRate).toFixed(2)} ({(record.commissionRate * 100).toFixed(0)}%)</td>
              <td className="py-2 px-3">
                <span className={record.payoutStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}>
                  {record.payoutStatus.charAt(0).toUpperCase() + record.payoutStatus.slice(1)}
                </span>
              </td>
              <td className="py-2 px-3">{record.saleDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-slate-300 text-sm">
        <strong>Total Commission Earned:</strong> ${sampleData.reduce((sum, r) => sum + r.saleAmount * r.commissionRate, 0).toFixed(2)}
      </div>
      <div className="mt-4 text-slate-400 text-xs">
        For full payout details and export, visit your Reseller Dashboard.
      </div>
    </div>
  )
}
