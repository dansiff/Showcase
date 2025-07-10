// app/tacos/order/page.tsx

export const metadata = {
    title: "Order Now - Querrepario Tacos",
    description: "Get your favorite tacos delivered fresh to your door.",
};

export default function TacoOrderPage() {
    return (
        <section className="max-w-2xl mx-auto py-12">
            <h1 className="text-4xl font-semibold text-center mb-6">Place Your Order</h1>
           <form className="grid gap-6 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
    <input
        type="text"
        placeholder="Full Name"
        className="rounded-md border border-gray-600 bg-gray-900 px-4 py-2 text-white placeholder-gray-400"
    />
    <input
        type="tel"
        placeholder="Phone Number"
        className="rounded-md border border-gray-600 bg-gray-900 px-4 py-2 text-white placeholder-gray-400"
    />
    <textarea
        placeholder="Order Details (e.g. 2x Al Pastor, 1x Veggie)"
        rows={4}
        className="rounded-md border border-gray-600 bg-gray-900 px-4 py-2 text-white placeholder-gray-400"
    />
    <a
        href="https://buy.stripe.com/28E9AS4KB2Px96Pf6gdIA02"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 transition text-center"
    >
        Place Your Order
    </a>
</form>
        </section>
    );
}
