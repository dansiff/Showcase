export const metadata = {
    title: "Home - Querrepario Tacos",
    description: "Best authentic tacos in town. Fresh, local, and always delicious!",
};

import Hero from "@/components/TacoHero";
import MenuCta from "@/components/Menu-Tacos";
import Header from "@/components/ui/header";
import Clientlayout from "@/components/layouts/clientlayout";


export default function Home() {
    return (
            <Clientlayout>
                <Header
                    logo={<img src="/logos/querrepario-tacos.svg" alt="Querrepario Tacos" className="h-8" />}
                    links={[
                        { href: "/menu", label: "Menu" },
                        { href: "/about", label: "About" },
                        { href: "/contact", label: "Contact" },
                    ]}
                />
            <Hero />
            <MenuCta />
            </Clientlayout>
    
    );
}
