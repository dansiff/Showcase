export default function MenuCta() {
    const menuItems = [
        {
            name: 'Taco Al Pastor',
            description: 'Marinated pork, charred pineapple, fresh cilantro, and onion.',
            price: '$3.50',
            image: 'https://images.unsplash.com/photo-1601924572549-6c5b7ee0f877?auto=format&fit=crop&w=800&q=80',
            tags: ['🌮 Classic', '🍍 Sweet & Savory'],
        },
        {
            name: 'Carne Asada',
            description: 'Grilled steak, salsa roja, and creamy guacamole.',
            price: '$4.25',
            image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%',
            tags: ['🔥 Spicy', '🥩 High Protein'],
        },
        {
            name: 'Vegetariano',
            description: 'Grilled seasonal veggies, black beans, and queso fresco.',
            price: '$3.00',
            image: 'https://images.unsplash.com/photo-1576866209830-437f93fa054b?auto=format&fit=crop&w=800&q=80',
            tags: ['🥦 Vegetarian', '🧀 Cheese Lover'],
        },
    ];

    return (
        <section
            id="menu"
            className="py-16 px-4 md:px-12 bg-white text-gray-900 flex flex-col items-center"
        >
            <h2 className="text-4xl font-bold text-center mb-10 tracking-tight">
                Our Favorites
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-7xl">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-semibold">{item.name}</h3>
                                <span className="text-red-600 font-bold text-lg">{item.price}</span>
                            </div>
                            <p className="mt-2 text-gray-600">{item.description}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tags.map((tag, tagIdx) => (
                                    <span
                                        key={tagIdx}
                                        className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span> 
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to taste the difference?</h3>
                <p className="mb-6 text-gray-700">
                    Call now to place your order or ask about today’s specials.
                </p>
                <a
                    href="tel:+1234567890"
                    className="inline-block bg-red-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all"
                    aria-label="Call now to order"
                >
                    📞 Call Now: (123) 456-7890
                </a>
            </div>
        </section>
    );
}
