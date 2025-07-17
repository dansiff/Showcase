// app/tacos/menu/page.tsx

export const metadata = {
  title: "Menu - Querrepario Tacos",
  description: "Browse our fresh and authentic taco selections.",
};

const items = [
  {
    name: "Carne Asada Taco",
    desc: "Grilled beef with lime and spices",
    price: "$3.50",
    icon: "🥩",
  },
  {
    name: "Al Pastor Taco",
    desc: "Pork marinated with pineapple and chiles",
    price: "$3.25",
    icon: "🍍",
  },
  {
    name: "Birria Taco",
    desc: "Slow-braised beef with consomé dip",
    price: "$4.00",
    icon: "🍲",
  },
  {
    name: "Veggie Taco",
    desc: "Roasted vegetables with avocado crema",
    price: "$3.00",
    icon: "🥑",
  },
  {
    name: "Chicken Burrito",
    desc: "Grilled chicken with beans, rice, and cheese",
    price: "$6.50",
    icon: "🌯",
  },
  {
    name: "Beef Quesadilla",
    desc: "Cheesy quesadilla filled with seasoned beef",
    price: "$5.75",
    icon: "🧀",
  },
  {
    name: "Nachos",
    desc: "Corn chips with cheese, beans, salsa, and jalapeños",
    price: "$4.50",
    icon: "🌶️",
  },
  {
    name: "Churros",
    desc: "Cinnamon-sugar fried dough with chocolate dip",
    price: "$3.25",
    icon: "🍩",
  },
];

export default function TacoMenuPage() {
  return (
    <section className="relative bg-yellow-50 py-16 px-6 sm:px-8">
      {/* Flashy background */}
      <div className="absolute inset-0 bg-[url('/tacos-bg-pattern.svg')] opacity-10 bg-repeat z-0"></div>

      <div className="relative max-w-5xl mx-auto z-10">
        <h1 className="text-5xl font-extrabold text-orange-700 text-center mb-12 drop-shadow">
          Querrepario Menu
        </h1>

        <div className="grid gap-8 sm:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-3xl border border-yellow-300 bg-white p-6 shadow-xl hover:shadow-2xl transition duration-300"
            >
              <div className="text-4xl">{item.icon}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-orange-800">{item.name}</h2>
                  <span className="text-lg font-semibold text-orange-600">{item.price}</span>
                </div>
                <p className="text-brown-700 mt-1 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}