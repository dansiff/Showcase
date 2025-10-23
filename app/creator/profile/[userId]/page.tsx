import { createSupabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import LikeButton from './LikeButton';

async function getCreatorProfile(userId: string, viewerId?: string) {
  const creator = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      creator: true,
      posts: {
        where: { isPublished: true },
        include: {
          likes: viewerId ? {
            where: { userId: viewerId }
          } : false,
          _count: {
            select: { likes: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!creator || !creator.creator) {
    return null;
  }

  return creator;
}

export default async function CreatorProfile({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  
  // Get current viewer
  const supabase = await createSupabaseServerClient();
  const { data: { user: viewer } } = await supabase.auth.getUser();
  
  const data = await getCreatorProfile(userId, viewer?.id);

  if (!data) {
    notFound();
  }

  const totalLikes = data.posts.reduce((sum, post) => sum + post._count.likes, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      {/* Creator Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold">
            {data.creator?.displayName?.[0]?.toUpperCase() || data.email[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{data.creator?.displayName || data.email}</h1>
            <p className="text-gray-400">
              Content creator on Showcase
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{data.posts.length}</div>
            <div className="text-sm text-gray-400">Posts</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-pink-400">{totalLikes}</div>
            <div className="text-sm text-gray-400">Likes</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">0</div>
            <div className="text-sm text-gray-400">Subscribers</div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Posts</h2>
        {data.posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No posts yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.posts.map((post) => (
              <div key={post.id} className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800/70 transition-colors">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-3">{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <LikeButton
                    postId={post.id}
                    initialLikes={post._count.likes}
                    initialIsLiked={post.likes && post.likes.length > 0}
                    viewerId={viewer?.id}
                  />
                  {post.isPremium && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                      Premium
                    </span>
                  )}
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
