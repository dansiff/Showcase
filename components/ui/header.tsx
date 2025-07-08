"use client";

import Link from "next/link";
import Logo from "./logo";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
    logo?: React.ReactNode;
    links?: { href: string; label: string }[];
    className?: string;
    isAuthenticated?: boolean;
    userName?: string;
    rightContent?: React.ReactNode;
}

export default function Header({
    logo = <Logo />,
    links = [
        { href: "/signin", label: "Sign In" },
        { href: "/signup", label: "Register" },
    ],
    className = "",
    isAuthenticated = false,
    userName,
    rightContent,
}: HeaderProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className={`z-30 mt-2 w-full md:mt-5 ${className}`}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3">
                    {/* Branding */}
                    <div className="flex flex-1 items-center">
                        <Link href="/" aria-label="Homepage">
                            {logo}
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <ul className="hidden flex-1 items-center justify-end gap-3 md:flex">
                        {isAuthenticated ? (
                            <>
                                <li>
                                    <Link href="/dashboard" className="text-gray-300 hover:text-white">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/signout" className="btn-sm text-white bg-gray-700">
                                        Sign Out
                                    </Link>
                                </li>
                            </>
                        ) : (
                            links.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        className={`btn-sm ${idx === links.length - 1
                                            ? "bg-gradient-to-t from-indigo-600 to-indigo-500 text-white"
                                            : "text-gray-300 hover:text-white"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))
                        )}
                        {rightContent && <li>{rightContent}</li>}
                    </ul>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                    </button>

                    {/* Mobile Menu */}
                    {mobileOpen && (
                        <ul className="absolute top-full left-0 right-0 z-40 flex flex-col bg-gray-900 px-4 py-4 shadow-lg md:hidden">
                            {links.map((link, idx) => (
                                <li key={idx} className="mb-2">
                                    <Link href={link.href} className="block text-white">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </header>
    );
}
