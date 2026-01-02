'use client';

import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Contact us today to schedule your consultation and take the first step toward confident communication.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <Phone className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Phone</h3>
                <a href="tel:(708)550-4780" className="text-blue-100 hover:text-white transition">
                  (708) 550-4780
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Email</h3>
                <a href="mailto:esmeralda@bilingualandbrilliantspeechtherapy.com" className="text-blue-100 hover:text-white transition">
                  esmeralda@bilingualandbrilliantspeechtherapy.com
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <MapPin className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Location</h3>
                <p className="text-blue-100">
                  917 W 18th St Suite 226<br />
                  Chicago, IL 60608
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-200" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Availability</h3>
                <p className="text-blue-100">
                  In-person and virtual sessions available<br />
                  Flexible scheduling options
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="First"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="Last"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="Tell us about your needs..."
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg h-12"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
