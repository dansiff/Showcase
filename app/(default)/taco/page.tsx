"use client";

import Hero from "@/components/TacoHero";
import MenuCta from "@/components/Menu-Tacos";
import dynamic from 'next/dynamic';

const TacoOrder = dynamic(() => import('@/components/TacoOrder'), { ssr: false });

 
export default function Home() {
    return (
        <>
            <Hero />
            <MenuCta />
            <div className="max-w-3xl mx-auto mt-10 px-4">
                <h2 className="text-2xl font-semibold mb-4 text-amber-300">Place a Pickup Order</h2>
                <p className="text-sm text-gray-400 mb-4">Build your taco box and choose a pickup time. No account needed — quick and delicious.</p>
                <TacoOrder />
            </div>
        </>
    );
}
// This file serves as the main entry point for the Tacos page, integrating the header, hero section, and menu call-to-action.