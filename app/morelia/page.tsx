"use client";

import { PageHeader, PageFooter } from "@/components/PageHeaderFooter";
import MoreliaHero from "@/components/morelia/MoreliaHero";
import MoreliaAbout from "@/components/morelia/MoreliaAbout";
import MoreliaMenu from "@/components/morelia/MoreliaMenu";
import MoreliaLocation from "@/components/morelia/MoreliaLocation";
import dynamic from 'next/dynamic';

const MoreliaOrder = dynamic(() => import('@/components/morelia/MoreliaOrder'), { ssr: false });

export default function MoreliaPage() {
    return (
        <>
            <PageHeader 
                theme="morelia" 
                title="Taqueria Y Birriera Morelia #2" 
                subtitle="Authentic Mexican Birria • Tacos • Family Recipes" 
            />
            <MoreliaHero />
            <MoreliaAbout />
            <MoreliaMenu />
            
            <div className="bg-gradient-to-b from-red-50 to-white py-16" id="order-online">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-red-900">Order Online</h2>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                            Build your perfect meal with our authentic Mexican flavors. Choose pickup time and we'll have it ready!
                        </p>
                    </div>
                    
                </div>
            </div>
            
            <MoreliaLocation />
            <PageFooter theme="morelia" />
        </>
    );
}
