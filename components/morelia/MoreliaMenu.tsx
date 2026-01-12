"use client";

export default function MoreliaMenu() {
    const menuCategories = [
        {
            name: "🔥 Birria Specialties",
            description: "Our famous slow-cooked birria",
            items: [
                { name: "Birria Tacos", price: "$3.50", desc: "Traditional birria on corn tortillas with cilantro & onions" },
                { name: "Quesabirria", price: "$4.00", desc: "Crispy cheese-crusted tacos with birria & melted cheese" },
                { name: "Birria Plate", price: "$13.99", desc: "Full plate with rice, beans, tortillas & consomé" },
                { name: "Consomé (Cup)", price: "$3.00", desc: "Rich birria broth for dipping" },
                { name: "Mulitas de Birria", price: "$8.99", desc: "Two tortillas with birria, cheese & toppings" },
            ]
        },
        {
            name: "🌮 Street Tacos",
            description: "Authentic Mexican street-style tacos",
            items: [
                { name: "Carne Asada", price: "$3.00", desc: "Grilled steak with cilantro & onions" },
                { name: "Al Pastor", price: "$3.00", desc: "Marinated pork with pineapple" },
                { name: "Pollo Asado", price: "$2.75", desc: "Grilled chicken with fresh toppings" },
                { name: "Carnitas", price: "$3.00", desc: "Slow-cooked pulled pork" },
                { name: "Lengua", price: "$3.50", desc: "Beef tongue, tender and flavorful" },
                { name: "Cabeza", price: "$3.50", desc: "Beef head meat, traditional style" },
            ]
        },
        {
            name: "🍴 Plates & Combos",
            description: "Complete meals with sides",
            items: [
                { name: "3 Taco Combo", price: "$10.99", desc: "Choice of 3 tacos with rice & beans" },
                { name: "Quesadilla Plate", price: "$11.99", desc: "Large quesadilla with meat, rice & beans" },
                { name: "Burrito Supreme", price: "$10.99", desc: "Loaded burrito with choice of meat" },
                { name: "Torta", price: "$9.99", desc: "Mexican sandwich with choice of meat" },
                { name: "Sopes (3)", price: "$10.99", desc: "Thick tortillas with meat, beans & toppings" },
            ]
        },
        {
            name: "🥤 Drinks & Sides",
            description: "Complete your meal",
            items: [
                { name: "Horchata", price: "$3.00", desc: "Fresh rice cinnamon drink" },
                { name: "Jamaica", price: "$3.00", desc: "Hibiscus flower water" },
                { name: "Tamarindo", price: "$3.00", desc: "Sweet tamarind drink" },
                { name: "Mexican Coke", price: "$2.50", desc: "Glass bottle" },
                { name: "Rice & Beans", price: "$3.50", desc: "Side of Mexican rice and beans" },
                { name: "Chips & Guacamole", price: "$5.99", desc: "Fresh made daily" },
                { name: "Chips & Salsa", price: "$3.99", desc: "House-made salsa" },
            ]
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-red-50" id="menu">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-red-900">Our Menu</h2>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                        Explore our authentic Mexican dishes made fresh daily with traditional recipes
                    </p>
                    <div className="mt-6 inline-block bg-amber-100 border-2 border-amber-500 rounded-lg px-6 py-3">
                        <p className="text-red-900 font-semibold">
                            💡 All tacos served on fresh corn tortillas • Customize your order online!
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {menuCategories.map((category, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-bold mb-2 text-red-900">{category.name}</h3>
                            <p className="text-gray-600 mb-6 text-sm">{category.description}</p>
                            <div className="space-y-4">
                                {category.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex justify-between items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">{item.name}</div>
                                            <div className="text-sm text-gray-600 mt-1">{item.desc}</div>
                                        </div>
                                        <div className="font-bold text-red-900 whitespace-nowrap">{item.price}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a href="#order-online" className="inline-flex items-center px-8 py-4 bg-red-900 hover:bg-red-800 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg">
                        Order Online Now 🛒
                    </a>
                </div>
            </div>
        </section>
    );
}
