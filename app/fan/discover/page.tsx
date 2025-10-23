// app/fan/discover/page.tsx
// Fan portal: discover and browse creators

import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Discover Creators — The Fusion Space",
  description: "Browse and discover amazing creators",
};

async function getCreators() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/signin");
  }

  // Fetch all active creators with their user info
  const creators = await prisma.creator.findMany({
    where: {
      user: {
        email: {
          not: authUser.email!, // Exclude current user if they're also a creator
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          posts: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return { creators, currentUser: authUser };
}

export default async function DiscoverPage() {
  const { creators, currentUser } = await getCreators();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Discover Creators
              </h1>
              <p className="mt-1 text-gray-600">
                Find and support amazing content creators
              </p>
            </div>
            <Link
              href="/portal"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ← Back to Portal
            </Link>
          </div>

          {/* Search Bar (placeholder for now) */}
          <div className="mt-6">
            <input
              type="search"
              placeholder="Search creators..."
              className="w-full max-w-2xl px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {creators.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No creators yet
            </h3>
            <p className="text-gray-600">
              Be the first to become a creator and share your content!
            </p>
            <Link
              href="/dashboard/settings"
              className="inline-block mt-4 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Become a Creator
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <Link
                key={creator.id}
                href={`/creator/${creator.user.id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Creator Header */}
                <div className="relative h-32 bg-gradient-to-br from-indigo-500 to-purple-600">
                  <div className="absolute -bottom-12 left-6">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-white flex items-center justify-center text-4xl shadow-lg">
                      {creator.user.name?.[0]?.toUpperCase() || "👤"}
                    </div>
                  </div>
                </div>

                {/* Creator Info */}
                <div className="pt-14 px-6 pb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition">
                    {creator.displayName || creator.user.name || "Anonymous Creator"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Creator since {new Date(creator.createdAt).getFullYear()}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <span>📝</span>
                      <span>{creator.user.posts.length} posts</span>
                    </div>
                    {creator.ageRestricted && (
                      <div className="flex items-center gap-1">
                        <span>�</span>
                        <span className="text-xs">18+</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <button className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg group-hover:bg-indigo-700 transition">
                    View Profile
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
