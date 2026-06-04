"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { Lang } from "../lib/lang"

const linksByLang: Record<Lang, Array<{ href: string; label: string }>> = {
    en: [
        { href: "/", label: "Home" },
        { href: "/posts", label: "Posts" },
        { href: "/about", label: "About" },
    ],
    fr: [
        { href: "/", label: "Accueil" },
        { href: "/posts", label: "Posts" },
        { href: "/about", label: "A propos" },
    ],
}

const DARK = "#614798"
const WHITE = "#FFFCF8"

type NavbarProps = {
    initialLang: Lang
}

export default function Navbar({ initialLang }: NavbarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [langOpen, setLangOpen] = useState(false)
    const [lang, setLang] = useState<Lang>(initialLang)

    const links = linksByLang[lang]
    const signInLabel = lang === "fr" ? "Connexion" : "Sign In"

    function changeLanguage(nextLang: Lang) {
        setLang(nextLang)
        setLangOpen(false)
        void fetch("/api/lang", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lang: nextLang }),
        }).finally(() => {
            router.refresh()
        })
    }

    return (
        <nav className="fixed top-0 left-0 z-50 w-full pt-5">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-2xl font-bold tracking-tight" style={{ color: DARK }}>Memberies</Link>
                </div>
                <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5 rounded-[18px] p-1 max-h-[40px]" style={{ background: DARK }}>
                        {links.map(({ href, label }) => {
                            const active = pathname === href

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className="group relative flex h-10 min-w-[80px] items-center justify-center rounded-[20px] px-3 text-xs font-medium transition-all duration-300"
                                    style={{
                                        color: WHITE,
                                        background: DARK,
                                    }}
                                >
                                    <span className="relative z-10">{label}</span>

                                    <span
                                        className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-all duration-300"
                                        style={{
                                            background: active ? WHITE : "rgba(255,255,255,0.35)",
                                            opacity: active ? 1 : 0,
                                        }}
                                    />

                                    <span
                                        className="absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        style={{
                                            background: "rgba(255,255,255,0.08)",
                                        }}
                                    />
                                </Link>
                            )
                        })}
                    </div>

                    <motion.div whileHover="hover" initial="rest" className="relative">
                        <Link href="/login" className="relative inline-flex h-10 items-center justify-center rounded-full bg-white/90 px-4 text-sm font-semibold text-stone-800 transition">
                            <motion.span
                                className="absolute inset-0 rounded-full pointer-events-none"
                                variants={{
                                    rest: { scale: 0.85, opacity: 0 },
                                    hover: { scale: 1, opacity: 1 },
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                                style={{ border: `2px solid ${DARK}`, boxSizing: "border-box" }}
                            />
                            <span className="relative z-10">{signInLabel}</span>
                        </Link>
                    </motion.div>

                    {/* Langue */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setLangOpen((prev) => !prev)}
                            className="flex items-center gap-1 text-sm font-medium"
                            style={{ color: DARK }}
                        >
                            {lang.toUpperCase()}
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
                                    {(["en", "fr"] as const).map((l) => (
                                        <button
                                            key={l}
                                            type="button"
                                            onClick={() => changeLanguage(l)}
                                            className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50"
                                            style={{
                                                color: lang === l ? DARK : "#8C8375",
                                                fontWeight: lang === l ? 500 : 400,
                                            }}
                                        >
                                            {l === "en" ? "🇬🇧 English" : "🇫🇷 Français"}
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