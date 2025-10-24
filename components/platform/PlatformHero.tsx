"use client";

import Link from "next/link";
import { Sparkles, Heart, Zap, Users } from "lucide-react";

interface PlatformHeroProps {
  isAuthenticated: boolean;
}

export default function PlatformHero({ isAuthenticated }: PlatformHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 md:py-32">
          {/* Main hero content */}
          <div className="text-center space-y-8">
            {/* Platform badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
              data-aos="fade-up"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-200">
                Welcome to FusionSpace
              </span>
            </div>

            {/* Hero headline */}
            <h1
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.purple.200),theme(colors.pink.200),theme(colors.indigo.200),theme(colors.purple.300),theme(colors.pink.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-5xl font-bold text-transparent md:text-7xl leading-tight"
              data-aos="fade-up"
              data-aos-delay={100}
            >
              Where Creativity
              <br />
              Meets Community
            </h1>

            {/* Subheadline */}
            <p
              className="mx-auto max-w-3xl text-xl md:text-2xl text-indigo-200/80 leading-relaxed"
              data-aos="fade-up"
              data-aos-delay={200}
            >
              Join a vibrant platform where creators share their passion and fans
              discover amazing content. Build meaningful connections, support your
              favorites, and be part of something special.
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
              data-aos="fade-up"
              data-aos-delay={300}
            >
              {isAuthenticated ? (
                <>
                  <Link
                    href="/fan/discover"
                    className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Discover Creators
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  </Link>
                  <Link
                    href="/portal"
                    className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                  >
                    Go to Your Portal
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Get Started Free
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  </Link>
                  <Link
                    href="/signin"
                    className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Quick stats */}
            <div
              className="flex flex-wrap justify-center gap-8 pt-12"
              data-aos="fade-up"
              data-aos-delay={400}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-indigo-200/60">Growing Community</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="text-indigo-200/60">Authentic Connections</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" />
                <span className="text-indigo-200/60">Instant Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
