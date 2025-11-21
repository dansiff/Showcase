"use client"

import { useState, useEffect } from 'react'

type MenuItem = { id: string; name: string; price: number; desc?: string }

const MENU: MenuItem[] = [
  { id: 't1', name: 'Carne Asada Taco', price: 4.5, desc: 'Grilled steak, cilantro, onion' },
  { id: 't2', name: 'Pollo Taco', price: 4.0, desc: 'Marinated chicken, pico' },
  { id: 't3', name: 'Veggie Taco', price: 3.75, desc: 'Grilled veggies, salsa verde' },
  { id: 'bowl', name: 'Taco Bowl', price: 8.5, desc: 'Choice of protein, rice, beans' },
]

export default function TacoOrder() {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [pickupAt, setPickupAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!pickupAt) {
      const now = new Date()
      now.setMinutes(now.getMinutes() + 20)
      setPickupAt(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,16))
    }
  }, [])

  function add(id: string) { setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 })) }
  function sub(id: string) { setCart(c => { const n = (c[id] || 0) - 1; const clone = { ...c }; if (n <= 0) delete clone[id]; else clone[id] = n; return clone }) }

  function subtotal() {
    return Object.entries(cart).reduce((s, [id, qty]) => {
      const m = MENU.find(x => x.id === id)
      return s + (m ? m.price * qty : 0)
    }, 0)
  }

  async function placeOrder() {
    if (!name || !phone) { setMsg('Name and phone required'); return }
    if (Object.keys(cart).length === 0) { setMsg('Add items to cart'); return }
    setLoading(true); setMsg(null)
    const items = Object.entries(cart).map(([id, qty]) => ({ id, qty }))
    try {
      const res = await fetch('/api/taco/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerName: name, customerPhone: phone, pickupAt, items }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Order failed')
      setMsg('Order placed: #' + data.id)
      setCart({}); setName(''); setPhone('')
    } catch (e: any) {
      setMsg(e.message || 'Error')
    } finally { setLoading(false) }
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Order for Pickup</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <ul className="space-y-3">
            {MENU.map(m => (
              <li key={m.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.desc}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">${m.price.toFixed(2)}</div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => sub(m.id)} className="px-2 py-1 border rounded">-</button>
                    <div className="px-3 py-1 border rounded bg-gray-50">{cart[m.id] || 0}</div>
                    <button onClick={() => add(m.id)} className="px-2 py-1 border rounded">+</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-3">
            <label className="block text-xs text-gray-600">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
          <div className="mb-3">
            <label className="block text-xs text-gray-600">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
          <div className="mb-3">
            <label className="block text-xs text-gray-600">Pickup time</label>
            <input type="datetime-local" value={pickupAt} onChange={e => setPickupAt(e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-semibold">${subtotal().toFixed(2)}</div>
            <button onClick={placeOrder} disabled={loading} className="rounded bg-emerald-600 px-4 py-2 text-white">{loading ? 'Placing...' : 'Place Order'}</button>
          </div>
          {msg && <div className="mt-3 text-sm text-gray-700">{msg}</div>}
        </div>
      </div>
    </div>
  )
}
