import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderNotification } from '@/lib/notifications'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customerName, customerEmail, customerPhone, pickupAt, items, specialInstructions, tipCents } = body
    
    if (!customerName || !customerPhone || !pickupAt || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Tax rate (example: 8.5%)
    const TAX_RATE = 0.085

    let subtotal = 0
    const createdItems = []

    for (const it of items) {
      const { sku, qty, customizations, specialRequest, name, unitCents } = it
      if (!sku || !qty || qty <= 0) continue
      
      // Use provided pricing (from client) - in production, validate against DB
      const itemTotal = unitCents * qty
      subtotal += itemTotal
      
      createdItems.push({
        sku,
        name: name || sku,
        qty: Number(qty),
        unitCents: Number(unitCents),
        customizations: customizations ? JSON.stringify(customizations) : null,
        specialRequest: specialRequest || null
      })
    }

    const taxCents = Math.round(subtotal * TAX_RATE)
    const totalCents = subtotal + taxCents + (tipCents || 0)

    // Calculate estimated ready time (15-30 mins based on order size)
    const prepMins = Math.min(15 + createdItems.reduce((sum, it) => sum + it.qty, 0) * 2, 30)
    const estimatedReadyAt = new Date(new Date(pickupAt).getTime() - 5 * 60000) // 5 mins before pickup

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail: customerEmail || null,
        customerPhone,
        pickupAt: new Date(pickupAt),
        status: 'pending',
        subtotalCents: subtotal,
        taxCents,
        tipCents: tipCents || 0,
        totalCents,
        specialInstructions: specialInstructions || null,
        estimatedReadyAt,
        items: { create: createdItems },
        statusHistory: {
          create: {
            status: 'pending',
            note: 'Order placed'
          }
        }
      },
      include: { items: true }
    })

    // Send notification (email/SMS/webhook)
    try {
      await sendOrderNotification({
        type: 'new_order',
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        totalCents: order.totalCents,
        itemCount: createdItems.reduce((sum, it) => sum + it.qty, 0),
        pickupAt: order.pickupAt.toISOString()
      })
    } catch (notifErr) {
      console.error('Notification error (non-blocking):', notifErr)
    }

    return NextResponse.json({ 
      success: true,
      orderId: order.id, 
      total: order.totalCents,
      estimatedReadyAt: order.estimatedReadyAt
    })
  } catch (err: any) {
    console.error('order error', err)
    return NextResponse.json({ error: err.message || 'server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const phone = searchParams.get('phone');
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    if (phone) {
      where.customerPhone = phone;
    }
    
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 200),
      include: { 
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });
    
    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error('orders list error', err);
    return NextResponse.json({ error: err.message || 'server error' }, { status: 500 });
  }
}
