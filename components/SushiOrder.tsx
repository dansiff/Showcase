"use client"

import { useState, useEffect } from 'react'
import { ShoppingCart, Clock, Phone, Mail, AlertCircle, CheckCircle2, UtensilsCrossed } from 'lucide-react'

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

export default function SushiOrder() {
  const [menu, setMenu] = useState<MenuCategory[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [pickupAt, setPickupAt] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [tipPercent, setTipPercent] = useState(18)
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  useEffect(() => {
    // Mock sushi menu data
    setMenu([
      {
        id: 'nigiri',
        name: 'Nigiri',
        description: 'Hand-pressed sushi rice with premium fish',
        items: [
          { id: '1', sku: 'nigiri-salmon', name: 'Salmon Nigiri', description: 'Fresh Norwegian salmon', priceCents: 650, allergens: 'fish', customizations: [{ id: 'c1', name: 'Extra wasabi', priceCents: 0 }] },
          { id: '2', sku: 'nigiri-tuna', name: 'Tuna Nigiri', description: 'Bluefin tuna', priceCents: 850, allergens: 'fish', customizations: [{ id: 'c2', name: 'Extra wasabi', priceCents: 0 }] },
          { id: '3', sku: 'nigiri-yellowtail', name: 'Yellowtail Nigiri', description: 'Japanese hamachi', priceCents: 750, allergens: 'fish', customizations: [] }
        ]
      },
      {
        id: 'rolls',
        name: 'Signature Rolls',
        description: 'Our chef\'s specialty rolls',
        items: [
          { id: '4', sku: 'roll-california', name: 'California Roll', description: 'Crab, avocado, cucumber', priceCents: 1200, allergens: 'shellfish', customizations: [{ id: 'c3', name: 'No sesame seeds', priceCents: 0 }] },
          { id: '5', sku: 'roll-spicy-tuna', name: 'Spicy Tuna Roll', description: 'Tuna, sriracha mayo, cucumber', priceCents: 1400, allergens: 'fish', customizations: [{ id: 'c4', name: 'Extra spicy', priceCents: 0 }, { id: 'c5', name: 'Mild spice', priceCents: 0 }] },
          { id: '6', sku: 'roll-dragon', name: 'Dragon Roll', description: 'Eel, avocado, cucumber, tobiko', priceCents: 1800, allergens: 'fish,eggs', customizations: [] }
        ]
      },
      {
        id: 'sashimi',
        name: 'Sashimi',
        description: 'Fresh sliced fish without rice',
        items: [
          { id: '7', sku: 'sashimi-salmon', name: 'Salmon Sashimi', description: '5 pieces premium salmon', priceCents: 1600, allergens: 'fish', customizations: [] },
          { id: '8', sku: 'sashimi-tuna', name: 'Tuna Sashimi', description: '5 pieces bluefin tuna', priceCents: 2000, allergens: 'fish', customizations: [] }
        ]
      }
    ])
    
    const now = new Date()
    now.setMinutes(now.getMinutes() + 30)
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

    // Simulate order placement
    setTimeout(() => {
      setOrderId('ORD' + Math.random().toString(36).substr(2, 9).toUpperCase())
      setOrderSuccess(true)
      setCart([])
      setCustomerName('')
      setCustomerEmail('')
      setCustomerPhone('')
      setSpecialInstructions('')
      setLoading(false)
    }, 1500)
  }

  if (orderSuccess && orderId) {
    return (
      <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-2xl shadow-2xl p-8 my-12">
        <div className="text-center">
          <CheckCircle2 className="w-20 h-20 text-red-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-300 to-amber-300 bg-clip-text text-transparent mb-3">Order Confirmed!</h2>
          <p className="text-gray-300 mb-2">Order #{orderId}</p>
          <p className="text-gray-400 mb-2">We'll have your sushi ready for pickup at:</p>
          <p className="text-2xl font-semibold text-red-200 mb-8">{new Date(pickupAt).toLocaleString()}</p>
          <p className="text-sm text-gray-400 mb-8">You'll receive a confirmation text shortly.</p>
          <button 
            onClick={() => { setOrderSuccess(false); setOrderId(null); }}
            className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-4 rounded-lg hover:from-red-500 hover:to-red-700 transition shadow-lg shadow-red-900/50"
          >
            Place Another Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2 space-y-6">
            {menu.map(category => (
              <div key={category.id} className="bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-2xl shadow-2xl p-6">
                <h3 className="text-2xl font-semibold text-red-300 mb-2 font-serif">{category.name}</h3>
                {category.description && <p className="text-sm text-gray-400 mb-4 italic">{category.description}</p>}
                
                <div className="space-y-4">
                  {category.items.map(item => (
                    <div key={item.id} className="border border-red-900/20 bg-gradient-to-r from-slate-900/50 to-red-950/30 rounded-xl p-4 hover:border-red-700/50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-200 text-lg">{item.name}</h4>
                          {item.description && <p className="text-sm text-gray-400">{item.description}</p>}
                          {item.allergens && (
                            <p className="text-xs text-amber-500 mt-1">⚠️ Contains: {item.allergens}</p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-semibold text-red-300 text-lg">${(item.priceCents / 100).toFixed(2)}</div>
                          <button
                            onClick={() => addToCart(item)}
                            className="mt-2 bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg hover:from-red-500 hover:to-red-700 text-sm transition shadow-lg shadow-red-900/30"
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
          </div>

          {/* Cart & Checkout Section */}
          <div className="lg:col-span-1">
            <div className="bg-black/60 backdrop-blur-sm border border-red-900/30 rounded-2xl shadow-2xl p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-red-300 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Your Order
              </h3>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="border-b border-red-900/30 pb-3">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <div className="font-medium text-red-200">{item.menuItem.name}</div>
                          {item.selectedCustomizations.length > 0 && (
                            <div className="text-xs text-gray-400 mt-1">
                              {item.selectedCustomizations.map(cId => {
                                const c = item.menuItem.customizations.find(opt => opt.id === cId)
                                return c ? `+ ${c.name}` : null
                              }).filter(Boolean).join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <button onClick={() => updateQty(index, -1)} className="w-6 h-6 border border-red-700/50 rounded flex items-center justify-center hover:bg-red-900/30 text-red-300">-</button>
                          <span className="w-8 text-center font-medium text-red-200">{item.qty}</span>
                          <button onClick={() => updateQty(index, 1)} className="w-6 h-6 border border-red-700/50 rounded flex items-center justify-center hover:bg-red-900/30 text-red-300">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 border-t border-red-900/30 pt-4">
                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-medium text-red-300">Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full border border-red-900/30 bg-slate-900/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-red-100 placeholder-gray-500"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-medium text-red-300">Phone *</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full border border-red-900/30 bg-slate-900/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-red-100 placeholder-gray-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-medium text-red-300">Email (optional)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full border border-red-900/30 bg-slate-900/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-red-100 placeholder-gray-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-medium text-red-300">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Pickup Time
                  </label>
                  <input
                    type="datetime-local"
                    value={pickupAt}
                    onChange={e => setPickupAt(e.target.value)}
                    className="w-full border border-red-900/30 bg-slate-900/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-red-100"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-medium text-red-300">Tip</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 15, 18, 20].map(pct => (
                      <button
                        key={pct}
                        onClick={() => setTipPercent(pct)}
                        className={`py-2 rounded border transition ${
                          tipPercent === pct 
                            ? 'bg-gradient-to-r from-red-600 to-red-800 text-white border-red-600' 
                            : 'bg-slate-900/50 text-red-300 border-red-900/30 hover:border-red-700/50'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-red-200">${(calculateSubtotal() / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span className="text-red-200">${(calculateTax() / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tip ({tipPercent}%)</span>
                    <span className="text-red-200">${(calculateTip() / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-red-300 pt-2 border-t border-red-900/30">
                    <span>Total</span>
                    <span>${(calculateTotal() / 100).toFixed(2)}</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3 flex items-start gap-2 text-sm text-red-300">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={placeOrder}
                  disabled={loading || cart.length === 0}
                  className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-lg font-semibold hover:from-red-500 hover:to-red-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed transition shadow-lg shadow-red-900/50"
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
    <div className="mt-3 p-4 bg-slate-900/80 rounded-lg border border-red-900/30">
      {item.customizations.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-medium text-red-300 mb-2">Customizations</p>
          <div className="space-y-2">
            {item.customizations.map(c => (
              <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCustomizations.includes(c.id)}
                  onChange={() => toggleCustomization(c.id)}
                  className="rounded border-red-700 text-red-600 focus:ring-red-500 bg-slate-900"
                />
                <span className="text-sm text-gray-300">
                  {c.name} {c.priceCents > 0 && `(+$${(c.priceCents / 100).toFixed(2)})`}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-red-300 mb-1">Special request (optional)</label>
        <input
          type="text"
          value={specialRequest}
          onChange={e => setSpecialRequest(e.target.value)}
          className="w-full border border-red-900/30 bg-slate-900/50 rounded px-2 py-1 text-sm text-red-100 placeholder-gray-500"
          placeholder="e.g., no wasabi, extra ginger..."
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onConfirm(item, selectedCustomizations, specialRequest)}
          className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded hover:from-red-500 hover:to-red-700 text-sm transition shadow-lg shadow-red-900/30"
        >
          Add to Cart
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-red-900/30 bg-slate-900/50 rounded hover:bg-slate-800/50 text-sm text-red-300"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
