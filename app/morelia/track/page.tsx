"use client";

import { useState } from 'react';
import { Search, Clock, CheckCircle, Package, Utensils, AlertCircle } from 'lucide-react';

type Order = {
  id: string
  customerName: string
  customerPhone: string
  status: string
  pickupAt: string
  createdAt: string
  totalCents: number
  items: Array<{
    name: string
    qty: number
  }>
}

const STATUS_INFO: Record<string, { icon: any; color: string; message: string }> = {
  pending: {
    icon: Clock,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    message: "We've received your order and will confirm shortly!"
  },
  confirmed: {
    icon: CheckCircle,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    message: "Your order is confirmed! We're preparing your food."
  },
  preparing: {
    icon: Utensils,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    message: "Your delicious food is being prepared right now!"
  },
  ready: {
    icon: Package,
    color: 'text-green-600 bg-green-50 border-green-200',
    message: "Your order is ready for pickup! Come get it while it's hot!"
  },
  completed: {
    icon: CheckCircle,
    color: 'text-gray-600 bg-gray-50 border-gray-200',
    message: "Thank you for your order! Hope to see you again soon!"
  },
  cancelled: {
    icon: AlertCircle,
    color: 'text-red-600 bg-red-50 border-red-200',
    message: "This order was cancelled. Please contact us if you have questions."
  }
}

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function searchOrders() {
    if (!phone.trim()) {
      setError('Please enter your phone number')
      return
    }

    setLoading(true)
    setError(null)
    setSearched(false)

    try {
      const cleanPhone = phone.replace(/\D/g, '')
      const res = await fetch(`/api/morelia/orders?phone=${encodeURIComponent(cleanPhone)}`)
      const data = await res.json()

      setOrders(data.orders || [])
      setSearched(true)
    } catch (err) {
      setError('Failed to search orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-red-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-700">
            Enter your phone number to check your order status
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex gap-4">
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && searchOrders()}
              className="flex-1 border-2 border-gray-300 rounded-lg px-6 py-4 text-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              onClick={searchOrders}
              disabled={loading}
              className="bg-red-900 hover:bg-red-800 disabled:bg-gray-400 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg disabled:transform-none flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-600">
                  We couldn't find any orders with that phone number.
                </p>
                <p className="text-gray-600 mt-2">
                  Make sure you entered the same number you used when ordering.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-red-900">
                    Found {orders.length} Order{orders.length !== 1 ? 's' : ''}
                  </h2>
                </div>

                {orders.map(order => {
                  const statusInfo = STATUS_INFO[order.status] || STATUS_INFO.pending
                  const StatusIcon = statusInfo.icon

                  return (
                    <div key={order.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
                      {/* Status Header */}
                      <div className={`p-6 border-b-2 ${statusInfo.color}`}>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="p-3 bg-white rounded-full shadow-md">
                            <StatusIcon className="w-8 h-8" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-2xl capitalize">{order.status}</div>
                            <div className="text-sm opacity-75">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                          </div>
                        </div>
                        <p className="text-sm font-medium">{statusInfo.message}</p>
                      </div>

                      {/* Order Details */}
                      <div className="p-6 space-y-4">
                        {/* Pickup Time */}
                        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-amber-700" />
                            <div>
                              <div className="text-sm text-amber-900 font-medium">Pickup Time</div>
                              <div className="text-lg font-bold text-amber-900">
                                {new Date(order.pickupAt).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-amber-900">
                              {new Date(order.pickupAt).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Your Items:</h4>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-900">{item.name}</span>
                                <span className="font-semibold text-gray-700">x{item.qty}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total */}
                        <div className="border-t-2 border-gray-200 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">Total Paid</span>
                            <span className="text-2xl font-bold text-red-900">
                              ${(order.totalCents / 100).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Order Time */}
                        <div className="text-center text-sm text-gray-500">
                          Order placed: {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">Need help with your order?</p>
          <p className="text-red-900 font-semibold text-lg">Call us: [Add Phone Number]</p>
        </div>
      </div>
    </div>
  )
}
