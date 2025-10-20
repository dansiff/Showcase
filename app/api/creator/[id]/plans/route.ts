import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        creator: { userId: params.id },
        isActive: true
      },
      orderBy: { priceCents: 'asc' }
    });
    return NextResponse.json({ plans });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
