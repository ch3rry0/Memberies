export const metadata = {
  title: "Memberies",
  description: "Memberies. Les pages de connexion et d’inscription sont disponibles séparément.",
}

import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-[#fbf7f2] px-8 py-12 text-center shadow-[0_18px_38px_rgba(87,60,141,0.22)]">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#7d61b5]">Memberies</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-stone-950">Page d’accueil</h1>
        <p className="mt-4 text-stone-600">L’authentification est disponible sur les routes dédiées.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-full bg-[#8a74c3] px-6 font-semibold text-white shadow-[0_10px_22px_rgba(110,85,168,0.35)]">
            Aller au login
          </Link>
          <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 px-6 font-semibold text-stone-800">
            Aller au register
          </Link>
        </div>
      </section>
    </main>
  )
}
