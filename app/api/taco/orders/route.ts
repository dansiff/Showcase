import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customerName, customerPhone, pickupAt, items } = body
    if (!customerName || !customerPhone || !pickupAt || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 })
    }

    // compute totals
    const menuMap: Record<string, number> = {
      t1: 450,
      t2: 400,
      t3: 375,
      bowl: 850
    }

    let total = 0
    const createdItems = items.map((it: any) => {
      const unit = menuMap[it.id] ?? 0
      const qty = Number(it.qty) || 0
      total += unit * qty
      return { sku: it.id, qty, unitCents: unit }
    })

  const order = await (prisma as any)["order"].create({
      data: {
        customerName,
        customerPhone,
        pickupAt: new Date(pickupAt),
        totalCents: total,
        items: { create: createdItems }
      },
      include: { items: true }
    })

    return NextResponse.json({ id: order.id, total: order.totalCents })
  } catch (err: any) {
    console.error('order error', err)
    return NextResponse.json({ error: err.message || 'server error' }, { status: 500 })
  }
}
