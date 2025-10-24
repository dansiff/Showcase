"use client";

import Link from "next/link";
import { Rocket, Heart, TrendingUp, ArrowRight } from "lucide-react";

interface PlatformCTAProps {
  isAuthenticated: boolean;
}

export default function PlatformCTA({ isAuthenticated }: PlatformCTAProps) {
  return (
    <>
      {/* For Creators Section */}
      <section
        id="for-creators"
        className="relative py-20 md:py-32 bg-gradient-to-br from-purple-900/20 to-pink-900/20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <Rocket className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-200">
                  For Creators
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Turn Your Passion Into Your Career
              </h2>

              <p className="text-xl text-indigo-200/80 mb-8 leading-relaxed">
                Join thousands of creators who are building sustainable careers doing
                what they love. Share your work, grow your audience, and earn from
                your creativity—all in one place.
              </p>

              {/* Benefits */}
              <ul className="space-y-4 mb-8">
                {[
                  "Set up your creator profile in minutes",
                  "Share unlimited content with your community",
                  "Earn through subscriptions, tips, and more",
                  "Track your growth with powerful analytics",
                  "Get discovered by fans worldwide",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <span className="text-indigo-200/90">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link
                    href="/creator/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Go to Creator Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                    >
                      <Rocket className="w-5 h-5" />
                      Start Creating Free
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      href="/creator/demo"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                    >
                      See Demo
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Visual */}
            <div className="relative" data-aos="fade-left">
              <div className="relative rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  {/* Mock dashboard preview */}
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                      <div className="flex-1">
                        <div className="h-3 bg-white/20 rounded w-32 mb-2" />
                        <div className="h-2 bg-white/10 rounded w-24" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded bg-white/5">
                        <div className="h-2 bg-white/20 rounded mb-2" />
                        <div className="h-4 bg-white/30 rounded w-16" />
                      </div>
                      <div className="p-3 rounded bg-white/5">
                        <div className="h-2 bg-white/20 rounded mb-2" />
                        <div className="h-4 bg-white/30 rounded w-16" />
                      </div>
                      <div className="p-3 rounded bg-white/5">
                        <div className="h-2 bg-white/20 rounded mb-2" />
                        <div className="h-4 bg-white/30 rounded w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Fans Section */}
      <section
        id="for-fans"
        className="relative py-20 md:py-32 bg-gradient-to-br from-indigo-900/20 to-purple-900/20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Visual - on left for fans */}
            <div className="relative order-2 lg:order-1" data-aos="fade-right">
              <div className="relative rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  {/* Mock content feed */}
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                        <div className="flex-1">
                          <div className="h-2 bg-white/20 rounded w-24 mb-1" />
                          <div className="h-2 bg-white/10 rounded w-16" />
                        </div>
                      </div>
                      <div className="h-32 bg-white/10 rounded mb-2" />
                      <div className="flex gap-4">
                        <div className="h-2 bg-white/20 rounded w-12" />
                        <div className="h-2 bg-white/20 rounded w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2" data-aos="fade-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                <Heart className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-indigo-200">For Fans</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Support Your Favorite Creators
              </h2>

              <p className="text-xl text-indigo-200/80 mb-8 leading-relaxed">
                Discover amazing content from talented creators around the world.
                Connect directly, show your support, and get exclusive access to the
                content you love.
              </p>

              {/* Benefits */}
              <ul className="space-y-4 mb-8">
                {[
                  "Browse and discover incredible creators",
                  "Get exclusive content from your favorites",
                  "Support creators directly with tips and subscriptions",
                  "Build meaningful connections with creators",
                  "Join a vibrant, creative community",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <span className="text-indigo-200/90">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link
                    href="/fan/discover"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-5 h-5" />
                    Start Exploring
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
                    >
                      <Heart className="w-5 h-5" />
                      Join Free Today
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      href="/fan/discover"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                    >
                      Browse Creators
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="p-12 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-sm"
            data-aos="fade-up"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-indigo-200/80 mb-8 max-w-2xl mx-auto">
              Join FusionSpace today and become part of a thriving creative community
            </p>

            {!isAuthenticated && (
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                Get Started — It's Free
                <ArrowRight className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
