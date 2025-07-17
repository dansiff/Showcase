// app/tacos/order/page.tsx

export const metadata = {
  title: "Order Now - Querrepario Tacos",
  description: "Get your favorite tacos delivered fresh to your door.",
};

export default function TacoOrderPage() {
  return (
    <section className="bg-yellow-50 text-brown-900 py-12">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-orange-700 drop-shadow">
            Order Your Tacos
          </h1>
          <p className="mt-4 text-lg text-brown-800">
            Craving the taste of Querrepario? Order now and get it delivered fast & fresh.
          </p>
        </div>

        <form className="space-y-6 bg-white border border-yellow-300 p-8 rounded-3xl shadow-xl">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl border border-orange-300 px-4 py-3 text-brown-800 placeholder:text-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full rounded-xl border border-orange-300 px-4 py-3 text-brown-800 placeholder:text-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
          <textarea
            placeholder="Order Details (e.g. 2x Al Pastor, 1x Veggie)"
            rows={4}
            className="w-full rounded-xl border border-orange-300 px-4 py-3 text-brown-800 placeholder:text-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
          <a
            href="https://buy.stripe.com/28E9AS4KB2Px96Pf6gdIA02"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center w-full rounded-xl bg-orange-600 px-6 py-3 text-white font-semibold text-lg hover:bg-orange-700 transition-all duration-300"
          >
            Place Your Order
          </a>
        </form>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-orange-800 text-center mb-4">Visit Us</h2>
          <div className="overflow-hidden rounded-2xl border-4 border-yellow-300 shadow-lg">
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
