import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/game/scores?game=snake&limit=10
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const game = searchParams.get('game');
    if (!game) return NextResponse.json({ error: 'game param required' }, { status: 400 });
    const limit = Number(searchParams.get('limit') || '10');
    const scores = await (prisma as any).gameScore.findMany({
      where: { game },
      orderBy: [{ score: 'desc' }, { createdAt: 'asc' }],
      take: Math.min(limit, 50)
    });
    return NextResponse.json({ scores });
  } catch (e: any) {
    console.error('scores GET error', e);
    return NextResponse.json({ error: e.message || 'server error' }, { status: 500 });
  }
}

// POST /api/game/scores { game, name?, score }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { game, name, score } = body;
    if (!game || typeof score !== 'number') {
      return NextResponse.json({ error: 'game and numeric score required' }, { status: 400 });
    }
    const created = await (prisma as any).gameScore.create({ data: { game, name: name?.slice(0,40) || null, score } });
    return NextResponse.json({ id: created.id });
  } catch (e: any) {
    console.error('scores POST error', e);
    return NextResponse.json({ error: e.message || 'server error' }, { status: 500 });
  }
}
