import type { Lang } from "../lib/lang"

type FooterProps = {
    lang: Lang
}

const labels = {
    en: {
        rights: "All Rights Reserved.",
        about: "About",
        contact: "Contact",
    },
    fr: {
        rights: "Tous droits réservés.",
        about: "A propos",
        contact: "Contact",
    },
} as const

export default function Footer({ lang }: FooterProps) {
    const t = labels[lang]

    return (
<footer className="m-1">
    <div className="w-full mx-auto max-w-2xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center">© 2026 <a href="https://memberies.com/" className="hover:underline">Memberies Site</a>. {t.rights}
            </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
            <li> <a href="#" className="hover:underline me-4 md:me-6">{t.about}</a> </li>
            <li> <a href="#" className="hover:underline">{t.contact}</a> </li>
        </ul>
    </div>
</footer>
    )
}
