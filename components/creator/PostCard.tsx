"use client";

import { useState } from 'react';
import Image from 'next/image';

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

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  const [isContentBlurred, setIsContentBlurred] = useState(post.isPremium);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const handleUnlock = () => {
    // TODO: Check if user has active subscription
    setIsContentBlurred(false);
  };

  const handleLike = async () => {
    // TODO: Implement like functionality with API call
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <article className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-900/80 transition-colors">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
              {post.author.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-purple-400">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div>
              <p className="font-semibold text-sm">{post.author.name}</p>
              <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {post.isPremium && (
            <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-semibold rounded-full">
              Premium
            </span>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        {post.title && (
          <h3 className="font-bold text-lg mb-2">{post.title}</h3>
        )}
        
        <p className="text-gray-300 mb-4 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Media Content */}
        {(post.imageUrl || post.videoUrl) && (
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title || 'Post image'}
                fill
                className={`object-cover transition-all ${isContentBlurred ? 'blur-2xl scale-105' : ''}`}
              />
            )}

            {post.videoUrl && !post.imageUrl && (
              <video
                src={post.videoUrl}
                controls={!isContentBlurred}
                className={`w-full h-full object-cover ${isContentBlurred ? 'blur-2xl scale-105' : ''}`}
              >
                Your browser does not support the video tag.
              </video>
            )}

            {/* Unlock Overlay */}
            {isContentBlurred && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-4xl mb-3">🔒</div>
                  <h4 className="text-lg font-bold mb-2">Premium Content</h4>
                  <p className="text-sm text-gray-300 mb-4">Subscribe to unlock this content</p>
                  <button
                    onClick={handleUnlock}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="p-4 border-t border-gray-800 flex items-center gap-6 text-sm">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${
            isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'
          }`}
        >
          <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
          <span className="font-medium">{likeCount}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
          <span className="text-lg">💬</span>
          <span>Comment</span>
        </button>

        <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
          <span className="text-lg">🔖</span>
          <span>Save</span>
        </button>

        <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors ml-auto">
          <span className="text-lg">📤</span>
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}
