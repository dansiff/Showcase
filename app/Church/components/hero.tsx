"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex h-[80vh] w-full items-center justify-center overflow-hidden">
      {/* Animated background light beams */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),_transparent_70%)]" />
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
        style={{
          background: "linear-gradient(45deg, rgba(99,102,241,0.25), rgba(30,27,75,0.4))",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute block h-2 w-2 rounded-full bg-indigo-300/30"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0.2 + Math.random() * 0.5,
            scale: 0.5,
          }}
          animate={{
            y: [null, Math.random() * -200],
            opacity: [0.5, 1, 0.5],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <div className="relative z-10 max-w-2xl text-center px-6">
        <h1 className="text-4xl font-bold md:text-6xl bg-gradient-to-r from-indigo-300 via-indigo-100 to-white bg-clip-text text-transparent">
          A Home for Foster Children
        </h1>
        <p className="mt-4 text-lg text-indigo-200/80">
          Providing love, shelter, and purpose through Christ’s grace.
        </p>
      </div>
    </section>
  );
}
