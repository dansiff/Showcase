import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/taco/orders/[id] - update order status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()
    const { status, note } = body

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await (prisma as any)["order"].update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            note: note || null
          }
        }
      },
      include: { 
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    return NextResponse.json({ success: true, order })
  } catch (err: any) {
    console.error('status update error', err)
    return NextResponse.json({ error: err.message || 'server error' }, { status: 500 })
  }
}

// GET /api/taco/orders/[id] - get single order
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const order = await (prisma as any)["order"].findUnique({
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
    console.error('order fetch error', err)
    return NextResponse.json({ error: err.message || 'server error' }, { status: 500 })
  }
}
