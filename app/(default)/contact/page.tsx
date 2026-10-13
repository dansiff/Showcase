import { Metadata } from 'next';
import Link from 'next/link';
import GetStartedForm from '@/components/GetStartedForm';

export const metadata: Metadata = {
  title: 'Contact - Fusion Space Inc | Get Your Website Built',
  description: 'Contact us to build your professional website. Fast, affordable, and custom-designed for your business.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let's Build Your Website
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Whether you need a simple landing page or a full restaurant ordering system like our Morelia site, we're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              
              <div className="space-y-4 text-gray-200">
                <div>
                  <div className="font-semibold text-amber-300 mb-1">📧 Email</div>
                  <a href="mailto:contact@thefusionspace.com" className="hover:text-amber-300 transition-colors">
                    contact@thefusionspace.com
                  </a>
                </div>

                <div>
                  <div className="font-semibold text-amber-300 mb-1">💬 Response Time</div>
                  <p>Within 24 hours (usually same day)</p>
                </div>

                <div>
                  <div className="font-semibold text-amber-300 mb-1">🕐 Business Hours</div>
                  <p>Monday - Friday: 9 AM - 6 PM CST</p>
                  <p className="text-sm text-gray-400">Email support available 24/7</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Explore Examples</h3>
              <div className="space-y-3">
                <Link href="/morelia" className="block text-amber-300 hover:text-amber-200 transition-colors">
                  → Morelia Restaurant Site (Full Featured)
                </Link>
                <Link href="/get-started" className="block text-amber-300 hover:text-amber-200 transition-colors">
                  → View Pricing & Plans
                </Link>
                <Link href="/" className="block text-amber-300 hover:text-amber-200 transition-colors">
                  → Back to Homepage
                </Link>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Why Fusion Space?</h3>
              <ul className="space-y-3 text-white">
                <li className="flex items-start gap-2">
                  <span className="text-green-200">✓</span>
                  <span>Fast turnaround (3-7 days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-200">✓</span>
                  <span>Affordable pricing (starting $297)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-200">✓</span>
                  <span>Custom designs, not templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-200">✓</span>
                  <span>Mobile-first approach</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-200">✓</span>
                  <span>Free 14-day trial</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <GetStartedForm />
          </div>
        </div>
      </div>
    </main>
  );
}
