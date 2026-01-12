import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNotification } from '@/lib/notifications'

const TAX_RATE = 0.085 // 8.5% tax

// POST /api/morelia/orders - Create new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      pickupAt,
      items,
      specialInstructions,
      tipCents = 0
    } = body

    // Validation
    if (!customerName?.trim() || !customerPhone?.trim()) {
      return NextResponse.json({ error: 'Name and phone required' }, { status: 400 })
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart cannot be empty' }, { status: 400 })
    }

    // Calculate totals
    const subtotalCents = items.reduce((sum, item) => {
      const basePrice = (item.unitCents || 0) * (item.qty || 1)
      const customizationPrice = (item.customizations || []).reduce((cSum: number, c: any) => {
        return cSum + ((c.priceCents || 0) * (item.qty || 1))
      }, 0)
      return sum + basePrice + customizationPrice
    }, 0)

    const taxCents = Math.round(subtotalCents * TAX_RATE)
    const totalCents = subtotalCents + taxCents + (tipCents || 0)

    // Estimate ready time (30 mins from now if no pickupAt)
    const estimatedReadyAt = pickupAt 
      ? new Date(pickupAt) 
      : new Date(Date.now() + 30 * 60 * 1000)

    // Create order
    const order = await prisma.order.create({
      data: {
        customerName: customerName.trim(),
        customerEmail: customerEmail?.trim() || null,
        customerPhone: customerPhone.trim(),
        subtotalCents,
        taxCents,
        tipCents: tipCents || 0,
        totalCents,
        status: 'pending',
        pickupAt: estimatedReadyAt,
        specialInstructions: specialInstructions?.trim() || null,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            qty: item.qty || 1,
            unitCents: item.unitCents || 0,
            customizations: item.customizations || [],
            specialRequest: item.specialRequest || null
          }))
        },
        statusHistory: {
          create: {
            status: 'pending',
            notes: 'Order placed online'
          }
        }
      },
      include: {
        items: true
      }
    })

    // Send notifications (email, Slack, Discord)
    try {
      await sendNotification({
        type: 'new_order',
        order: {
          id: order.id,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          totalCents: order.totalCents,
          itemCount: items.length,
          pickupAt: estimatedReadyAt.toISOString()
        }
      })
    } catch (notifErr) {
      console.error('Notification error (non-blocking):', notifErr)
    }

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      totalCents: order.totalCents,
      estimatedReadyAt: estimatedReadyAt.toISOString()
    }, { status: 201 })

  } catch (err: any) {
    console.error('Order creation error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create order' }, { status: 500 })
  }
}

// GET /api/morelia/orders - Query orders by phone or status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const phone = searchParams.get('phone')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (phone) where.customerPhone = { contains: phone.replace(/\D/g, '') }
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return NextResponse.json({ orders })
  } catch (err: any) {
    console.error('Order query error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch orders' }, { status: 500 })
  }
}
