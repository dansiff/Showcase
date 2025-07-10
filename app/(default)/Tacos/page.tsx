export const metadata = {
    title: "Home - Querrepario Tacos",
    description: "Best authentic tacos in town. Fresh, local, and always delicious!",
};

import Hero from "@/components/TacoHero";
import MenuCta from "@/components/Menu-Tacos";
import Header from "@/components/ui/header";
 
export default function Home() {
    return (
        <>
        
            <Hero />
            <MenuCta />
        </>
    );
}
// This file serves as the main entry point for the Tacos page, integrating the header, hero section, and menu call-to-action.