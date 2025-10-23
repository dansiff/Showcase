// app/creator/dashboard/page.tsx
// Creator portal: overview dashboard with stats and quick actions

import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Creator Dashboard — The Fusion Space",
  description: "Manage your content and track performance",
};

async function getCreatorData() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/signin");
  }

  // Get user and verify they're a creator
  const user = await prisma.user.findUnique({
    where: { email: authUser.email! },
    include: {
      creator: true,
      posts: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          likes: true,
        },
      },
    },
  });

  if (!user?.creator) {
    redirect("/portal");
  }

  // Get content stats
  const totalPosts = await prisma.post.count({
    where: { authorId: user.id },
  });

  const totalLikes = await prisma.postLike.count({
    where: {
      post: {
        authorId: user.id,
      },
    },
  });

  // Affiliate features commented out for MVP - will re-enable after Prisma sync
  // const affiliate = await prisma.affiliate.findUnique({
  //   where: { userId: user.id },
  //   include: {
  //     _count: {
  //       select: {
  //         referrals: true,
  //       },
  //     },
  //   },
  // });

  // const totalReferrals = affiliate?._count.referrals || 0;
  // const totalCommissions = affiliate?.totalEarnedCents || 0;

  return {
    user,
    creator: user.creator,
    recentPosts: user.posts,
    stats: {
      totalPosts,
      totalLikes,
      totalReferrals: 0, // Disabled for MVP
      totalCommissions: 0, // Disabled for MVP
    },
    affiliate: null, // Disabled for MVP
  };
}

export default async function CreatorDashboard() {
  const { user, creator, recentPosts, stats, affiliate } = await getCreatorData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Creator Dashboard
              </h1>
              <p className="mt-1 text-gray-600">
                Welcome back, {creator.displayName || user.name}!
              </p>
            </div>
            <Link
              href="/portal"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ← Back to Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Posts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Posts</h3>
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
          </div>

          {/* Total Likes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Likes</h3>
              <span className="text-2xl">❤️</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalLikes}</p>
          </div>

          {/* Subscribers - Placeholder for future */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Subscribers</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">Coming soon</p>
          </div>

          {/* Views - Placeholder for future */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Profile Views</h3>
              <span className="text-2xl">�️</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">Coming soon</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/creator/content/upload"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                >
                  <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    📤
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    Upload Content
                  </span>
                </Link>

                <Link
                  href="/creator/content/library"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                >
                  <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    📚
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    Content Library
                  </span>
                </Link>

                <Link
                  href="/dashboard/settings"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                >
                  <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    ⚙️
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    Settings
                  </span>
                </Link>

                <Link
                  href="/dashboard/payouts"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
                >
                  <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    💳
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    Payouts
                  </span>
                </Link>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
                <Link
                  href="/creator/content/library"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View all →
                </Link>
              </div>

              {recentPosts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-gray-600 mb-4">No posts yet</p>
                  <Link
                    href="/creator/content/upload"
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Create your first post
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition"
                    >
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt=""
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        {post.title && (
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {post.title}
                          </h3>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <span>❤️ {post.likes.length} likes</span>
                          {post.isPremium && (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Affiliate Section - Disabled for MVP */}
            {/* 
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h2 className="text-xl font-bold mb-3">Affiliate Program</h2>
              <p className="text-indigo-100 text-sm mb-4">
                Share your unique link and earn commissions on referrals!
              </p>

              {affiliate ? (
                <div className="space-y-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-xs text-indigo-100 mb-1">Your Code</p>
                    <p className="font-mono font-bold text-lg">{affiliate.code}</p>
                  </div>
                  <Link
                    href="/creator/affiliate"
                    className="block w-full text-center py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition"
                  >
                    Manage Affiliate
                  </Link>
                </div>
              ) : (
                <button className="w-full py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition">
                  Activate Affiliate
                </button>
              )}
            </div>
            */}

            {/* Profile Preview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Your Profile
              </h2>
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-3 flex items-center justify-center text-3xl text-white">
                  {user.name?.[0]?.toUpperCase() || "👤"}
                </div>
                <h3 className="font-bold text-gray-900">
                  {creator.displayName || user.name}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Link
                href={`/creator/${user.id}`}
                className="block w-full text-center py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                View Public Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
