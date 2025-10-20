"use client";

import { useState, type ComponentType } from 'react';
import Image from 'next/image';
import PostCard from '../../../components/creator/PostCard';
import SubscriptionTierCard from '../../../components/creator/SubscriptionTierCard';
import CreatorStatsCard from '../../../components/creator/CreatorStatsCard';

type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  profile?: {
    bio?: string | null;
  } | null;
};

type Post = {
  id: string;
  title?: string | null;
  content: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  isPremium: boolean;
  createdAt: string;
  likes: Array<{ id: string; userId: string }>;
  author: {
    id: string;
    name: string;
    image?: string | null;
  };
};

type SubscriptionPlan = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  billingPeriod: string;
  creatorId: string;
};

// Typed alias for the imported SubscriptionTierCard so we can pass an optional onSubscribe prop here
const TypedSubscriptionTierCard = SubscriptionTierCard as unknown as ComponentType<{
  plan: SubscriptionPlan;
  onSubscribe?: () => void;
}>;

type CreatorProfileViewProps = {
  creator: User;
  posts: Post[];
  subscriptionPlans: SubscriptionPlan[];
};

type TabType = 'posts' | 'about';
type PostFilterType = 'all' | 'free' | 'premium';

export default function CreatorProfileView({
  creator,
  posts,
  subscriptionPlans,
}: CreatorProfileViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [postFilter, setPostFilter] = useState<PostFilterType>('all');

  const filteredPosts = posts.filter((post) => {
    if (postFilter === 'free') return !post.isPremium;
    if (postFilter === 'premium') return post.isPremium;
    return true;
  });

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          creatorId: creator.id,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Banner Section */}
      <div className="relative h-64 bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900">
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative w-32 h-32 rounded-full border-4 border-gray-950 overflow-hidden bg-gray-800 flex-shrink-0">
              {creator.image ? (
                <Image
                  src={creator.image}
                  alt={creator.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-purple-400">
                  {creator.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold truncate">{creator.name}</h1>
              <p className="text-gray-400 mt-1">@{creator.name.toLowerCase().replace(/\s+/g, '')}</p>
              {creator.profile?.bio && (
                <p className="text-gray-300 mt-3 max-w-2xl line-clamp-2">{creator.profile.bio}</p>
              )}
            </div>

            {/* Subscribe Button */}
            {subscriptionPlans.length > 0 && (
              <button
                onClick={() => handleSubscribe(subscriptionPlans[0].id)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex-shrink-0"
              >
                Subscribe
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-800 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'about'
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              About
            </button>
          </nav>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {activeTab === 'posts' && (
              <div>
                {/* Post Filters */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setPostFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      postFilter === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    All Posts
                  </button>
                  <button
                    onClick={() => setPostFilter('free')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      postFilter === 'free'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setPostFilter('premium')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      postFilter === 'premium'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Premium
                  </button>
                </div>

                {/* Posts List */}
                <div className="space-y-6">
                  {filteredPosts.length === 0 ? (
                    <div className="bg-gray-900 rounded-lg p-12 text-center">
                      <p className="text-gray-400 text-lg">No posts to display</p>
                      <p className="text-gray-500 text-sm mt-2">
                        {postFilter !== 'all' ? 'Try changing the filter' : 'Check back later for new content'}
                      </p>
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-gray-900 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">About {creator.name}</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {creator.profile?.bio || 'No bio available yet.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {subscriptionPlans.length > 0 ? (
              subscriptionPlans.map((plan) => (
                <TypedSubscriptionTierCard
                  key={plan.id}
                  plan={plan}
                  onSubscribe={() => handleSubscribe(plan.id)}
                />
              ))
            ) : (
              <div className="bg-gray-900 rounded-lg p-4 text-gray-400">No subscription plans available</div>
            )}

            {/* Creator Stats */}
            <CreatorStatsCard
              postCount={posts.length}
              subscriberCount={0} // TODO: Implement subscriber count
              joinDate={new Date()} // TODO: Use actual creator join date
            />
          </div>
        </div>
      </div>
    </div>
  );
}
