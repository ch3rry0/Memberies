import type { Metadata } from "next"
import { Allura, Cormorant_Garamond, Montserrat } from "next/font/google"
import "./globals.css"

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
  description: "Memberies — mémoires et hommage",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${allura.variable} ${cormorant.variable}`}>
      <body>
        <main className="min-h-[60vh]">{children}</main>
      </body>
    </html>
  )
}
