import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log('[API] /api/creator/[id]/posts called with id:', params.id);
    const start = Date.now();
    const posts = await (prisma as any).post.findMany({
      where: { authorId: params.id, isPublished: true },
      include: {
        likes: true,
        author: { select: { id: true, name: true, image: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    const elapsed = Date.now() - start;
    console.log(`[API] /api/creator/[id]/posts found ${posts.length} posts in ${elapsed}ms`);
    return NextResponse.json({ posts });
  } catch (err) {
    console.error('[API] /api/creator/[id]/posts error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
