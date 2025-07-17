"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";


const menu = [
  { id: 1, name: "Carne Asada", desc: "Grilled beef with lime & spices", price: 3.5 },
  { id: 2, name: "Al Pastor", desc: "Pork with pineapple & chiles", price: 3.25 },
  { id: 3, name: "Birria", desc: "Slow-braised beef, consomé dip", price: 4.0 },
  { id: 4, name: "Veggie Taco", desc: "Avocado crema & roasted veg", price: 3.0 },
  { id: 5, name: "Carnitas", desc: "Crispy pulled pork confit", price: 3.75 },
  { id: 6, name: "Chorizo Taco", desc: "Spicy sausage & potatoes", price: 3.25 },
  { id: 7, name: "Chicken Tinga", desc: "Shredded chicken in chipotle", price: 3.5 },
  { id: 8, name: "Quesabirria", desc: "Cheesy birria taco w/ dip", price: 4.5 },
  { id: 9, name: "Super Burrito", desc: "Beans, meat, guac & cheese", price: 8.0 },
];

export default function TacoOrderPage() {
  const [cart, setCart] = useState<Record<number, number>>({});

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => {
      const qty = (prev[id] || 0) + delta;
      if (qty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: qty };
    });
  };

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menu.find((m) => m.id === +id);
    return sum + (item?.price || 0) * qty;
  }, 0);

  return (
    <section className="bg-yellow-50 text-brown-900 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-orange-700 drop-shadow">
            Order Your Tacos
          </h1>
          <p className="mt-4 text-lg text-brown-800">
            Add your favorite items to your cart. Checkout is just a bite away.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {menu.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-orange-200 relative"
            >
              <h2 className="text-xl font-bold text-orange-800">{item.name}</h2>
              <p className="text-sm text-brown-700">{item.desc}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-medium text-orange-600">${item.price.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-2 py-1 rounded-full"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm w-5 text-center">
                    {cart[item.id] || 0}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-full"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {Object.keys(cart).length > 0 && (
          <div className="mt-10 bg-white border border-yellow-300 p-6 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
              <ShoppingCart size={24} /> Your Cart
            </h3>
            <ul className="divide-y divide-orange-200">
              {Object.entries(cart).map(([id, qty]) => {
                const item = menu.find((m) => m.id === +id);
                if (!item) return null;
                return (
                  <li key={id} className="py-2 flex justify-between text-brown-800">
                    <span>{qty}x {item.name}</span>
                    <span>${(item.price * qty).toFixed(2)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="text-right font-semibold text-lg mt-4 text-orange-700">
              Total: ${total.toFixed(2)}
            </div>
            <div className="mt-6 text-center">
              <button
                disabled
                className="w-full py-3 rounded-full bg-orange-400 text-white text-lg font-bold opacity-60 cursor-not-allowed"
              >
                Checkout Coming Soon
              </button>
            </div>
          </div>
        )}

        {/* Embedded Map */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-orange-800 text-center mb-4">Visit Us</h2>
          <div className="overflow-hidden rounded-2xl border-4 border-yellow-300 shadow-xl">
            <iframe
              title="Querrepario Tacos Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2968.4230196933546!2d-87.74340782409984!3d41.88715036423406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e34521d55c3db%3A0xa0911cdcbdf030ef!2s4720%20W%20Lake%20St%2C%20Chicago%2C%20IL%2060644!5e0!3m2!1sen!2sus!4v1689806127532!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
