  
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Palette, Store, Utensils, Briefcase, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Website Themes & Showcases - Sandoval Bro's",
  description: "Explore our collection of professionally designed website themes for different industries",
};

const themes = [
  {
    name: "Restaurant & Food Service",
    description: "Perfect for restaurants, cafes, food trucks, and catering services",
    demo: "/taco",
    icon: Utensils,
    image: "🌮",
    features: ["Online Menu", "Order System", "Gallery", "Contact Forms"],
    color: "from-yellow-500 to-orange-600",
    industries: ["Restaurants", "Cafes", "Food Trucks", "Catering"],
  },
  {
    name: "Creator & Portfolio",
    description: "Ideal for artists, content creators, photographers, and freelancers",
    demo: "/creator/demo",
    icon: Palette,
    image: "🎨",
    features: ["Portfolio Gallery", "Membership Tiers", "Content Showcase", "Social Integration"],
    color: "from-purple-500 to-indigo-600",
    industries: ["Artists", "Photographers", "Content Creators", "Freelancers"],
  },
  {
    name: "E-Commerce Store",
    description: "Full-featured online store for retail and product-based businesses",
    demo: "#",
    icon: Store,
    image: "🛍️",
    features: ["Product Catalog", "Shopping Cart", "Secure Checkout", "Inventory Management"],
    color: "from-pink-500 to-rose-600",
    industries: ["Retail", "Fashion", "Electronics", "Handmade Goods"],
    comingSoon: true,
  },
  {
    name: "Professional Services",
    description: "Perfect for consultants, agencies, and service providers",
    demo: "#",
    icon: Briefcase,
    image: "💼",
    features: ["Service Listings", "Booking System", "Testimonials", "Blog"],
    color: "from-blue-500 to-cyan-600",
    industries: ["Consultants", "Agencies", "Lawyers", "Accountants"],
    comingSoon: true,
  },
];

export default function ShowcaseSitesPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Website Themes & Templates</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            Choose Your Perfect Theme
          </h1>
          <p className="text-xl text-gray-400">
            Professional website themes tailored to your industry. Each theme is fully customizable to match your brand.
          </p>
        </div>

        {/* Theme Grid */}
        <div className="grid gap-8 lg:grid-cols-2 mb-16">
          {themes.map((theme) => {
            const Icon = theme.icon;
            return (
              <div
                key={theme.name}
                className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 ${
                  theme.comingSoon
                    ? "border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-800/50"
                    : "border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 hover:scale-105 hover:border-indigo-500/50"
                }`}
              >
                {/* Coming Soon Badge */}
                {theme.comingSoon && (
                  <div className="absolute right-6 top-6 z-10 rounded-full bg-gray-700 px-4 py-1.5 text-xs font-semibold text-gray-300">
                    Coming Soon
                  </div>
                )}

                {/* Card Content */}
                <div className="p-8">
                  {/* Icon & Image */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.color} shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-6xl">{theme.image}</div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mb-3 text-2xl font-bold text-white">{theme.name}</h3>
                  <p className="mb-6 text-gray-400">{theme.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold text-gray-300">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {theme.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 rounded-lg bg-gray-800/50 px-3 py-2 text-sm text-gray-300"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Industries */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold text-gray-300">Perfect For:</h4>
                    <div className="flex flex-wrap gap-2">
                      {theme.industries.map((industry) => (
                        <span
                          key={industry}
                          className="rounded-full border border-gray-700 bg-gray-800/30 px-3 py-1 text-xs text-gray-400"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  {!theme.comingSoon ? (
                    <Link
                      href={theme.demo}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${theme.color} px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105`}
                    >
                      View Live Demo
                      <ExternalLink className="h-5 w-5" />
                    </Link>
                  ) : (
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/30 px-6 py-3 font-semibold text-gray-500 cursor-not-allowed">
                      Coming Soon
                    </div>
                  )}
                </div>

                {/* Decorative gradient */}
                {!theme.comingSoon && (
                  <div className={`absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br ${theme.color} opacity-20 blur-3xl transition-opacity group-hover:opacity-30`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Design CTA */}
        <div className="mx-auto max-w-4xl rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 p-8 sm:p-12 text-center backdrop-blur">
          <div className="mb-4 text-4xl">✨</div>
          <h3 className="mb-3 text-2xl font-bold text-white">Need Something Custom?</h3>
          <p className="mb-6 text-lg text-gray-300">
            Don't see a theme that fits your vision? We can create a completely custom design tailored to your brand.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105"
            >
              View Pricing
            </Link>
            <Link
              href="/About"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-8 py-3 font-semibold text-white transition-all hover:bg-gray-800"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-2">All themes include:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>✓ Mobile Responsive</span>
            <span>✓ SEO Optimized</span>
            <span>✓ Fast Loading</span>
            <span>✓ Secure Hosting</span>
            <span>✓ Easy to Update</span>
          </div>
        </div>
      </div>
    </div>
  );
}

