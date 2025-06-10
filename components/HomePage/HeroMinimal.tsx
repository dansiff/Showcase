type HeroMinimalProps = {
    title: string
    tagline: string
}
export default function HeroMinimal({ title, tagline }: HeroMinimalProps) {
    return (
        <section className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
            <h1 className="text-4xl font-semibold mb-2">{title}</h1>
            <p className="text-gray-500">{tagline}</p>
        </section>
    )
}
