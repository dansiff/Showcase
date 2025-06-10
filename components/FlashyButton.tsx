"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type FlashyButtonProps = {
    href: string;
    children: React.ReactNode;
};

export default function FlashyButton({ href, children }: FlashyButtonProps) {
    return (
        <Link href={href} className="flex justify-center mt-8">
            <motion.a
                whileHover={{ scale: 1.08, boxShadow: "0 0 20px #38bdf8" }}
                whileTap={{ scale: 0.97 }}
                className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-bold text-xl shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                style={{ letterSpacing: "0.05em" }}
            >
                <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
                <span className="z-10 relative">{children}</span>
                {/* Sparkle effect */}
                <motion.span
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5"
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" stroke="#fff" strokeWidth="2" />
                        <circle cx="10" cy="10" r="5" fill="#fff" opacity="0.4" />
                    </svg>
                </motion.span>
            </motion.a>
        </Link>
    );
}