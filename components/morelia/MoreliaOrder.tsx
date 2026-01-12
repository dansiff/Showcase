"use client"

import { useState, useEffect } from 'react'
import { ShoppingCart, Clock, Phone, Mail, AlertCircle, CheckCircle2, Plus, Minus, X } from 'lucide-react'

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
  selectedCustomizations: string[]
  specialRequest?: string
}

export default function MoreliaOrder() {
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
    fetch('/api/morelia/menu')
      .then(r => r.json())
      .then(data => setMenu(data.categories || []))
      .catch(() => {
        // Fallback to taco menu if morelia menu doesn't exist yet
        fetch('/api/taco/menu')
          .then(r => r.json())
          .then(data => setMenu(data.categories || []))
          .catch(() => setMenu([]))
      })
    
    // Set default pickup time (30 mins from now)
    const now = new Date()
    now.setMinutes(now.getMinutes() + 30)
    setPickupAt(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16))
  }, [])

  function addToCart(item: MenuItem) {
    if (item.customizations.length > 0) {
      setExpandedItem(item.id)
    } else {
      confirmAddToCart(item, [], '')
    }
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

  function removeFromCart(index: number) {
    setCart(cart.filter((_, i) => i !== index))
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
    return Math.round(calculateSubtotal() * 0.085)
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
      const res = await fetch('/api/morelia/orders', {
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
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border-2 border-amber-300">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-red-900 mb-3">¡Gracias! Order Confirmed</h2>
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-red-900">#{orderId.slice(0, 8).toUpperCase()}</p>
          </div>
          <p className="text-gray-700 mb-2">Your order will be ready for pickup at:</p>
          <p className="text-2xl font-bold text-red-900 mb-6">
            {new Date(pickupAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-red-900">📱 We've sent a confirmation text to your phone</p>
          </div>
          <button 
            onClick={() => { setOrderSuccess(false); setOrderId(null); }}
            className="bg-red-900 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Place Another Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Menu Section */}
        <div className="lg:col-span-2 space-y-6">
          {menu.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">🌮</div>
              <p className="text-gray-600">Loading menu...</p>
            </div>
          ) : (
            menu.map(category => (
              <div key={category.id} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-2 text-red-900">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
                )}
                <div className="space-y-3">
                  {category.items.map(item => (
                    <div key={item.id}>
                      <div className="flex items-start justify-between gap-4 p-4 hover:bg-red-50 rounded-lg transition-colors">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                          )}
                          {item.allergens && (
                            <div className="text-xs text-amber-700 mt-1">⚠️ {item.allergens}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-red-900">${(item.priceCents / 100).toFixed(2)}</div>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 text-sm"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      
                      {/* Customization Panel */}
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
            ))
          )}
        </div>

        {/* Cart & Checkout Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            {/* Cart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-6 h-6 text-red-900" />
                <h3 className="text-xl font-bold text-red-900">Your Order</h3>
                <span className="ml-auto bg-red-900 text-white text-sm font-bold px-2 py-1 rounded-full">
                  {cart.reduce((sum, item) => sum + item.qty, 0)}
                </span>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cart.map((item, idx) => (
                      <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.menuItem.name}</div>
                            {item.selectedCustomizations.length > 0 && (
                              <div className="text-xs text-gray-600 mt-1">
                                {item.selectedCustomizations.map(cId => {
                                  const c = item.menuItem.customizations.find(opt => opt.id === cId)
                                  return c ? `+ ${c.name}` : null
                                }).filter(Boolean).join(', ')}
                              </div>
                            )}
                            {item.specialRequest && (
                              <div className="text-xs text-amber-700 mt-1">Note: {item.specialRequest}</div>
                            )}
                          </div>
                          <button onClick={() => removeFromCart(idx)} className="text-red-600 hover:text-red-800">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(idx, -1)}
                              className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.qty}</span>
                            <button
                              onClick={() => updateQty(idx, 1)}
                              className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="font-semibold text-sm">
                            ${((item.menuItem.priceCents + 
                              item.selectedCustomizations.reduce((sum, cId) => {
                                const c = item.menuItem.customizations.find(o => o.id === cId)
                                return sum + (c?.priceCents || 0)
                              }, 0)) * item.qty / 100).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${(calculateSubtotal() / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8.5%)</span>
                      <span>${(calculateTax() / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tip</span>
                      <select
                        value={tipPercent}
                        onChange={e => setTipPercent(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value={0}>No tip</option>
                        <option value={10}>10%</option>
                        <option value={15}>15%</option>
                        <option value={20}>20%</option>
                        <option value={25}>25%</option>
                      </select>
                    </div>
                    {tipPercent > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span className="ml-4">= ${(calculateTip() / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
                      <span>Total</span>
                      <span className="text-red-900">${(calculateTotal() / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Customer Info */}
            {cart.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-red-900">Your Information</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                    <input
                      type="datetime-local"
                      value={pickupAt}
                      onChange={e => setPickupAt(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    placeholder="Special instructions (optional)"
                    value={specialInstructions}
                    onChange={e => setSpecialInstructions(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full mt-4 bg-red-900 hover:bg-red-800 disabled:bg-gray-400 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg disabled:transform-none"
                >
                  {loading ? 'Placing Order...' : `Place Order • $${(calculateTotal() / 100).toFixed(2)}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Customization Panel Component
function CustomizationPanel({ 
  item, 
  onConfirm, 
  onCancel 
}: { 
  item: MenuItem
  onConfirm: (item: MenuItem, customizations: string[], specialRequest: string) => void
  onCancel: () => void
}) {
  const [selected, setSelected] = useState<string[]>([])
  const [note, setNote] = useState('')

  function toggleCustomization(id: string) {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mt-2 space-y-3">
      <h4 className="font-semibold text-red-900">Customize Your Order</h4>
      
      {item.customizations.length > 0 && (
        <div className="space-y-2">
          {item.customizations.map(c => (
            <label key={c.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(c.id)}
                onChange={() => toggleCustomization(c.id)}
                className="w-4 h-4 text-red-900 rounded focus:ring-red-500"
              />
              <span className="flex-1 text-sm">{c.name}</span>
              {c.priceCents > 0 && (
                <span className="text-sm font-semibold text-red-900">+${(c.priceCents / 100).toFixed(2)}</span>
              )}
            </label>
          ))}
        </div>
      )}

      <input
        type="text"
        placeholder="Special request (e.g., no onions)"
        value={note}
        onChange={e => setNote(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      />

      <div className="flex gap-2">
        <button
          onClick={() => onConfirm(item, selected, note)}
          className="flex-1 bg-red-900 hover:bg-red-800 text-white py-2 rounded-lg font-semibold transition-colors"
        >
          Add to Cart
        </button>
        <button
          onClick={onCancel}
          className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
