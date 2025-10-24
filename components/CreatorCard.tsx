'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Creator = {
  id: string;
  createdAt: string | Date;
  userId: string;
  displayName?: string;
  stripeAccount?: string | null;
  ageRestricted?: boolean;
  user: {
    id: string;
    name?: string | null;
    email: string;
    posts: { id: string }[];
  };
};

export default function CreatorCard({ creator }: { creator: Creator }) {
  const router = useRouter();
  const [showingModal, setShowingModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // If creator is age restricted, show age confirmation modal
    if (creator.ageRestricted) {
      const confirmed = window.confirm('This creator is age-restricted. Are you 18 or older? Click OK to continue.');
      if (!confirmed) return;
    }

    router.push(`/creator/profile/${creator.user.id}`);
  };

  return (
    <a
      href={`/creator/profile/${creator.user.id}`}
      onClick={handleClick}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Creator Header */}
      <div className="relative h-32 bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white flex items-center justify-center text-4xl shadow-lg">
            {creator.user.name?.[0]?.toUpperCase() || '👤'}
          </div>
        </div>
      </div>

      {/* Creator Info */}
      <div className="pt-14 px-6 pb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition">
          {creator.displayName || creator.user.name || 'Anonymous Creator'}
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
              <span>🔞</span>
              <span className="text-xs">18+</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div>
          <button className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg group-hover:bg-indigo-700 transition">
            View Profile
          </button>
        </div>
      </div>
    </a>
  );
}
