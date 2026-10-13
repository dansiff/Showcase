import Navigation from '@/components/speechtherapy/Navigation';
import Footer from '@/components/speechtherapy/Footer';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Speech Pathology Application - Coming Soon',
  description: 'Speech pathology application portal coming soon. Pre-register to get early access.',
  keywords: 'speech pathology, application, SLP, speech therapy',
};

export default function SpeechPathologyApplicationPage() {
  return (
    <div className="bg-white">
      <Navigation />
      
      <main className="pt-16">
        <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-2xl text-center">
            {/* Coming Soon Header */}
            <div className="mb-8">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                COMING SOON
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Speech Pathology Application Portal
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We're building something amazing. The speech pathology application platform is coming soon to streamline client intake and case management.
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-6 my-12">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-blue-100">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="font-semibold text-gray-900 mb-2">Easy Application</h3>
                <p className="text-gray-600 text-sm">
                  Streamlined intake forms for new clients
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-sm border border-blue-100">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-900 mb-2">Case Management</h3>
                <p className="text-gray-600 text-sm">
                  Track progress and manage client records
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-sm border border-blue-100">
                <div className="text-3xl mb-3">🔐</div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure & HIPAA</h3>
                <p className="text-gray-600 text-sm">
                  Protected health information handling
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <p className="text-gray-600">
                Check back soon for the full speech pathology application platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/speechtherapy"
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Back to Speech Therapy
                </Link>
                <Link
                  href="/"
                  className="inline-block px-8 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
