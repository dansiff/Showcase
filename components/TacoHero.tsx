export default function Hero() {
    return (
        <section className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
            <h1 className="text-5xl font-bold mb-4">¡Bienvenidos a Querrepario!</h1>
            <p className="text-lg mb-6 max-w-xl">
                The home of legendary tacos—made fresh every day in your neighborhood. Authentic flavors, local ingredients, and a vibrant atmosphere.
            </p>
            <a
                href="#menu"
                className="bg-yellow-400 text-black rounded-2xl px-6 py-3 font-semibold shadow-md hover:bg-yellow-500 transition"
            >
                See Our Menu
            </a>
        </section>
    );
}
