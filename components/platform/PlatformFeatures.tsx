"use client";

import {
  Palette,
  DollarSign,
  MessageCircle,
  TrendingUp,
  Shield,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Share Your Creativity",
    description:
      "Post your content, build your portfolio, and showcase your unique talents to the world.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: DollarSign,
    title: "Earn from Your Passion",
    description:
      "Monetize your content through subscriptions, tips, and exclusive offerings for your biggest fans.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: MessageCircle,
    title: "Connect Authentically",
    description:
      "Build real relationships with your community through direct engagement and meaningful interactions.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Audience",
    description:
      "Leverage powerful analytics and discovery tools to reach new fans and expand your impact.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description:
      "Your data and payments are protected with enterprise-grade security and privacy controls.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Connect with creators and fans from around the world in a diverse, inclusive community.",
    color: "from-cyan-500 to-blue-500",
  },
];

export default function PlatformFeatures() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to Thrive
          </h2>
          <p className="text-xl text-indigo-200/70 max-w-2xl mx-auto">
            Whether you're a creator building your brand or a fan discovering amazing
            content, we've got you covered.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Card */}
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105">
                {/* Icon */}
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-indigo-200/70 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16" data-aos="fade-up">
          <p className="text-indigo-200/60 mb-6">
            Ready to explore what FusionSpace can do for you?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#for-creators"
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              I'm a Creator
            </a>
            <a
              href="#for-fans"
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              I'm a Fan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
