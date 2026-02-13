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
            
            
            <MoreliaLocation />
            <PageFooter theme="morelia" />
        </>
    );
}
