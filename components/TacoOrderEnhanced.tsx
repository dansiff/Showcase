"use client"

import { useState, useEffect } from 'react'
import { ShoppingCart, Clock, Phone, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'

type MenuCategory = {
  id: string
  name: string
  description?: string
  items: MenuItem[]
}

type MenuItem = {
  id: string
  sku: string
  name: string
  description?: string
  priceCents: number
  allergens?: string
  customizations: CustomizationOption[]
}

type CustomizationOption = {
  id: string
  name: string
  priceCents: number
}

type CartItem = {
  menuItem: MenuItem
  qty: number
  selectedCustomizations: string[] // IDs of selected customizations
  specialRequest?: string
}

export default function TacoOrderEnhanced() {
  const [menu, setMenu] = useState<MenuCategory[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [pickupAt, setPickupAt] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [tipPercent, setTipPercent] = useState(15)
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  useEffect(() => {
    // Fetch menu from API
    fetch('/api/taco/menu')
      .then(r => r.json())
      .then(data => setMenu(data.categories || []))
      .catch(() => setMenu([]))
    
    // Set default pickup time (20 mins from now)
    const now = new Date()
    now.setMinutes(now.getMinutes() + 20)
    setPickupAt(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16))
  }, [])

  function addToCart(item: MenuItem) {
    setExpandedItem(item.id)
  }

  function confirmAddToCart(item: MenuItem, customizations: string[], specialRequest: string) {
    const existing = cart.find(c => 
      c.menuItem.id === item.id && 
      JSON.stringify(c.selectedCustomizations.sort()) === JSON.stringify(customizations.sort()) &&
      c.specialRequest === specialRequest
    )
    
    if (existing) {
      setCart(cart.map(c => c === existing ? { ...c, qty: c.qty + 1 } : c))
    } else {
      setCart([...cart, { menuItem: item, qty: 1, selectedCustomizations: customizations, specialRequest }])
    }
    
    setExpandedItem(null)
  }

  function updateQty(index: number, delta: number) {
    const newQty = cart[index].qty + delta
    if (newQty <= 0) {
      setCart(cart.filter((_, i) => i !== index))
    } else {
      setCart(cart.map((item, i) => i === index ? { ...item, qty: newQty } : item))
    }
  }

  function calculateSubtotal() {
    return cart.reduce((sum, item) => {
      const basePrice = item.menuItem.priceCents * item.qty
      const customizationPrice = item.selectedCustomizations.reduce((cSum, cId) => {
        const customization = item.menuItem.customizations.find(c => c.id === cId)
        return cSum + (customization ? customization.priceCents * item.qty : 0)
      }, 0)
      return sum + basePrice + customizationPrice
    }, 0)
  }

  function calculateTax() {
    return Math.round(calculateSubtotal() * 0.085) // 8.5% tax
  }

  function calculateTip() {
    return Math.round(calculateSubtotal() * (tipPercent / 100))
  }

  function calculateTotal() {
    return calculateSubtotal() + calculateTax() + calculateTip()
  }

  async function placeOrder() {
    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Please provide your name and phone number')
      return
    }
    if (cart.length === 0) {
      setError('Your cart is empty')
      return
    }

    setLoading(true)
    setError(null)

    const items = cart.map(item => ({
      sku: item.menuItem.sku,
      name: item.menuItem.name,
      qty: item.qty,
      unitCents: item.menuItem.priceCents,
      customizations: item.selectedCustomizations.map(cId => {
        const c = item.menuItem.customizations.find(opt => opt.id === cId)
        return c ? { id: c.id, name: c.name, priceCents: c.priceCents } : null
      }).filter(Boolean),
      specialRequest: item.specialRequest || null
    }))

    try {
      const res = await fetch('/api/taco/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim() || null,
          customerPhone: customerPhone.trim(),
          pickupAt,
          items,
          specialInstructions: specialInstructions.trim() || null,
          tipCents: calculateTip()
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to place order')
      }

      setOrderId(data.orderId)
      setOrderSuccess(true)
      setCart([])
      setCustomerName('')
      setCustomerEmail('')
      setCustomerPhone('')
      setSpecialInstructions('')
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (orderSuccess && orderId) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-4">Order #{orderId.slice(0, 8)}</p>
          <p className="text-gray-700 mb-2">We'll have your order ready for pickup at:</p>
          <p className="text-lg font-semibold text-gray-900 mb-6">{new Date(pickupAt).toLocaleString()}</p>
          <p className="text-sm text-gray-600 mb-6">You'll receive a confirmation text shortly.</p>
          <button 
            onClick={() => { setOrderSuccess(false); setOrderId(null); }}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            Place Another Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Menu Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-bold text-amber-300 flex items-center gap-2">
            🌮 Our Menu
          </h2>
          
          {menu.map(category => (
            <div key={category.id} className="bg-amber-950/50 rounded-lg shadow border border-amber-800/50 p-4 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-amber-200 mb-2">{category.name}</h3>
              {category.description && <p className="text-sm text-amber-100 mb-4">{category.description}</p>}
              
              <div className="space-y-3">
                {category.items.map(item => (
                  <div key={item.id} className="border border-amber-800 rounded-lg p-4 hover:border-amber-600 hover:bg-amber-900/30 transition bg-amber-900/20">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-100 text-lg">{item.name}</h4>
                        {item.description && <p className="text-sm text-amber-50 mt-1">{item.description}</p>}
                        {item.allergens && (
                          <p className="text-xs text-orange-400 mt-2 font-semibold">⚠️ Contains: {item.allergens}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-semibold text-amber-200 text-lg">${(item.priceCents / 100).toFixed(2)}</div>
                        <button
                          onClick={() => addToCart(item)}
                          className="mt-2 bg-amber-600 text-amber-50 px-4 py-1.5 rounded hover:bg-amber-700 text-sm transition font-medium"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    
                    {expandedItem === item.id && (
                      <CustomizationPanel
                        item={item}
                        onConfirm={confirmAddToCart}
                        onCancel={() => setExpandedItem(null)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {menu.length === 0 && (
            <div className="bg-amber-950/50 rounded-lg shadow border border-amber-800/50 p-8 text-center text-amber-300">
              Loading menu...
            </div>
          )}
        </div>

        {/* Cart & Checkout Section */}
        <div className="lg:col-span-1">
          <div className="bg-amber-950/60 rounded-lg shadow-lg border border-amber-800/50 p-4 sticky top-32 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-amber-300 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Order
            </h3>

            {cart.length === 0 ? (
              <p className="text-amber-100 text-center py-8">Cart is empty</p>
            ) : (
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="border-b border-amber-800 pb-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <div className="font-medium text-amber-100">{item.menuItem.name}</div>
                        {item.selectedCustomizations.length > 0 && (
                          <div className="text-xs text-amber-200 mt-1">
                            {item.selectedCustomizations.map(cId => {
                              const c = item.menuItem.customizations.find(opt => opt.id === cId)
                              return c ? `+ ${c.name}` : null
                            }).filter(Boolean).join(', ')}
                          </div>
                        )}
                        {item.specialRequest && (
                          <div className="text-xs text-amber-100 italic mt-1">{item.specialRequest}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <button onClick={() => updateQty(index, -1)} className="w-6 h-6 border border-amber-600 rounded flex items-center justify-center hover:bg-amber-700 text-amber-100">-</button>
                        <span className="w-8 text-center font-medium text-amber-100">{item.qty}</span>
                        <button onClick={() => updateQty(index, 1)} className="w-6 h-6 border border-amber-600 rounded flex items-center justify-center hover:bg-amber-700 text-amber-100">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 border-t border-amber-800 pt-4">
              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-amber-200">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full border border-amber-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-600 bg-amber-900/30 text-amber-50 placeholder-amber-400"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-amber-200">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full border border-amber-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-600 bg-amber-900/30 text-amber-50 placeholder-amber-400"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-amber-200">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full border border-amber-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-600 bg-amber-900/30 text-amber-50 placeholder-amber-400"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-amber-200">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Pickup Time
                </label>
                <input
                  type="datetime-local"
                  value={pickupAt}
                  onChange={e => setPickupAt(e.target.value)}
                  className="w-full border border-amber-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-600 bg-amber-900/30 text-amber-50"
                />
              </div>

              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-amber-200">Special Instructions</label>
                <textarea
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  className="w-full border border-amber-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-600 bg-amber-900/30 text-amber-50 placeholder-amber-400"
                  rows={2}
                  placeholder="Any special requests..."
                />
              </div>

              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-amber-200">Tip</label>
                <div className="flex gap-2">
                  {[0, 10, 15, 20].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setTipPercent(pct)}
                      className={`flex-1 py-2 rounded border transition font-medium ${
                        tipPercent === pct 
                          ? 'bg-amber-600 text-amber-50 border-amber-600' 
                          : 'bg-amber-900/30 text-amber-100 border-amber-700 hover:border-amber-600'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-amber-100">
                  <span>Subtotal</span>
                  <span>${(calculateSubtotal() / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-100">
                  <span>Tax</span>
                  <span>${(calculateTax() / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-100">
                  <span>Tip ({tipPercent}%)</span>
                  <span>${(calculateTip() / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-amber-300 pt-2 border-t border-amber-800">
                  <span>Total</span>
                  <span>${(calculateTotal() / 100).toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-800 rounded-lg p-3 flex items-start gap-2 text-sm text-red-200">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={placeOrder}
                disabled={loading || cart.length === 0}
                className="w-full bg-amber-600 text-amber-50 py-3 rounded-lg font-semibold hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CustomizationPanel({ 
  item, 
  onConfirm, 
  onCancel 
}: { 
  item: MenuItem
  onConfirm: (item: MenuItem, customizations: string[], specialRequest: string) => void
  onCancel: () => void
}) {
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([])
  const [specialRequest, setSpecialRequest] = useState('')

  function toggleCustomization(id: string) {
    setSelectedCustomizations(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="mt-3 p-3 bg-amber-50 rounded border border-amber-400">
      {item.customizations.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-medium text-amber-900 mb-2">Customizations</p>
          <div className="space-y-2">
            {item.customizations.map(c => (
              <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCustomizations.includes(c.id)}
                  onChange={() => toggleCustomization(c.id)}
                  className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm text-amber-900">
                  {c.name} {c.priceCents > 0 && `(+$${(c.priceCents / 100).toFixed(2)})`}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-amber-900 mb-1">Special request (optional)</label>
        <input
          type="text"
          value={specialRequest}
          onChange={e => setSpecialRequest(e.target.value)}
          className="w-full border border-amber-400 rounded px-2 py-1 text-sm bg-white text-amber-900 placeholder-amber-600"
          placeholder="e.g., extra hot, on the side..."
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onConfirm(item, selectedCustomizations, specialRequest)}
          className="flex-1 bg-amber-600 text-amber-50 px-4 py-2 rounded hover:bg-amber-700 text-sm font-medium transition"
        >
          Add to Cart
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-amber-400 rounded hover:bg-amber-200 text-amber-900 text-sm font-medium transition bg-white"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
