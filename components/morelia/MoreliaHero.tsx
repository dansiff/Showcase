"use client";

import { MapPin, Clock, Phone, Mail, Navigation } from 'lucide-react';

export default function MoreliaHero() {
    return (
        <div className="relative bg-gradient-to-br from-red-900 via-red-800 to-amber-900 text-white overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Text */}
                    <div className="text-center md:text-left">
                        <div className="inline-block mb-4 px-4 py-2 bg-amber-500 text-red-900 font-bold rounded-full text-sm">
                            🔥 Famous for Our Birria
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            Taqueria Y Birriera<br />
                            <span className="text-amber-300">Morelia #2</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-red-100">
                            Authentic Mexican birria tacos, quesabirria, and traditional recipes passed down through generations.
                        </p>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
                           
                            <a href="#menu" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 border-2 border-white text-white font-bold rounded-lg text-lg transition-all backdrop-blur-sm">
                                View Menu
                            </a>
                        </div>
                      

                        {/* Quick Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <Clock className="w-5 h-5 text-amber-300 flex-shrink-0" />
                                <div className="text-left">
                                    <div className="font-semibold text-amber-300">Hours</div>
                                    <div className="text-red-100">Mon-Sun: 9AM - 9PM</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <Phone className="w-5 h-5 text-amber-300 flex-shrink-0" />
                                <div className="text-left">
                                    <div className="font-semibold text-amber-300">Call Us</div>
                                    <a href="tel:8722817114" className="text-red-100 hover:text-amber-300 transition-colors">(872) 281-7114</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Image/Visual */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                            {/* Placeholder for hero image - replace with actual restaurant photo */}
                            <div className="aspect-square bg-gradient-to-br from-amber-400 to-red-600 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="text-8xl mb-4">🌮</div>
                                    <div className="text-2xl font-bold">Add Your Photo Here</div>
                                    <div className="text-sm opacity-75">Replace with actual birria/restaurant image</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Floating badge */}
                        <div className="absolute -bottom-6 -right-6 bg-amber-500 text-red-900 p-6 rounded-full shadow-xl transform rotate-12">
                            <div className="text-center font-black">
                                <div className="text-3xl">4.8</div>
                                <div className="text-xs">⭐⭐⭐⭐⭐</div>
                                <div className="text-xs">Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
