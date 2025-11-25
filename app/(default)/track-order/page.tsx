"use client"

import { useState, useEffect } from 'react'
import { Search, Clock, CheckCircle2, AlertCircle, Package } from 'lucide-react'

type Order = {
  id: string
  createdAt: string
  customerName: string
  customerPhone: string
  pickupAt: string
  status: string
  subtotalCents: number
  taxCents: number
  tipCents: number
  totalCents: number
  specialInstructions?: string
  estimatedReadyAt?: string
  items: OrderItem[]
  statusHistory: StatusHistory[]
}

type OrderItem = {
  id: string
  name: string
  qty: number
  unitCents: number
  customizations?: string
  specialRequest?: string
}

type StatusHistory = {
  id: string
  status: string
  note?: string
  createdAt: string
}

const STATUS_INFO: Record<string, { icon: any, color: string, label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-600', label: 'Order Received' },
  confirmed: { icon: CheckCircle2, color: 'text-blue-600', label: 'Confirmed' },
  preparing: { icon: Package, color: 'text-purple-600', label: 'Being Prepared' },
  ready: { icon: CheckCircle2, color: 'text-green-600', label: 'Ready for Pickup' },
  completed: { icon: CheckCircle2, color: 'text-gray-600', label: 'Completed' },
  cancelled: { icon: AlertCircle, color: 'text-red-600', label: 'Cancelled' }
}

export default function OrderTrackingPage() {
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  async function searchOrders() {
    if (!phone.trim()) {
      setError('Please enter your phone number')
      return
    }

    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const res = await fetch(`/api/taco/orders?phone=${encodeURIComponent(phone.trim())}`)
      const data = await res.json()
      
      if (!res.ok) throw new Error(data?.error || 'Failed to find orders')
      
      setOrders(data.orders || [])
      if (data.orders.length === 0) {
        setError('No orders found for this phone number')
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      searchOrders()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your phone number to view your order status</p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={searchOrders}
                disabled={loading}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-2 text-sm text-red-800">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Orders List */}
        {searched && !loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map(order => {
              const statusInfo = STATUS_INFO[order.status] || STATUS_INFO.pending
              const StatusIcon = statusInfo.icon
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-sm opacity-90 mb-1">Order #{order.id.slice(0, 8)}</div>
                        <div className="text-2xl font-bold">{order.customerName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-90 mb-1">Total</div>
                        <div className="text-2xl font-bold">${(order.totalCents / 100).toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/20 rounded-lg p-3">
                      <StatusIcon className="w-6 h-6" />
                      <div>
                        <div className="font-semibold">{statusInfo.label}</div>
                        <div className="text-sm opacity-90">
                          {order.status === 'ready' && 'Your order is ready for pickup!'}
                          {order.status === 'preparing' && 'Your order is being prepared'}
                          {order.status === 'confirmed' && 'Your order has been confirmed'}
                          {order.status === 'pending' && 'Your order has been received'}
                          {order.status === 'completed' && 'Thank you for your order!'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6 space-y-6">
                    {/* Pickup Time */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                      <Clock className="w-6 h-6 text-emerald-600" />
                      <div>
                        <div className="text-sm text-gray-600">Pickup Time</div>
                        <div className="font-semibold text-gray-900">{new Date(order.pickupAt).toLocaleString()}</div>
                        {order.estimatedReadyAt && order.status !== 'ready' && order.status !== 'completed' && (
                          <div className="text-sm text-gray-600">Estimated ready: {new Date(order.estimatedReadyAt).toLocaleString()}</div>
                        )}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {order.specialInstructions && (
                      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                        <div className="text-sm font-medium text-yellow-800 mb-1">Special Instructions</div>
                        <div className="text-sm text-yellow-900">{order.specialInstructions}</div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between items-start border-b border-gray-200 pb-3">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {item.qty}x {item.name}
                              </div>
                              {item.customizations && (
                                <div className="text-sm text-gray-600 mt-1">
                                  {JSON.parse(item.customizations).map((c: any) => c.name).join(', ')}
                                </div>
                              )}
                              {item.specialRequest && (
                                <div className="text-sm text-gray-500 italic mt-1">{item.specialRequest}</div>
                              )}
                            </div>
                            <div className="text-gray-700 font-medium ml-4">
                              ${((item.unitCents * item.qty) / 100).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-700">
                          <span>Subtotal</span>
                          <span>${(order.subtotalCents / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Tax</span>
                          <span>${(order.taxCents / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Tip</span>
                          <span>${(order.tipCents / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg text-gray-900 pt-2 border-t border-gray-300">
                          <span>Total</span>
                          <span>${(order.totalCents / 100).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    {order.statusHistory && order.statusHistory.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Timeline</h3>
                        <div className="space-y-3">
                          {order.statusHistory.map((history, idx) => {
                            const historyStatusInfo = STATUS_INFO[history.status] || STATUS_INFO.pending
                            const HistoryIcon = historyStatusInfo.icon
                            
                            return (
                              <div key={history.id} className="flex gap-3">
                                <div className={`${historyStatusInfo.color} mt-1`}>
                                  <HistoryIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 capitalize">{history.status}</div>
                                  {history.note && <div className="text-sm text-gray-600">{history.note}</div>}
                                  <div className="text-xs text-gray-500 mt-1">
                                    {new Date(history.createdAt).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Order Date */}
                    <div className="text-sm text-gray-500 text-center pt-4 border-t border-gray-200">
                      Order placed: {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty State After Search */}
        {searched && !loading && orders.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">We couldn't find any orders for this phone number.</p>
          </div>
        )}
      </div>
    </div>
  )
}
