"use client";

import { MapPin, Phone, Clock, Navigation, Mail } from 'lucide-react';

export default function MoreliaLocation() {
    // TODO: Replace with actual restaurant address and details
    const restaurantInfo = {
        name: "Taqueria Y Birriera Morelia #2",
        address: "[Enter Street Address]",
        city: "[City, State ZIP]",
        phone: "[Phone Number]",
        email: "info@moreliataqueria.com", // Optional
        hours: {
            weekday: "Monday - Friday: 9:00 AM - 9:00 PM",
            weekend: "Saturday - Sunday: 9:00 AM - 10:00 PM",
        },
        googleMapsLink: "#", // TODO: Add Google Maps link
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-red-900">Visit Us</h2>
                    <p className="text-lg text-gray-700">Come taste the authentic flavors of Morelia</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-red-900 to-amber-700 text-white rounded-2xl p-8 shadow-xl">
                            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-amber-300 flex-shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-amber-300 mb-1">Address</div>
                                        <div>{restaurantInfo.address}</div>
                                        <div>{restaurantInfo.city}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 text-amber-300 flex-shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-amber-300 mb-1">Phone</div>
                                        <a href={`tel:${restaurantInfo.phone}`} className="hover:text-amber-300 transition-colors">
                                            {restaurantInfo.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Clock className="w-6 h-6 text-amber-300 flex-shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-amber-300 mb-1">Hours</div>
                                        <div className="text-sm">{restaurantInfo.hours.weekday}</div>
                                        <div className="text-sm">{restaurantInfo.hours.weekend}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/20">
                                <a 
                                    href={restaurantInfo.googleMapsLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-red-900 font-bold rounded-lg transition-all transform hover:scale-105 w-full justify-center"
                                >
                                    <Navigation className="w-5 h-5" />
                                    Get Directions
                                </a>
                            </div>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-amber-50 rounded-xl p-6 text-center border-2 border-amber-200">
                                <div className="text-3xl font-bold text-red-900 mb-2">7 Days</div>
                                <div className="text-sm text-gray-700">Open Every Week</div>
                            </div>
                            <div className="bg-red-50 rounded-xl p-6 text-center border-2 border-red-200">
                                <div className="text-3xl font-bold text-red-900 mb-2">Fresh</div>
                                <div className="text-sm text-gray-700">Made Daily</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Map */}
                    <div>
                        <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-xl h-[500px] relative">
                            {/* TODO: Replace with actual Google Maps embed */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-100 to-amber-100">
                                <div className="text-center p-8">
                                    <MapPin className="w-16 h-16 text-red-900 mx-auto mb-4" />
                                    <div className="text-xl font-bold text-red-900 mb-2">Google Maps Here</div>
                                    <div className="text-gray-600 text-sm max-w-sm">
                                        Add your Google Maps embed code here to show your exact location
                                    </div>
                                    <div className="mt-4 text-xs text-gray-500">
                                        Get embed code from: maps.google.com → Share → Embed map
                                    </div>
                                </div>
                            </div>
                            {/* Uncomment and add your Google Maps embed:
                            <iframe
                                src="YOUR_GOOGLE_MAPS_EMBED_URL"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            */}
                        </div>

                        {/* Social Media Links (Optional) */}
                        <div className="mt-6 flex justify-center gap-4">
                            <a href="#" className="w-12 h-12 bg-red-900 hover:bg-red-800 text-white rounded-full flex items-center justify-center transition-colors">
                                <span className="sr-only">Facebook</span>
                                📘
                            </a>
                            <a href="#" className="w-12 h-12 bg-red-900 hover:bg-red-800 text-white rounded-full flex items-center justify-center transition-colors">
                                <span className="sr-only">Instagram</span>
                                📷
                            </a>
                            <a href="#" className="w-12 h-12 bg-red-900 hover:bg-red-800 text-white rounded-full flex items-center justify-center transition-colors">
                                <span className="sr-only">Yelp</span>
                                ⭐
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
