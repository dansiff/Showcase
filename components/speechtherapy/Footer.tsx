'use client';

import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4">Bilingual & Brilliant</h3>
            <p className="text-sm text-slate-400">
              Professional speech therapy services in Chicago. Confident communication starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white transition">Services</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">About</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                <a href="tel:(708)550-4780" className="text-slate-400 hover:text-white transition">
                  (708) 550-4780
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <a href="mailto:esmeralda@bilingualandbrilliantspeechtherapy.com" className="text-slate-400 hover:text-white transition break-all">
                  esmeralda@...
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  917 W 18th St Suite 226<br />
                  Chicago, IL 60608
                </span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>&copy; 2025 Bilingual and Brilliant Speech Therapy. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
