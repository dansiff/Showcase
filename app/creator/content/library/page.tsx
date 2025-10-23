// app/creator/content/library/page.tsx
// Creator portal: view and manage all content

import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Content Library — The Fusion Space",
  description: "Manage all your content",
};

async function getCreatorContent() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: authUser.email! },
    include: {
      creator: true,
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          likes: true,
        },
      },
    },
  });

  if (!user?.creator) {
    redirect("/portal");
  }

  return { user, creator: user.creator, posts: user.posts };
}

export default async function ContentLibrary() {
  const { user, creator, posts } = await getCreatorContent();

  const publishedPosts = posts.filter((p) => p.isPublished);
  const draftPosts = posts.filter((p) => !p.isPublished);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Content Library
              </h1>
              <p className="mt-1 text-gray-600">
                Manage all your posts in one place
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/creator/content/upload"
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                + New Post
              </Link>
              <Link
                href="/creator/dashboard"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                ← Dashboard
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 flex items-center gap-6 text-sm">
            <div>
              <span className="font-semibold text-gray-900">{posts.length}</span>
              <span className="text-gray-600"> total posts</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">{publishedPosts.length}</span>
              <span className="text-gray-600"> published</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">{draftPosts.length}</span>
              <span className="text-gray-600"> drafts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {posts.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No content yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start creating amazing content for your audience
            </p>
            <Link
              href="/creator/content/upload"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Published Posts */}
            {publishedPosts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Published ({publishedPosts.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publishedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {/* Media Preview */}
                      {post.imageUrl ? (
                        <div className="relative h-48 bg-gray-200">
                          <img
                            src={post.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {post.isPremium && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-indigo-600 text-white text-xs font-semibold rounded">
                              Premium
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-6xl">
                          📝
                          {post.isPremium && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded">
                              Premium
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4">
                        {post.title && (
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                            {post.title}
                          </h3>
                        )}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {post.content}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <span>❤️ {post.likes.length}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                            Edit
                          </button>
                          <button className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Draft Posts */}
            {draftPosts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Drafts ({draftPosts.length})
                </h2>
                <div className="space-y-4">
                  {draftPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl shadow-md p-6 flex items-start gap-4"
                    >
                      <div className="flex-1">
                        {post.title && (
                          <h3 className="font-bold text-gray-900 mb-1">
                            {post.title}
                          </h3>
                        )}
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            Draft • {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          {post.isPremium && (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition">
                          Publish
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
