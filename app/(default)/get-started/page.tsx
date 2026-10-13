import { Metadata } from 'next';
import GetStartedForm from '@/components/GetStartedForm';

export const metadata: Metadata = {
  title: 'Get Started - Affordable Website Solutions | Fusion Space Inc',
  description: 'Launch your professional website in days, not months. Start with a free 14-day trial. No credit card required.',
};

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
            <span className="text-green-400 font-semibold">🎉 Free 14-Day Trial • No Credit Card Required</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Launch Your Professional Website <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">in Days</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get a custom website built for your business. Like the Morelia restaurant site you just saw—professional, fast, and conversion-focused.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold text-white mb-2">Fast Delivery</div>
              <div className="text-sm text-gray-300">Live in 3-7 days</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-bold text-white mb-2">Affordable</div>
              <div className="text-sm text-gray-300">Starting at $297</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="text-3xl mb-2">🎨</div>
              <div className="font-bold text-white mb-2">Custom Design</div>
              <div className="text-sm text-gray-300">Tailored to your brand</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <GetStartedForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What You Get</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Landing Page', desc: 'Beautiful hero section with your brand' },
              { icon: '📱', title: 'Mobile Responsive', desc: 'Perfect on all devices' },
              { icon: '🛒', title: 'Online Ordering', desc: 'Accept orders/bookings (optional)' },
              { icon: '📍', title: 'Google Maps', desc: 'Integrated location & directions' },
              { icon: '📧', title: 'Contact Forms', desc: 'Capture leads automatically' },
              { icon: '🚀', title: 'Fast Hosting', desc: 'Lightning-fast load times' },
              { icon: '🔒', title: 'SSL Security', desc: 'Secure HTTPS included' },
              { icon: '📊', title: 'Analytics', desc: 'Track visitors and conversions' },
              { icon: '♾️', title: 'Unlimited Edits', desc: 'First month of changes free' },
            ].map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Simple, Transparent Pricing</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <div className="text-4xl font-bold text-white mb-4">$297</div>
              <p className="text-gray-300 mb-6">Perfect for new businesses</p>
              <ul className="space-y-3 mb-8 text-gray-200">
                <li className="flex items-start gap-2"><span className="text-green-400">✓</span> 1-3 page website</li>
                <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Mobile responsive</li>
                <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Contact form</li>
                <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Google Maps</li>
                <li className="flex items-start gap-2"><span className="text-green-400">✓</span> 1 month support</li>
              </ul>
              <a href="#form" className="block w-full py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg text-center transition-all">
                Choose Starter
              </a>
            </div>

            {/* Professional (Popular) */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 transform scale-105 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <div className="text-4xl font-bold text-white mb-4">$697</div>
              <p className="text-white/90 mb-6">Like the Morelia website</p>
              <ul className="space-y-3 mb-8 text-white">
                <li className="flex items-start gap-2"><span className="text-green-200">✓</span> 5-10 page website</li>
                <li className="flex items-start gap-2"><span className="text-green-200">✓</span> Online ordering system</li>
                <li className="flex items-start gap-2"><span className="text-green-200">✓</span> Admin dashboard</li>
                <li className="flex items-start gap-2"><span className="text-green-200">✓</span> Custom animations</li>
                <li className="flex items-start gap-2"><span className="text-green-200">✓</span> 3 months support</li>
                <li className="flex items-start gap-2"><span className="text-green-200">✓</span> Email notifications</li>
              </ul>
              <a href="#form" className="block w-full py-3 bg-white text-orange-600 hover:bg-gray-100 font-bold rounded-lg text-center transition-all">
                Choose Professional
              </a>
            </div>

            {/* Enterprise */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-4">Custom</div>
              <p className="text-gray-300 mb-6">For growing businesses</p>
              <ul className="space-y-3 mb-8 text-gray-200">
                <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Unlimited pages</li>
                <li className="flex items-start gap-2"><span className="text-green-400">✓</span> E-commerce integration</li>
                <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Payment processing</li>
                <li className="flex items-start gap-2"><span className="text-green-400">✓</span> User authentication</li>
                <li className="flex items-start gap-2"><span className="text-green-400">✓</span> 12 months support</li>
                <li className="flex items-start gap-2"><span className="text-green-400">✓</span> Priority updates</li>
              </ul>
              <a href="#form" className="block w-full py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg text-center transition-all">
                Contact Us
              </a>
            </div>
          </div>

          <div className="text-center mt-12 text-gray-300">
            <p className="text-lg">🎁 <strong className="text-white">Free Trial:</strong> Test your website for 14 days. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Launch Your Website?</h2>
          <p className="text-xl text-indigo-100 mb-8">Join dozens of businesses who've trusted us with their online presence</p>
          <a href="#form" className="inline-block px-8 py-4 bg-white text-indigo-600 hover:bg-gray-100 font-bold rounded-lg text-lg transition-all transform hover:scale-105">
            Start Your Free Trial →
          </a>
        </div>
      </section>
    </main>
  );
}
