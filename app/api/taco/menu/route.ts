import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/taco/menu - fetch full menu with categories
export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        items: {
          where: { available: true },
          orderBy: { displayOrder: 'asc' },
          include: {
            customizations: {
              where: { available: true }
            }
          }
        }
      }
    })
    return NextResponse.json({ categories })
  } catch (err: any) {
    console.error('menu fetch error', err)
    return NextResponse.json({ error: err.message || 'server error' }, { status: 500 })
  }
}
