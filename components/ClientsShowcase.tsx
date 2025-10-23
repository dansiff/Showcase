import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";

export default function ClientsShowcase() {
  const showcaseProjects = [
    {
      name: "Taco Restaurant",
      description: "Modern restaurant website with online ordering and menu showcase",
      href: "/taco",
      image: "🌮",
      color: "from-yellow-500 to-orange-600",
    },
    {
      name: "Creator Demo",
      description: "Portfolio and content creator platform demonstration",
      href: "/creator/demo",
      image: "🎨",
      color: "from-purple-500 to-indigo-600",
    },
    {
      name: "E-Commerce Store",
      description: "Full-featured online store with shopping cart and checkout",
      href: "/Showcasesites",
      image: "🛍️",
      color: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Our Work</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Showcase of Our Clients
          </h2>
          <p className="text-lg text-gray-400">
            Explore live examples of websites we've built. Each project is tailored to our clients' unique needs.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {showcaseProjects.map((project) => (
            <Link
              key={project.href}
              href={project.href}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
              
              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-800/50 text-4xl ring-1 ring-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:ring-indigo-500/50">
                  {project.image}
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {project.name}
                </h3>

                {/* Description */}
                <p className="mb-6 text-sm text-gray-400 leading-relaxed">
                  {project.description}
                </p>

                {/* Link indicator */}
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-400 group-hover:gap-3 transition-all">
                  <span>View Project</span>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-2xl transition-all duration-300 group-hover:scale-150" />
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/Showcasesites"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-indigo-500/50"
          >
            View All Projects
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
