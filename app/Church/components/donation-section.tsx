"use client";

import { motion } from "framer-motion";

export default function DonationSection() {
  return (
    <section className="py-20 px-6 bg-indigo-950/40 backdrop-blur-md text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-xl mx-auto"
      >
        <h2 className="text-3xl font-semibold text-indigo-200 mb-4">
          Give Freely
        </h2>
        <p className="text-indigo-100/70 mb-6">
          Your gifts go directly toward housing, feeding, and mentoring foster children in need.
          We do not solicit donations — all giving is voluntary and spirit-led.
        </p>
        <button className="btn bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition">
          Give Freely
        </button>
        <p className="text-sm text-indigo-300 mt-4">
          100% of proceeds support children and community outreach.
        </p>
      </motion.div>
    </section>
  );
}
