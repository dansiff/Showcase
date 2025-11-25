"use client"

import { useState, useEffect } from 'react'
import { Clock, Phone, Mail, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

type Order = {
  id: string
  createdAt: string
  customerName: string
  customerEmail?: string
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
  sku: string
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

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  preparing: 'bg-purple-100 text-purple-800 border-purple-300',
  ready: 'bg-green-100 text-green-800 border-green-300',
  completed: 'bg-gray-100 text-gray-800 border-gray-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300'
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [statusFilter])

  async function fetchOrders() {
    try {
      const url = statusFilter === 'all' 
        ? '/api/taco/orders?limit=100' 
        : `/api/taco/orders?status=${statusFilter}&limit=100`
      
      const res = await fetch(url, { cache: 'no-store' })
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (e) {
      console.error('Failed to fetch orders:', e)
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string, note?: string) {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/taco/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note })
      })
      
      if (!res.ok) throw new Error('Failed to update status')
      
      await fetchOrders() // Refresh list
    } catch (e) {
      alert('Failed to update order status')
    } finally {
      setUpdating(null)
    }
  }

  function getUpcomingOrders() {
    const now = new Date()
    return orders.filter(o => {
      if (o.status === 'completed' || o.status === 'cancelled') return false
      return new Date(o.pickupAt) > now
    })
  }

  function getActiveOrders() {
    return orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status))
  }

  const displayOrders = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter)

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading orders...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header & Stats */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Manage incoming taco orders and update their status</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Active Orders</div>
            <div className="text-2xl font-bold text-gray-900">{getActiveOrders().length}</div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Upcoming Pickups</div>
            <div className="text-2xl font-bold text-gray-900">{getUpcomingOrders().length}</div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Total Today</div>
            <div className="text-2xl font-bold text-gray-900">
              ${(orders.filter(o => {
                const today = new Date().toDateString()
                return new Date(o.createdAt).toDateString() === today
              }).reduce((sum, o) => sum + o.totalCents, 0) / 100).toFixed(2)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Average Order</div>
            <div className="text-2xl font-bold text-gray-900">
              ${orders.length > 0 ? (orders.reduce((sum, o) => sum + o.totalCents, 0) / orders.length / 100).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg border transition ${
                statusFilter === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
              }`}
            >
              All ({orders.length})
            </button>
            {STATUS_OPTIONS.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg border transition capitalize ${
                  statusFilter === status
                    ? STATUS_COLORS[status]
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {status} ({orders.filter(o => o.status === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {displayOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            displayOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.customerName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          #{order.id.slice(0, 8)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {order.customerPhone}
                        </span>
                        {order.customerEmail && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {order.customerEmail}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Pickup: {new Date(order.pickupAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-gray-900">
                        ${(order.totalCents / 100).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items.reduce((sum, item) => sum + item.qty, 0)} items
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {STATUS_OPTIONS.filter(s => s !== order.status).map(status => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(order.id, status)}
                        disabled={updating === order.id}
                        className={`px-3 py-1.5 rounded text-xs font-medium border transition capitalize ${STATUS_COLORS[status]} hover:opacity-80 disabled:opacity-50`}
                      >
                        Mark {status}
                      </button>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mb-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-700 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-yellow-800 mb-1">Special Instructions</div>
                        <div className="text-sm text-yellow-900">{order.specialInstructions}</div>
                      </div>
                    </div>
                  )}

                  {/* Expandable Details */}
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    {expandedOrder === order.id ? (
                      <>
                        <ChevronUp className="w-4 h-4" /> Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" /> Show Details
                      </>
                    )}
                  </button>

                  {expandedOrder === order.id && (
                    <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map(item => (
                            <div key={item.id} className="flex justify-between items-start text-sm bg-gray-50 rounded p-2">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {item.qty}x {item.name}
                                </div>
                                {item.customizations && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    {JSON.parse(item.customizations).map((c: any) => c.name).join(', ')}
                                  </div>
                                )}
                                {item.specialRequest && (
                                  <div className="text-xs text-gray-500 italic mt-1">{item.specialRequest}</div>
                                )}
                              </div>
                              <div className="text-gray-700 font-medium ml-4">
                                ${((item.unitCents * item.qty) / 100).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Breakdown */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Order Breakdown</h4>
                        <div className="space-y-1 text-sm">
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
                          <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t border-gray-200">
                            <span>Total</span>
                            <span>${(order.totalCents / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status History */}
                      {order.statusHistory && order.statusHistory.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Status History</h4>
                          <div className="space-y-2">
                            {order.statusHistory.map(history => (
                              <div key={history.id} className="text-sm flex justify-between items-start bg-gray-50 rounded p-2">
                                <div>
                                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[history.status]}`}>
                                    {history.status}
                                  </span>
                                  {history.note && <span className="text-gray-600 ml-2">{history.note}</span>}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(history.createdAt).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Order placed: {new Date(order.createdAt).toLocaleString()}</div>
                        {order.estimatedReadyAt && (
                          <div>Estimated ready: {new Date(order.estimatedReadyAt).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
