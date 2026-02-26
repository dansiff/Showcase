"use client";

import { Heart, Users, Award, Clock } from 'lucide-react';

export default function MoreliaAbout() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* About Us */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-red-900">Our Story</h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        Welcome to Taqueria Y Birriera Morelia #2! We bring the authentic flavors of Morelia, Mexico 
                        to your table. Our birria is slow-cooked for hours using traditional family recipes, creating 
                        the rich, tender meat that has made us a local favorite. Every taco, quesadilla, and consomé 
                        is made with love and the freshest ingredients.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center p-6 bg-red-50 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900 text-amber-300 rounded-full mb-4">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-red-900">Made with Love</h3>
                        <p className="text-gray-600">
                            Family recipes passed down through generations, prepared fresh daily
                        </p>
                    </div>

                    <div className="text-center p-6 bg-amber-50 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 text-red-900 rounded-full mb-4">
                            <Award className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-red-900">Authentic Flavors</h3>
                        <p className="text-gray-600">
                            Traditional Michoacán-style birria and Mexican classics
                        </p>
                    </div>

                    <div className="text-center p-6 bg-red-50 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900 text-amber-300 rounded-full mb-4">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-red-900">Family Owned</h3>
                        <p className="text-gray-600">
                            A proud family business serving our community since [Year]
                        </p>
                    </div>

                    <div className="text-center p-6 bg-amber-50 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 text-red-900 rounded-full mb-4">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-red-900">Always Fresh</h3>
                        <p className="text-gray-600">
                            Slow-cooked birria and fresh ingredients prepared every morning
                        </p>
                    </div>
                </div>

                {/* Specialties Banner */}
                <div className="mt-16 bg-gradient-to-r from-red-900 to-amber-600 text-white rounded-2xl p-8 md:p-12">
                    <div className="text-center">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4">Our Specialties</h3>
                        <div className="grid md:grid-cols-3 gap-6 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                <div className="text-4xl mb-3"></div>
                                <h4 className="font-bold text-xl mb-2">Birria Tacos</h4>
                                <p className="text-red-100 text-sm">Slow-cooked beef in rich consomé, topped with cilantro and onions</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                <div className="text-4xl mb-3">🧀</div>
                                <h4 className="font-bold text-xl mb-2">Quesabirria</h4>
                                <p className="text-red-100 text-sm">Crispy cheese-crusted tacos with birria and melted cheese</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                <div className="text-4xl mb-3">🍲</div>
                                <h4 className="font-bold text-xl mb-2">Consomé</h4>
                                <p className="text-red-100 text-sm">Rich, flavorful broth perfect for dipping</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
