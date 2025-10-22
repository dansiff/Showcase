import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, Share2, Play, Instagram, Twitter, Youtube } from "lucide-react";

export const metadata: Metadata = {
  title: "Demo Creator - Showcase Platform",
  description: "Example creator profile showcasing platform features",
};

export default function DemoCreatorPage() {
  // Mock demo data
  const creator = {
    displayName: "Alex Rivera",
    username: "demo",
    bio: "Digital artist & content creator 🎨 | Sharing tutorials, behind-the-scenes, and exclusive content",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop",
    stats: {
      followers: "12.5K",
      posts: 248,
      likes: "45.2K",
    },
    tiers: [
      {
        name: "Fan",
        price: 5,
        description: "Access to exclusive posts and behind-the-scenes content",
        perks: ["Early access to content", "Exclusive posts", "Community Discord access"],
      },
      {
        name: "Supporter",
        price: 15,
        description: "Everything in Fan plus exclusive tutorials and 1-on-1 sessions",
        perks: ["All Fan perks", "Monthly tutorials", "1-on-1 Q&A sessions", "Custom requests"],
      },
      {
        name: "VIP",
        price: 50,
        description: "Ultimate access with personalized content and priority support",
        perks: ["All Supporter perks", "Weekly 1-on-1 calls", "Personalized content", "Priority support"],
      },
    ],
    posts: [
      {
        id: 1,
        type: "image",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
        title: "New Digital Art Piece",
        likes: 324,
        comments: 45,
      },
      {
        id: 2,
        type: "video",
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop",
        title: "Tutorial: Color Theory Basics",
        likes: 892,
        comments: 123,
      },
      {
        id: 3,
        type: "image",
        thumbnail: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=400&h=400&fit=crop",
        title: "Behind The Scenes",
        likes: 567,
        comments: 78,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Back Button */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative -mt-20 pb-12">
          {/* Avatar */}
          <div className="mb-6 flex items-end gap-6">
            <div className="h-32 w-32 rounded-full border-4 border-gray-950 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl ring-4 ring-gray-800 flex items-center justify-center text-5xl">
              🎨
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">{creator.displayName}</h1>
              <p className="text-gray-400">@{creator.username}</p>
            </div>
            <div className="flex gap-3">
              <button className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition-all hover:scale-105">
                Subscribe
              </button>
              <button className="rounded-full border border-gray-700 bg-gray-800 p-2.5 text-white hover:bg-gray-700 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 flex gap-8">
            <div>
              <div className="text-2xl font-bold text-white">{creator.stats.followers}</div>
              <div className="text-sm text-gray-400">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{creator.stats.posts}</div>
              <div className="text-sm text-gray-400">Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{creator.stats.likes}</div>
              <div className="text-sm text-gray-400">Likes</div>
            </div>
          </div>

          {/* Bio */}
          <p className="mb-6 max-w-2xl text-gray-300">{creator.bio}</p>

          {/* Social Links */}
          <div className="mb-12 flex gap-4">
            <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
              <Youtube className="h-6 w-6" />
            </a>
          </div>

          {/* Subscription Tiers */}
          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-white">Membership Tiers</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {creator.tiers.map((tier, idx) => (
                <div
                  key={tier.name}
                  className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 transition-all hover:scale-105 ${
                    idx === 1
                      ? "border-indigo-500 from-indigo-950 to-purple-950 ring-2 ring-indigo-500/20"
                      : "border-gray-800 from-gray-900 to-gray-800"
                  }`}
                >
                  {idx === 1 && (
                    <div className="absolute right-4 top-4 rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white">
                      Popular
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="mb-2 text-xl font-bold text-white">{tier.name}</h3>
                    <div className="mb-3 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">${tier.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-sm text-gray-400">{tier.description}</p>
                  </div>
                  <ul className="mb-6 space-y-3">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-indigo-400">✓</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500">
                    Subscribe
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-white">Recent Posts</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {creator.posts.map((post) => (
                <div
                  key={post.id}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-gray-900 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
                  {post.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex items-center gap-4 text-sm text-white">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-12 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 p-8 text-center backdrop-blur">
            <div className="mb-3 text-4xl">🎨</div>
            <h3 className="mb-2 text-xl font-bold text-white">This is a Demo Profile</h3>
            <p className="mb-6 text-gray-400">
              This showcases what a creator profile looks like on our platform. Ready to create your own?
            </p>
            <Link
              href="/signup?role=creator"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105"
            >
              Become a Creator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
