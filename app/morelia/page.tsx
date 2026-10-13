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
            {/* Parking Banner */}
            <div className="w-full bg-amber-500 text-red-900 text-center py-2 text-base font-bold border-b-2 border-amber-700 z-50 relative">
                🚗 Parking available at <span className="underline">3811 S Kedzie Ave</span>. Enter through the alley. <span className="ml-2 italic text-sm text-red-800">Estacionamiento en 3811 S Kedzie Ave. Entrada por el callejón.</span>
            </div>
            <PageHeader 
                theme="morelia" 
                title="Taqueria Y Birriera Morelia #2" 
                subtitle="Authentic Mexican Birria • Tacos • Family Recipes" 
            />
            <MoreliaHero />
            <MoreliaAbout />
            <MoreliaMenu />
            <MoreliaLocation />
            <PageFooter theme="morelia" />
        </>
    );
}
