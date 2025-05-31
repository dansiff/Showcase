export default function MenuCta() {
    return (
        <section id="menu" className="py-12 bg-white flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-6">Our Favorites</h2>
            <ul className="space-y-4 text-lg mb-8">
                <li>
                    <span className="font-semibold">Taco Al Pastor</span> – Pork, pineapple, cilantro, onion
                </li>
                <li>
                    <span className="font-semibold">Carne Asada</span> – Grilled beef, fresh salsa, guacamole
                </li>
                <li>
                    <span className="font-semibold">Vegetariano</span> – Grilled veggies, black beans, queso fresco
                </li>
            </ul>
            <a
                href="tel:+1234567890"
                className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow hover:bg-red-700 transition"
            >
                Call to Order
            </a>
        </section>
    );
}
