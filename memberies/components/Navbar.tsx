"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
    { href: "/", label: "Home" },
    { href: "/posts", label: "Posts" },
    { href: "/about", label: "About" },
]

const DARK = "#1A1C1E"
const WHITE = "#FFFFFF"

export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const pathname = usePathname()
    const [langOpen, setLangOpen] = useState(false)
    const [lang, setLang] = useState("EN")

    return (
        <nav className="fixed top-0 left-0 z-50 w-full px-6 pt-5">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-2xl font-bold tracking-tight" style={{ color: DARK }}>Memberies</Link>

                    <div className="relative flex items-center">
                        <button
                            type="button"
                            onClick={() => setSearchOpen((prev) => !prev)}
                            className="relative z-20 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 hover:scale-105"
                            style={{ background: DARK }}
                            aria-label={searchOpen ? "Close search" : "Open search"}
                            >
                            {searchOpen ? (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                                </svg>
                            )}
                        </button>

                        <AnimatePresence>
                            {searchOpen && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0, x: -10 }}
                                    animate={{ width: 500, opacity: 1, x: 0 }}
                                    exit={{ width: 0, opacity: 0, x: -10 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute left-12 top-0 z-10 h-10 overflow-hidden rounded-xl"
                                >
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search..."
                                        className="h-full w-full rounded-xl border-none px-4 text-sm outline-none"
                                        style={{
                                            background: DARK,
                                            color: WHITE,
                                            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5 rounded-[18px] p-1" style={{ background: DARK }}>
                        {links.map(({ href, label }) => {
                            const active = pathname === href

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className="group relative flex h-10 min-w-[78px] items-center justify-center rounded-[14px] px-3 text-xs font-medium transition-all duration-300"
                                    style={{
                                        color: active ? DARK : WHITE,
                                        background: active ? WHITE : DARK,
                                    }}
                                >
                                    <span className="relative z-10">{label}</span>

                                    <span
                                        className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-all duration-300"
                                        style={{
                                            background: active ? DARK : "rgba(255,255,255,0.35)",
                                            opacity: active ? 1 : 0,
                                        }}
                                    />

                                    <span
                                        className="absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        style={{
                                            background: active ? WHITE : "rgba(255,255,255,0.08)",
                                        }}
                                    />
                                </Link>
                            )
                        })}
                    </div>

                    {/* Langue */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setLangOpen((prev) => !prev)}
                            className="flex items-center gap-1 text-sm font-medium"
                            style={{ color: WHITE }}
                        >
                            {lang}
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                            </svg>
                        </button>

                        <AnimatePresence>
                            {langOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-28 overflow-hidden rounded-xl border shadow-lg"
                                    style={{
                                        background: WHITE,
                                        borderColor: "#E5E7EB",
                                    }}
                                >
                                    {["EN", "FR"].map((l) => (
                                        <button
                                            key={l}
                                            type="button"
                                            onClick={() => {
                                                setLang(l)
                                                setLangOpen(false)
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50"
                                            style={{
                                                color: lang === l ? DARK : "#8C8375",
                                                fontWeight: lang === l ? 500 : 400,
                                            }}
                                        >
                                            {l === "EN" ? "🇬🇧 English" : "🇫🇷 Français"}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </nav>
    );
}