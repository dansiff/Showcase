"use client"

import { useState, useEffect } from 'react'
import { ShoppingBag, Clock, Phone, Mail, AlertCircle, CheckCircle2, Leaf } from 'lucide-react'

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

export default function ItalianOrder() {
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
    // Mock Italian menu data
    setMenu([
      {
        id: 'antipasti',
        name: 'Antipasti',
        description: 'Traditional Italian starters',
        items: [
          { id: '1', sku: 'antipasti-bruschetta', name: 'Bruschetta al Pomodoro', description: 'Toasted bread, fresh tomatoes, basil, garlic', priceCents: 950, allergens: 'gluten', customizations: [{ id: 'c1', name: 'Extra mozzarella', priceCents: 200 }] },
          { id: '2', sku: 'antipasti-caprese', name: 'Insalata Caprese', description: 'Buffalo mozzarella, vine tomatoes, fresh basil, EVOO', priceCents: 1200, allergens: 'dairy', customizations: [{ id: 'c2', name: 'Add prosciutto', priceCents: 400 }] },
          { id: '3', sku: 'antipasti-calamari', name: 'Calamari Fritti', description: 'Lightly fried squid with lemon aioli', priceCents: 1400, allergens: 'shellfish,gluten', customizations: [] }
        ]
      },
      {
        id: 'pasta',
        name: 'Pasta Fresca',
        description: 'House-made pasta dishes',
        items: [
          { id: '4', sku: 'pasta-carbonara', name: 'Spaghetti Carbonara', description: 'Eggs, pecorino, guanciale, black pepper', priceCents: 1800, allergens: 'gluten,dairy,eggs', customizations: [{ id: 'c3', name: 'Extra guanciale', priceCents: 300 }] },
          { id: '5', sku: 'pasta-amatriciana', name: 'Bucatini all\'Amatriciana', description: 'Tomato sauce, guanciale, pecorino romano', priceCents: 1700, allergens: 'gluten,dairy', customizations: [{ id: 'c4', name: 'Extra spicy', priceCents: 0 }] },
          { id: '6', sku: 'pasta-pesto', name: 'Trofie al Pesto', description: 'Fresh basil pesto, pine nuts, parmigiano', priceCents: 1600, allergens: 'gluten,dairy,nuts', customizations: [{ id: 'c5', name: 'Add cherry tomatoes', priceCents: 150 }] },
          { id: '7', sku: 'pasta-lasagna', name: 'Lasagna alla Bolognese', description: 'Layers of pasta, meat ragù, béchamel', priceCents: 1900, allergens: 'gluten,dairy', customizations: [] }
        ]
      },
      {
        id: 'pizza',
        name: 'Pizza Napoletana',
        description: 'Wood-fired traditional pizzas',
        items: [
          { id: '8', sku: 'pizza-margherita', name: 'Pizza Margherita', description: 'San Marzano tomatoes, mozzarella, basil', priceCents: 1500, allergens: 'gluten,dairy', customizations: [{ id: 'c6', name: 'Extra mozzarella', priceCents: 250 }, { id: 'c7', name: 'Add prosciutto', priceCents: 400 }] },
          { id: '9', sku: 'pizza-diavola', name: 'Pizza Diavola', description: 'Tomato, mozzarella, spicy salami', priceCents: 1700, allergens: 'gluten,dairy', customizations: [{ id: 'c8', name: 'Extra salami', priceCents: 300 }] },
          { id: '10', sku: 'pizza-quattro', name: 'Quattro Formaggi', description: 'Four cheese blend: gorgonzola, parmigiano, mozzarella, fontina', priceCents: 1800, allergens: 'gluten,dairy', customizations: [{ id: 'c9', name: 'Add honey drizzle', priceCents: 100 }] }
        ]
      },
      {
        id: 'dolci',
        name: 'Dolci',
        description: 'Traditional desserts',
        items: [
          { id: '11', sku: 'dolci-tiramisu', name: 'Tiramisù', description: 'Coffee-soaked ladyfingers, mascarpone cream', priceCents: 850, allergens: 'gluten,dairy,eggs', customizations: [] },
          { id: '12', sku: 'dolci-panna', name: 'Panna Cotta', description: 'Vanilla cream with berry compote', priceCents: 750, allergens: 'dairy', customizations: [] }
        ]
      }
    ])
    
    const now = new Date()
    now.setMinutes(now.getMinutes() + 35)
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
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border-4 border-green-800 p-8 my-12">
          <div className="text-center">
            <CheckCircle2 className="w-20 h-20 text-green-700 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-green-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>Grazie Mille!</h2>
            <p className="text-gray-700 mb-2">Order #{orderId}</p>
            <p className="text-gray-600 mb-2">Your Italian feast will be ready for pickup at:</p>
            <p className="text-2xl font-semibold text-green-800 mb-8">{new Date(pickupAt).toLocaleString()}</p>
            <p className="text-sm text-gray-500 mb-8 italic">You'll receive a confirmation text shortly.</p>
            <button 
              onClick={() => { setOrderSuccess(false); setOrderId(null); }}
              className="bg-gradient-to-r from-green-700 to-green-900 text-white px-8 py-4 rounded-full hover:from-green-600 hover:to-green-800 transition shadow-lg text-lg font-semibold"
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
              <div key={category.id} className="bg-white/90 backdrop-blur-sm border-4 border-green-800 rounded-3xl shadow-xl p-6">
                <h3 className="text-3xl font-bold text-green-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>{category.name}</h3>
                {category.description && <p className="text-sm text-green-700 mb-4 italic">{category.description}</p>}
                
                <div className="space-y-4">
                  {category.items.map(item => (
                    <div key={item.id} className="border-2 border-green-600 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 hover:border-green-800 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-green-900 text-lg" style={{ fontFamily: 'Georgia, serif' }}>{item.name}</h4>
                          {item.description && <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>}
                          {item.allergens && (
                            <p className="text-xs text-orange-700 mt-1 font-semibold">⚠️ Allergens: {item.allergens}</p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-green-800 text-xl">${(item.priceCents / 100).toFixed(2)}</div>
                          <button
                            onClick={() => addToCart(item)}
                            className="mt-2 bg-gradient-to-r from-green-700 to-green-900 text-white px-5 py-2 rounded-full hover:from-green-600 hover:to-green-800 text-sm transition shadow-md font-semibold"
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
            <div className="bg-white/95 backdrop-blur-sm border-4 border-green-800 rounded-3xl shadow-2xl p-6 sticky top-4">
              <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                <ShoppingBag className="w-6 h-6" />
                Il Tuo Ordine
              </h3>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8 italic">Your cart is empty</p>
              ) : (
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="border-b-2 border-green-200 pb-3">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <div className="font-semibold text-green-900">{item.menuItem.name}</div>
                          {item.selectedCustomizations.length > 0 && (
                            <div className="text-xs text-gray-600 mt-1">
                              {item.selectedCustomizations.map(cId => {
                                const c = item.menuItem.customizations.find(opt => opt.id === cId)
                                return c ? `+ ${c.name}` : null
                              }).filter(Boolean).join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <button onClick={() => updateQty(index, -1)} className="w-7 h-7 border-2 border-green-700 rounded-full flex items-center justify-center hover:bg-green-100 text-green-800 font-bold">-</button>
                          <span className="w-8 text-center font-bold text-green-900">{item.qty}</span>
                          <button onClick={() => updateQty(index, 1)} className="w-7 h-7 border-2 border-green-700 rounded-full flex items-center justify-center hover:bg-green-100 text-green-800 font-bold">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 border-t-2 border-green-800 pt-4">
                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-bold text-green-900">Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full border-2 border-green-600 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-700 text-gray-900 placeholder-gray-400"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-bold text-green-900">Phone *</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full border-2 border-green-600 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-700 text-gray-900 placeholder-gray-400"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-bold text-green-900">Email (optional)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full border-2 border-green-600 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-700 text-gray-900 placeholder-gray-400"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-bold text-green-900">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Pickup Time
                  </label>
                  <input
                    type="datetime-local"
                    value={pickupAt}
                    onChange={e => setPickupAt(e.target.value)}
                    className="w-full border-2 border-green-600 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-700 text-gray-900"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-bold text-green-900">Gratuity</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 15, 18, 20].map(pct => (
                      <button
                        key={pct}
                        onClick={() => setTipPercent(pct)}
                        className={`py-2 rounded-xl border-2 transition font-semibold ${
                          tipPercent === pct 
                            ? 'bg-gradient-to-r from-green-700 to-green-900 text-white border-green-800' 
                            : 'bg-white text-green-800 border-green-600 hover:border-green-800'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold text-green-900">${(calculateSubtotal() / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span className="font-semibold text-green-900">${(calculateTax() / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Gratuity ({tipPercent}%)</span>
                    <span className="font-semibold text-green-900">${(calculateTip() / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-green-900 pt-2 border-t-2 border-green-800">
                    <span>Totale</span>
                    <span>${(calculateTotal() / 100).toFixed(2)}</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-500 rounded-xl p-3 flex items-start gap-2 text-sm text-red-800">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={placeOrder}
                  disabled={loading || cart.length === 0}
                  className="w-full bg-gradient-to-r from-green-700 to-green-900 text-white py-4 rounded-full font-bold text-lg hover:from-green-600 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition shadow-lg"
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
    <div className="mt-3 p-4 bg-amber-50 rounded-2xl border-2 border-green-600">
      {item.customizations.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-bold text-green-900 mb-2">Personalizza</p>
          <div className="space-y-2">
            {item.customizations.map(c => (
              <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCustomizations.includes(c.id)}
                  onChange={() => toggleCustomization(c.id)}
                  className="rounded border-green-700 text-green-700 focus:ring-green-500"
                />
                <span className="text-sm text-gray-800 font-medium">
                  {c.name} {c.priceCents > 0 && `(+$${(c.priceCents / 100).toFixed(2)})`}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-3">
        <label className="block text-sm font-bold text-green-900 mb-1">Richieste Speciali (optional)</label>
        <input
          type="text"
          value={specialRequest}
          onChange={e => setSpecialRequest(e.target.value)}
          className="w-full border-2 border-green-600 bg-white rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400"
          placeholder="e.g., extra crispy, well done..."
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onConfirm(item, selectedCustomizations, specialRequest)}
          className="flex-1 bg-gradient-to-r from-green-700 to-green-900 text-white px-4 py-2 rounded-full hover:from-green-600 hover:to-green-800 text-sm transition shadow-md font-semibold"
        >
          Add to Cart
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border-2 border-green-600 bg-white rounded-full hover:bg-amber-50 text-sm text-green-900 font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
