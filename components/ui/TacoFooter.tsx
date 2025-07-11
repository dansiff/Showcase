// components/ui/taco-footer.tsx
"use client";

import Link from "next/link";
import { Instagram, Facebook, MapPin } from "lucide-react";

// SVG components for Instagram and Facebook
const InstagramIcon = () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        {/* ...your Instagram SVG path here... */}
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
    </svg>
);

const FacebookIcon = () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        {/* ...your Facebook SVG path here... */}
        <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12"/>
    </svg>
);
export default function TacoFooter() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 mt-12 py-10 px-6 text-gray-400">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo & tagline */}
                <div>
                    <h2 className="text-xl font-bold text-white">Querrepario Tacos</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        The most authentic tacos this side of the border. Fresh, local, unforgettable.
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="text-sm font-semibold text-white mb-2">Quick Links</h3>
                    <ul className="space-y-1 text-sm">
                        <li>
                            <Link href="/taco/menu" className="hover:text-white transition">
                                Menu
                            </Link>
                        </li>
                        <li>
                            <Link href="/taco/order" className="hover:text-white transition">
                                Order Now
                            </Link>
                        </li>
                        <li>
                            <Link href="/taco/contact" className="hover:text-white transition">
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                  {/* Contact & Social */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white mb-2">Find Us</h3>
                    <p className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-indigo-500" />   <a
      href="https://www.google.com/maps?q=4720+W+Lake+St,+Chicago,+IL+60644"
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-500 hover:underline"
    >
      4720 W Lake St, Chicago, IL
    </a>
                
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                        <Link href="https://instagram.com" target="_blank" className="hover:text-white">
                            <InstagramIcon />
                        </Link>
                        <Link href="https://facebook.com" target="_blank" className="hover:text-white">
                            <FacebookIcon />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center text-xs text-gray-600">
                � {new Date().getFullYear()} Querrepario Tacos. All rights reserved.
            </div>
        </footer>
    );
}
