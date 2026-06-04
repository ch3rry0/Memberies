import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Allura, Cormorant_Garamond, Montserrat } from "next/font/google"
import "./globals.css"
import Navbar from "../components/Navbar";
import Footer from "../components/footer"
import { LANG_COOKIE_NAME, normalizeLang } from "../lib/lang"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-allura",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "Memberies",
  description: "Share your history",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const lang = normalizeLang(cookieStore.get(LANG_COOKIE_NAME)?.value)

  return (
    <html lang={lang} className={`${montserrat.variable} ${allura.variable} ${cormorant.variable}`}>
      <body>
        <Navbar initialLang={lang} />
        <main className="min-h-[60vh]">{children}
        <Footer lang={lang} />
      </main>
      </body>
    </html>
  )
}