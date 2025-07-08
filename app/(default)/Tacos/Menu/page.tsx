// app/tacos/menu/page.tsx

export const metadata = {
    title: "Menu - Querrepario Tacos",
    description: "Browse our fresh and authentic taco selections.",
};

const items = [
    { name: "Carne Asada", desc: "Grilled beef with lime and spices", price: "$3.50" },
    { name: "Al Pastor", desc: "Pork marinated with pineapple and chiles", price: "$3.25" },
    { name: "Birria", desc: "Slow-braised beef with consomé dip", price: "$4.00" },
    { name: "Veggie Taco", desc: "Roasted vegetables with avocado crema", price: "$3.00" },
];

export default function TacoMenuPage() {
    return (
        <section className="max-w-4xl mx-auto py-12">
            <h1 className="text-4xl font-semibold text-center mb-10">Our Taco Menu</h1>
            <div className="grid gap-6">
                {items.map((item, i) => (
                    <div key={i} className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-md hover:shadow-lg transition">
                        <div className="flex justify-between">
                            <h2 className="text-xl font-semibold">{item.name}</h2>
                            <span className="text-indigo-400 font-medium">{item.price}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
