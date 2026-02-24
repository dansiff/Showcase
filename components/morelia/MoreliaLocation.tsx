"use client";

import { MapPin, Phone, Clock, Navigation, Mail } from 'lucide-react';

export default function MoreliaLocation() {
    const restaurantInfo = {
        name: "Taqueria Y Birriera Morelia #2",
        address: "3817 S Kedzie Ave",
        city: "Chicago, IL 60632",
        phone: "(872) 281-7114",
        email: "info@moreliataqueria.com",
        hours: {
            weekday: "Monday - Sunday: Open Daily",
            weekend: "Closes 8:30 PM",
        },
        googleMapsLink: "https://maps.app.goo.gl/WUsYAkn5e95a1crJ9",
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-red-900">Visit Us</h2>
                    <p className="text-lg text-gray-700">Come taste the authentic flavors of Morelia</p>
                    {/* Embedded YouTube Short */}
                    <div className="my-8 flex justify-center">
                        <iframe
                            width="320"
                            height="568"
                            src="https://www.youtube.com/embed/Zox3eqsN12g"
                            title="Morelia Short Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                    {/* Featured Photo */}
                    <div className="my-8 flex justify-center">
                        <img
                            src="/morelia/photos/4864a1e4-ee2a-4a2e-b500-87383de214cc.jpg"
                            alt="Morelia Restaurant Featured"
                            className="rounded-2xl shadow-lg max-h-[400px] object-cover"
                        />
                    </div>
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
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2973.206771180721!2d-87.70418219999999!3d41.8238455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e3300016fb693%3A0xfae17feed52eb006!2sTaqueria%20Y%20Birriera%20Morelia%20%232!5e0!3m2!1sen!2sus!4v1768259261905!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Taqueria Y Birriera Morelia #2 Location"
                            ></iframe>
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
