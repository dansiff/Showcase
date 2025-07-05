"use client";

import Link from "next/link";
import Logo from "./logo";

interface HeaderProps {
    logo?: React.ReactNode;
    links?: { href: string; label: string }[];
    className?: string;
}

export default function Header({
    logo = <Logo />,
    links = [
        { href: "/signin", label: "Sign In" },
        { href: "/signup", label: "Register" },
    ],
    className = "",
}: HeaderProps) {
    return (
        <header className={`z-30 mt-2 w-full md:mt-5 ${className}`}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-sm">
                    {/* Branding */}
                    <div className="flex flex-1 items-center">
                        {logo}
                    </div>

                    {/* Dynamic links */}
                    <ul className="flex flex-1 items-center justify-end gap-3">
                        {links.map((link, idx) => (
                            <li key={idx}>
                                <Link
                                    href={link.href}
                                    className={`btn-sm ${idx === links.length - 1
                                            ? "bg-gradient-to-t from-indigo-600 to-indigo-500 text-white shadow hover:bg-[length:100%_150%]"
                                            : "text-gray-300 hover:bg-[length:100%_150%]"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </header>
    );
}
