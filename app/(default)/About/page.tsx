export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About Sandoval Bros
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          A Chicago-based software company delivering unbeatable prices, world-class DevOps,
          and rock-solid platforms that help businesses scale effortlessly.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a
            href="/contact"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Work With Us
          </a>
          <a
            href="/pricing"
            className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg shadow hover:bg-gray-200 transition"
          >
            View Plans
          </a>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          { title: "DevOps Excellence", desc: "Best practices to optimize speed, reliability, and scalability." },
          { title: "Client First", desc: "Your growth is our success — tailored solutions, every time." },
          { title: "Affordable Innovation", desc: "Enterprise-quality services without enterprise pricing." },
        ].map((value, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-blue-600">{value.title}</h3>
            <p className="mt-2 text-gray-600">{value.desc}</p>
          </div>
        ))}
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">What We Do</h2>
          <p className="mt-4 text-gray-600">End-to-end solutions to power your online presence.</p>

          <div className="mt-10 grid md:grid-cols-3 gap-8 text-left">
            {[
              { title: "Web Hosting", desc: "Reliable hosting with high uptime and security." },
              { title: "Checkout Integration", desc: "Remote payments and pickup orders with ultra-low fees." },
              { title: "Google & SEO Data", desc: "Analytics and optimization to maximize traffic." },
              { title: "DevOps Consulting", desc: "Infrastructure, CI/CD, and automation experts." },
              { title: "Support & Management", desc: "Hands-on guidance or full-service management." },
              { title: "Custom Platforms", desc: "Tailored solutions for unique business needs." },
            ].map((service, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-blue-600">{service.title}</h3>
                <p className="mt-2 text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility / Stats */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        {[
          { stat: "100+", label: "Websites Deployed" },
          { stat: "24/7", label: "Support Availability" },
          { stat: "5+ Years", label: "Industry Experience" },
        ].map((item, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl shadow">
            <p className="text-4xl font-bold text-blue-600">{item.stat}</p>
            <p className="mt-2 text-gray-600">{item.label}</p>
          </div>
        ))}
      </section>

      {/* Call-to-Action */}
      <section className="py-20 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-3xl font-bold">Ready to build something amazing?</h2>
        <p className="mt-4">Let’s work together to launch your platform and grow your business.</p>
        <a
          href="/Contact"
          className="mt-6 inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          Get Started
        </a>
      </section>
    </div>
  );
}
