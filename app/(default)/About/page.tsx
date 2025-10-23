import { Metadata } from "next";
import Link from "next/link";
import { Code, Zap, Shield, HeartHandshake, TrendingUp, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - Sandoval Bro's",
  description: "Chicago local software company with unbeatable prices and excellent support. Professional web development with the best DevOps methods.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "We deliver websites quickly without compromising on quality. Our Blitz plan gets you live in 48 hours.",
    },
    {
      icon: Shield,
      title: "Rock Solid",
      description: "Best-in-class DevOps practices ensure your site is secure, reliable, and always available.",
    },
    {
      icon: HeartHandshake,
      title: "Exceptional Support",
      description: "We're with you every step of the way. From launch to growth, we're your dedicated web partner.",
    },
    {
      icon: TrendingUp,
      title: "Results Driven",
      description: "We focus on what matters: driving traffic, converting visitors, and growing your business.",
    },
  ];

  const services = [
    "Custom Website Design & Development",
    "Google Analytics & Data Management",
    "Website Hosting & Maintenance",
    "Remote Payment & Checkout Solutions",
    "Google Ads Setup & Management",
    "SEO Optimization",
    "Mobile-Responsive Design",
    "E-commerce Integration",
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5">
              <Award className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">Chicago's Premier Web Development</span>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Building Digital Success Stories
            </h1>
            
            <p className="mb-8 text-xl text-gray-400 leading-relaxed">
              We're a <span className="text-white font-semibold">Chicago-based software company</span> specializing in professional websites with <span className="text-indigo-400 font-semibold">unbeatable prices</span> and exceptional support.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105"
              >
                View Our Plans
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/Showcasesites"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-8 py-3 font-semibold text-white transition-all hover:bg-gray-800"
              >
                See Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <Code className="mx-auto mb-6 h-12 w-12 text-indigo-400" />
              <h2 className="mb-4 text-3xl font-bold text-white">Our Mission</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                We believe every business deserves a professional online presence without breaking the bank. 
                Using cutting-edge DevOps methods and modern web technologies, we deliver websites that not only 
                look great but perform exceptionally—driving real results for your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Why Choose Us</h2>
            <p className="text-xl text-gray-400">The values that drive everything we do</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-6 transition-all hover:scale-105"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                    <Icon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{value.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{value.description}</p>
                  
                  {/* Decorative gradient */}
                  <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Complete Web Solutions</h2>
            <p className="text-xl text-gray-400">Everything you need to succeed online</p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-all hover:border-indigo-500/50"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                    <div className="h-2 w-2 rounded-full bg-indigo-400" />
                  </div>
                  <span className="text-gray-300">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 p-12 text-center backdrop-blur">
            <div className="relative z-10">
              <h2 className="mb-4 text-4xl font-bold text-white">Ready to Get Started?</h2>
              <p className="mb-8 text-xl text-gray-300">
                Let's build something amazing together. Unbeatable prices, exceptional quality.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105"
                >
                  View Pricing
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/creator/demo"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-8 py-3 font-semibold text-white transition-all hover:bg-gray-800"
                >
                  See Demo Site
                </Link>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}

