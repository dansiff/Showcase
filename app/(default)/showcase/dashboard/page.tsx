"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

export default function DashboardShowcase() {
  const [data, setData] = useState([{ time: 0, value: 50 }]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((d) => [
        ...d.slice(-9),
        { time: d.length, value: Math.floor(Math.random() * 100) },
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8"
      >
        Live Data Dashboard
      </motion.h1>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gray-700 p-6 rounded-2xl shadow-lg"
      >
        <LineChart width={500} height={300} data={data}>
          <Line type="monotone" dataKey="value" stroke="#f97316" />
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="time" stroke="#ccc" />
          <YAxis stroke="#ccc" />
        </LineChart>
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        className="mt-6 px-6 py-3 bg-orange-500 rounded-full shadow-lg"
        onClick={() =>
          alert("Imagine this button launches a taco mini-game 🕹️🌮")
        }
      >
        Play Mini Game
      </motion.button>
    </div>
  );
}
