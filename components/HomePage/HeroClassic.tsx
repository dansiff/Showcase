type HeroClassicProps = {
    title: string
    subtitle: string
    ctaText: string
    heroImage: string
}

export default function HeroClassic({ title, subtitle, ctaText, heroImage }: HeroClassicProps) {
    return (
        <section className="relative bg-gray-100 flex flex-col items-center justify-center py-16">
            <img src={heroImage} className="w-full h-96 object-cover absolute top-0 left-0 z-0 opacity-40" />
            <div className="relative z-10 text-center">
                <h1 className="text-5xl font-bold mb-4">{title}</h1>
                <p className="text-lg mb-6">{subtitle}</p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl shadow">{ctaText}</button>
            </div>
        </section>
    )
}
