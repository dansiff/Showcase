// components/ui/taco-footer.tsx
"use client";

import Link from "next/link";
import { Instagram, Facebook, MapPin } from "lucide-react";

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
                            <Link href="/tacos/menu" className="hover:text-white transition">
                                Menu
                            </Link>
                        </li>
                        <li>
                            <Link href="/tacos/order" className="hover:text-white transition">
                                Order Now
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-white transition">
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact & Social */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white mb-2">Find Us</h3>
                    <p className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        123 Taco Lane, Chicago, IL
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                        <Link href="https://instagram.com" target="_blank" className="hover:text-white">
                            <Instagram className="w-5 h-5" />
                        </Link>
                        <Link href="https://facebook.com" target="_blank" className="hover:text-white">
                            <Facebook className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-600">
                © {new Date().getFullYear()} Querrepario Tacos. All rights reserved.
            </div>
        </footer>
    );
}
