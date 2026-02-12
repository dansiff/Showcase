"use client";

export default function MoreliaMenu() {
    const menuCategories = [
        {
            name: "By the Pound",
            name_es: "Por Libra",
            description: "",
            items: [
                { name: "1 Lb Birria", name_es: "1 Lb Birria", price: "$21.00", desc: "", desc_es: "" },
                { name: "1 Lb Montalayo", name_es: "1 Lb Montalayo", price: "$22.00", desc: "", desc_es: "" }
            ]
        },
        {
            name: "Drinks",
            name_es: "Bebidas",
            description: "",
            items: [
                { name: "Small Horchata", name_es: "Horchata Chica", price: "$3.50", desc: "", desc_es: "" },
                { name: "Large Horchata", name_es: "Horchata Grande", price: "$4.50", desc: "", desc_es: "" },
                { name: "Large Orange Juice", name_es: "Jugo de Naranja Grande", price: "$9.75", desc: "", desc_es: "" },
                { name: "Small Orange Juice", name_es: "Jugo de Naranja Chico", price: "$8.75", desc: "", desc_es: "" },
                { name: "Large Carrot Juice", name_es: "Jugo de Zanahoria Grande", price: "$9.75", desc: "", desc_es: "" },
                { name: "Small Carrot Juice", name_es: "Jugo de Zanahoria Chico", price: "$8.75", desc: "", desc_es: "" },
                { name: "Coffee", name_es: "Café", price: "$2.00", desc: "", desc_es: "" },
                { name: "Small Smoothie", name_es: "Licuado Chico", price: "$4.50", desc: "", desc_es: "" },
                { name: "Large Smoothie", name_es: "Licuado Grande", price: "$5.00", desc: "", desc_es: "" }
            ]
        },
        {
            name: "Main Dishes",
            name_es: "Platillos",
            description: "",
            items: [
                { name: "Stuffed Peppers", name_es: "Chiles Rellenos", price: "$16.00", desc: "", desc_es: "" },
                { name: "Grilled Steak", name_es: "Carne Asada", price: "$22.00", desc: "", desc_es: "" },
                { name: "Tampiqueña Style Steak", name_es: "Tampiqueña", price: "$22.00", desc: "", desc_es: "" },
                { name: "Pork Loin in Chile de Árbol Sauce", name_es: "Lomo en Salsa de Árbol", price: "$19.50", desc: "", desc_es: "" }
            ]
        },
        {
            name: "Seafood",
            name_es: "Mariscos",
            description: "",
            items: [
                { name: "Mojarra Cooked to Your Taste", name_es: "Mojarra al Gusto", price: "$22.00", desc: "", desc_es: "" },
                { name: "Deviled Shrimp", name_es: "Camarones a la Diabla", price: "$18.00", desc: "", desc_es: "" },
                { name: "Shrimp Cocktail", name_es: "Cóctel de Camarón", price: "$18.00", desc: "", desc_es: "" },
                { name: "Shrimp Ceviche", name_es: "Ceviche de Camarón", price: "$16.00", desc: "", desc_es: "" },
                { name: "Shrimp Soup", name_es: "Caldo de Camarón", price: "$18.00", desc: "", desc_es: "" },
                { name: "Octopus Soup", name_es: "Caldo de Pulpo", price: "$19.00", desc: "", desc_es: "" },
                { name: "Fish Soup", name_es: "Caldo de Pescado", price: "$17.00", desc: "", desc_es: "" }
            ]
        },
        {
            name: "Breakfast",
            name_es: "Desayunos",
            description: "",
            notes_en: "Coffee included",
            notes_es: "Café incluido",
            items: [
                { name: "Fried Eggs", name_es: "Huevos Estrellados", price: "$10.00", desc: "", desc_es: "" },
                { name: "Mexican Style Eggs", name_es: "Huevos a la Mexicana", price: "$10.00", desc: "", desc_es: "" },
                { name: "Eggs with Ham", name_es: "Huevos con Jamón", price: "$10.00", desc: "", desc_es: "" },
                { name: "Eggs with Chorizo", name_es: "Huevos con Chorizo", price: "$10.00", desc: "", desc_es: "" },
                { name: "Red Chilaquiles (with meat or eggs)", name_es: "Chilaquiles Rojos (con carne o huevo)", price: "$15.00", desc: "", desc_es: "" },
                { name: "Green Chilaquiles", name_es: "Chilaquiles Verdes", price: "$15.00", desc: "", desc_es: "" }
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
                            <p className="text-gray-700 mb-1 text-sm italic">{category.name_es}</p>
                            {category.description ? <p className="text-gray-600 mb-6 text-sm">{category.description}</p> : null}
                            {category.notes_en || category.notes_es ? (
                                <p className="text-xs text-gray-600 mb-4">
                                    {category.notes_en}
                                    {category.notes_es ? (<><br/><span className="italic">{category.notes_es}</span></>) : null}
                                </p>
                            ) : null}
                            <div className="space-y-4">
                                {category.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex justify-between items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">{item.name}</div>
                                            <div className="text-sm text-gray-700 mt-1 italic">{item.name_es}</div>
                                            <div className="text-sm text-gray-600 mt-1">{item.desc}</div>
                                            <div className="text-sm text-gray-600 mt-1 italic">{item.desc_es}</div>
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
                
                <div className="mt-6 text-center text-xs text-gray-600 max-w-2xl mx-auto">
                    <p className="mb-1">Final prices are determined by the establishment at the time of purchase.</p>
                    <p className="italic">El precio final será determinado por el establecimiento al momento de la compra.</p>
                </div>
            </div>
        </section>
    );
}
