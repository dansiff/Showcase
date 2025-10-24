"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Users, ArrowRight } from "lucide-react";

// Mock data - replace with real data from your API
const featuredCreators = [
  {
    id: 1,
    name: "Sarah Chen",
    username: "@sarahcreates",
    category: "Digital Art",
    followers: 12500,
    avatar: "🎨",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    name: "Marcus Rivera",
    username: "@marcusmusic",
    category: "Music Producer",
    followers: 8300,
    avatar: "🎵",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    id: 3,
    name: "Emma Larsson",
    username: "@emmadesigns",
    category: "UI/UX Design",
    followers: 15700,
    avatar: "✨",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: 4,
    name: "Kai Nakamura",
    username: "@kaicode",
    category: "Web Development",
    followers: 9200,
    avatar: "💻",
    gradient: "from-cyan-500 to-blue-500",
  },
];

export default function CreatorShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate featured creators
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredCreators.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-transparent to-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet Our Creators
          </h2>
          <p className="text-xl text-indigo-200/70 max-w-2xl mx-auto">
            Discover talented creators sharing their passion with the world
          </p>
        </div>

        {/* Creator cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredCreators.map((creator, index) => (
            <div
              key={creator.id}
              className={`group relative transition-all duration-500 ${
                index === activeIndex ? "scale-105" : "scale-100 opacity-75"
              }`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                {/* Active indicator */}
                {index === activeIndex && (
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${creator.gradient} opacity-10 animate-pulse`}
                  />
                )}

                {/* Avatar */}
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${creator.gradient} flex items-center justify-center text-4xl mb-4 mx-auto`}
                >
                  {creator.avatar}
                </div>

                {/* Creator info */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {creator.name}
                  </h3>
                  <p className="text-sm text-indigo-200/60 mb-1">
                    {creator.username}
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs text-indigo-200/80 mb-3">
                    {creator.category}
                  </span>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-2 text-sm text-indigo-200/60">
                    <Users className="w-4 h-4" />
                    <span>{creator.followers.toLocaleString()} fans</span>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA to discover more */}
        <div className="text-center" data-aos="fade-up">
          <Link
            href="/fan/discover"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
          >
            <Star className="w-5 h-5" />
            Explore All Creators
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Carousel dots */}
        <div className="flex justify-center gap-2 mt-8">
          {featuredCreators.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to creator ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
