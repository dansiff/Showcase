export default function Hero() {
    return (
        <section className="relative isolate flex flex-col items-center justify-center min-h-[60vh] px-6 py-20 text-center overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-100 shadow-inner">
            {/* Optional background blurred shape */}
            <div
                className="absolute -z-10 top-[-20%] left-1/2 w-[120%] h-[120%] -translate-x-1/2 rotate-6 bg-yellow-300 opacity-30 rounded-full blur-[100px]"
                aria-hidden="true"
            />

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
                ¡Bienvenidos a <span className="text-yellow-500">Querrepario</span>!
            </h1>

            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
                The home of legendary tacos—made fresh daily. Bold flavors, local ingredients, and a fiesta in every bite.
            </p>

            <a
                href="#menu"
                className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-2xl font-semibold shadow-lg hover:bg-yellow-500 transition duration-200"
            >
                🌮 See Our Menu
            </a>
        </section>
    );
}
