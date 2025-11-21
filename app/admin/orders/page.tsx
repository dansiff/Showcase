import React from 'react'

export const dynamic = 'force-dynamic';

async function fetchOrders() {
  const res = await fetch(process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL + '/api/taco/orders?limit=100' : 'http://localhost:3000/api/taco/orders?limit=100', { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.orders || [];
}

export default async function OrdersPage() {
  const orders = await fetchOrders();
  return (
    <div className="max-w-6xl mx-auto p-6" aria-labelledby="orders-heading">
      <h1 id="orders-heading" className="text-2xl font-semibold mb-4 text-amber-300">Pickup Orders</h1>
      <p className="text-sm text-gray-400 mb-6">Recent orders placed via TacoOrder component. This view is read-only prototype.</p>
      <div className="overflow-auto border border-gray-800 rounded-lg" role="region" aria-label="Orders table wrapper">
        <table className="min-w-full text-sm" role="table" aria-label="Orders">
          <thead role="rowgroup" className="bg-gray-900/60">
            <tr role="row">
              <th scope="col" role="columnheader" className="px-3 py-2 text-left">ID</th>
              <th scope="col" role="columnheader" className="px-3 py-2 text-left">Customer</th>
              <th scope="col" role="columnheader" className="px-3 py-2 text-left">Phone</th>
              <th scope="col" role="columnheader" className="px-3 py-2 text-left">Pickup</th>
              <th scope="col" role="columnheader" className="px-3 py-2 text-left">Items</th>
              <th scope="col" role="columnheader" className="px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {orders.map((o: any) => (
              <tr key={o.id} role="row" className="odd:bg-gray-950 even:bg-gray-900/40">
                <td role="cell" className="px-3 py-2 font-mono text-xs truncate max-w-[140px]" title={o.id}>{o.id}</td>
                <td role="cell" className="px-3 py-2">{o.customerName}</td>
                <td role="cell" className="px-3 py-2">{o.customerPhone}</td>
                <td role="cell" className="px-3 py-2 whitespace-nowrap">{new Date(o.pickupAt).toLocaleString()}</td>
                <td role="cell" className="px-3 py-2">
                  <ul className="list-none m-0 p-0">
                    {o.items.map((it: any) => (
                      <li key={it.id} className="flex justify-between gap-2">
                        <span className="font-medium">{it.sku}</span>
                        <span className="text-xs text-gray-400">x{it.qty}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td role="cell" className="px-3 py-2 text-right font-semibold">${(o.totalCents/100).toFixed(2)}</td>
              </tr>
            ))}
            {!orders.length && (
              <tr role="row">
                <td role="cell" colSpan={6} className="px-3 py-6 text-center text-gray-500">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
