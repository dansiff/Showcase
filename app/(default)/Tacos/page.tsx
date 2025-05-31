export const metadata = {
    title: "Home - Querrepario Tacos",
    description: "Best authentic tacos in town. Fresh, local, and always delicious!",
};

import Hero from "@/components/TacoHero";
import MenuCta from "@/components/Menu-Tacos";

export default function Home() {
    return (
        <>
            <Hero />
            <MenuCta />
        </>
    );
}
