"use client";

import { PageHeader, PageFooter } from "@/components/PageHeaderFooter";
import Hero from "@/components/TacoHero";
import MenuCta from "@/components/Menu-Tacos";
import dynamic from 'next/dynamic';

const TacoOrderEnhanced = dynamic(() => import('@/components/TacoOrderEnhanced'), { ssr: false });

 
export default function Home() {
    return (
        <>
            <PageHeader theme="taco" title="🌮 Querrepario Tacos" subtitle="Fresh • Fast • Delicious" />
            <Hero />
            <MenuCta />
            <div className="max-w-4xl mx-auto mt-16 px-4 pb-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-3 text-amber-300">Place Your Order</h2>
                    <p className="text-amber-100 max-w-2xl mx-auto">Build your perfect taco box with fresh ingredients. Choose your pickup time and we'll have it ready for you!</p>
                </div>
                <TacoOrderEnhanced />
            </div>
            <PageFooter theme="taco" />
        </>
    );
}
// This file serves as the main entry point for the Tacos page, integrating the header, hero section, and menu call-to-action.