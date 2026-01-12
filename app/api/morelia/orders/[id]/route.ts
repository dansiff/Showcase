import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderNotification } from '@/lib/notifications'

// GET /api/morelia/orders/[id] - Get single order
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (err: any) {
    console.error('Order fetch error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch order' }, { status: 500 })
  }
}

// PATCH /api/morelia/orders/[id] - Update order status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, notes } = await req.json()

    if (!['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            notes: notes || null
          }
        }
      },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return NextResponse.json({ order })
  } catch (err: any) {
    console.error('Order update error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update order' }, { status: 500 })
  }
}
