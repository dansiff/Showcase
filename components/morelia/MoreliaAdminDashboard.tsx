"use client";

import { useState, useEffect } from 'react';
import { Phone, Mail, Clock, ChevronDown, ChevronUp, RefreshCw, CheckCircle, AlertCircle, DollarSign, ShoppingBag } from 'lucide-react';

type Order = {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string | null
  subtotalCents: number
  taxCents: number
  tipCents: number
  totalCents: number
  status: string
  pickupAt: string
  specialInstructions?: string | null
  createdAt: string
  items: Array<{
    id: string
    name: string
    qty: number
    unitCents: number
    customizations: any[]
    specialRequest?: string | null
  }>
  statusHistory: Array<{
    id: string
    status: string
    note?: string | null
    createdAt: string
  }>
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  preparing: 'bg-purple-100 text-purple-800 border-purple-300',
  ready: 'bg-green-100 text-green-800 border-green-300',
  completed: 'bg-gray-100 text-gray-800 border-gray-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300'
}

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'completed']

export default function MoreliaAdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)

  async function fetchOrders() {
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.set('status', filterStatus)
      
      const res = await fetch(`/api/morelia/orders?${params}`)
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [filterStatus])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(fetchOrders, 30000) // 30 seconds
    return () => clearInterval(interval)
  }, [autoRefresh, filterStatus])

  async function updateOrderStatus(orderId: string, status: string, notes?: string) {
    try {
      const res = await fetch(`/api/morelia/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      })
      
      if (res.ok) {
        await fetchOrders()
      }
    } catch (err) {
      console.error('Failed to update order:', err)
    }
  }

  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status))
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalCents, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-red-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Orders</p>
              <p className="text-3xl font-bold text-red-900">{activeOrders.length}</p>
            </div>
            <ShoppingBag className="w-10 h-10 text-red-900 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${(totalRevenue / 100).toFixed(2)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-amber-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Preparing</p>
              <p className="text-3xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'preparing').length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-purple-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={e => setAutoRefresh(e.target.checked)}
            className="w-4 h-4 text-red-900 rounded focus:ring-red-500"
          />
          <span className="text-sm text-gray-700">Auto-refresh (30s)</span>
        </label>

        <button
          onClick={fetchOrders}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-semibold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                    <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border font-semibold text-sm ${STATUS_COLORS[order.status]}`}>
                    {order.status.toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedOrder === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Order Details (Expandable) */}
              {expandedOrder === order.id && (
                <div className="p-4 space-y-4">
                  {/* Customer Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Customer Information</h4>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Name:</span> {order.customerName}</div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{order.customerPhone}</span>
                        </div>
                        {order.customerEmail && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{order.customerEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Pickup Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(order.pickupAt).toLocaleString()}</span>
                        </div>
                        {order.specialInstructions && (
                          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                            <span className="font-medium">Special Instructions:</span>
                            <div className="text-gray-700 mt-1">{order.specialInstructions}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">Order Items</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3 font-medium text-gray-700">Item</th>
                            <th className="text-center p-3 font-medium text-gray-700">Qty</th>
                            <th className="text-right p-3 font-medium text-gray-700">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {order.items.map(item => (
                            <tr key={item.id}>
                              <td className="p-3">
                                <div className="font-medium">{item.name}</div>
                                {item.customizations && item.customizations.length > 0 && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    {item.customizations.map((c: any) => c.name).join(', ')}
                                  </div>
                                )}
                                {item.specialRequest && (
                                  <div className="text-xs text-amber-700 mt-1">Note: {item.specialRequest}</div>
                                )}
                              </td>
                              <td className="p-3 text-center">{item.qty}</td>
                              <td className="p-3 text-right">${((item.unitCents + 
                                (item.customizations || []).reduce((sum: number, c: any) => sum + (c.priceCents || 0), 0)) * item.qty / 100).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                          <tr>
                            <td colSpan={2} className="p-3 text-right font-medium">Subtotal</td>
                            <td className="p-3 text-right">${(order.subtotalCents / 100).toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="p-3 text-right">Tax</td>
                            <td className="p-3 text-right">${(order.taxCents / 100).toFixed(2)}</td>
                          </tr>
                          {order.tipCents > 0 && (
                            <tr>
                              <td colSpan={2} className="p-3 text-right">Tip</td>
                              <td className="p-3 text-right">${(order.tipCents / 100).toFixed(2)}</td>
                            </tr>
                          )}
                          <tr className="font-bold">
                            <td colSpan={2} className="p-3 text-right">Total</td>
                            <td className="p-3 text-right text-red-900">${(order.totalCents / 100).toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_FLOW.map(status => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order.id, status)}
                          disabled={order.status === status}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            order.status === status
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-red-900 hover:bg-red-800 text-white'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="px-4 py-2 rounded-lg font-medium text-sm bg-red-100 hover:bg-red-200 text-red-800 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>

                  {/* Status History */}
                  {order.statusHistory && order.statusHistory.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Status History</h4>
                      <div className="space-y-2">
                        {order.statusHistory.map(history => (
                          <div key={history.id} className="text-sm flex items-start gap-2 p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <span className="font-medium">{history.status}</span>
                              {history.note && <span className="text-gray-600"> - {history.note}</span>}
                            </div>
                            <span className="text-gray-500 text-xs whitespace-nowrap">
                              {new Date(history.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
