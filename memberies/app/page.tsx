import Image from "next/image"
import { cookies } from "next/headers"
import { LANG_COOKIE_NAME, normalizeLang, type Lang } from "../lib/lang"
import Link from "next/link"

const contentByLang = {
  en: {
    heroIntro: "Never forget",
    heroHighlight: "your history.",
    getStarted: "Get Started",
    testimonialsTitle: "Testimonials",
    testimonials: [
      {
        quote: "Memberies allowed me to rediscover the story of my grandfather, a soldier in 1916. It's more than an archive - it's a sacred connection.",
        name: "Jean Dupont",
        role: "FAMILY ARCHIVIST",
        avatar: "https://imgs.search.brave.com/Zmijgeq7FwiNfij-hCWFWJCjt3yrt-8X9vcHPkkwuiw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTQv/MTk0LzE5OC9zbWFs/bC9hdmF0YXItaWNv/bi1odW1hbi1hLXBl/cnNvbi1zLWJhZGdl/LXNvY2lhbC1tZWRp/YS1wcm9maWxlLXN5/bWJvbC10aGUtc3lt/Ym9sLW9mLWEtcGVy/c29uLXZlY3Rvci5q/cGc",
      },
      {
        quote: "An interface of rare elegance that respects the solemnity of the subjects. An indispensable tool for the duty of memory.",
        name: "Marie Leclerc",
        role: "HISTORIAN",
        avatar: "https://avatar.vercel.sh/marie",
      },
      {
        quote: "Finally a space where memories are not just data, but heritage. Each story is treated with the prestige it deserves.",
        name: "Thomas Bernard",
        role: "CONTRIBUTOR",
        avatar: "https://imgs.search.brave.com/77QbyaNJHOVxKspf-CFKpZd-geBXC4bqywyGE6p8H6M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTQv/MTk0LzIxNS9zbWFs/bC9hdmF0YXItaWNv/bi1odW1hbi1hLXBl/cnNvbi1zLWJhZGdl/LXNvY2lhbC1tZWRp/YS1wcm9maWxlLXN5/bWJvbC10aGUtc3lt/Ym9sLW9mLWEtcGVy/c29uLXZlY3Rvci5q/cGc",
      },
    ],
    howItWorks: "How it works",
    fourSteps: "Four steps to get started",
    steps: [
      { number: "01", title: "Create your account", desc: "Sign up for free in less than a minute. No credit card required." },
      { number: "02", title: "Write your story", desc: "Share your ancestor's journey - their regiment, their battles, their courage." },
      { number: "03", title: "Upload certificates", desc: "Add documents, medals or photos to authenticate and enrich your story." },
      { number: "04", title: "Share with the world", desc: "Your story joins thousands of others, preserved for future generations." },
    ],
    join: "Join Memberies",
    ctaTitle: 
    "They all had a story. Help us preserve it.",
  },
  fr: {
    heroIntro: "N'oubliez jamais",
    heroHighlight: "votre histoire.",
    getStarted: "Commencer",
    testimonialsTitle: "Témoignages",
    testimonials: [
      {
        quote: "Memberies m'a permis de redécouvrir l'histoire de mon grand-père, soldat en 1916. Ce n'est pas un simple archive, c'est un lien sacré.",
        name: "Jean Dupont",
        role: "ARCHIVISTE FAMILIAL",
        avatar: "https://imgs.search.brave.com/Zmijgeq7FwiNfij-hCWFWJCjt3yrt-8X9vcHPkkwuiw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTQv/MTk0LzE5OC9zbWFs/bC9hdmF0YXItaWNv/bi1odW1hbi1hLXBl/cnNvbi1zLWJhZGdl/LXNvY2lhbC1tZWRp/YS1wcm9maWxlLXN5/bWJvbC10aGUtc3lt/Ym9sLW9mLWEtcGVy/c29uLXZlY3Rvci5q/cGc",
      },
      {
        quote: "Une interface d'une rare élégance qui respecte la solennité des sujets. Un outil indispensable pour le devoir de mémoire.",
        name: "Marie Leclerc",
        role: "HISTORIENNE",
        avatar: "https://avatar.vercel.sh/marie",
      },
      {
        quote: "Enfin un espace où les souvenirs ne sont pas que des données, mais un héritage. Chaque histoire reçoit le prestige qu'elle mérite.",
        name: "Thomas Bernard",
        role: "CONTRIBUTEUR",
        avatar: "https://imgs.search.brave.com/77QbyaNJHOVxKspf-CFKpZd-geBXC4bqywyGE6p8H6M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVeenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTQv/MTk0LzIxNS9zbWFs/bC9hdmF0YXItaWNv/bi1odW1hbi1hLXBl/cnNvbi1zLWJhZGdl/LXNvY2lhbC1tZWRp/YS1wcm9maWxlLXN5/bWJvbC10aGUtc3lt/Ym9sLW9mLWEtcGVy/c29uLXZlY3Rvci5q/cGc",
      },
    ],
    howItWorks: "Comment ca marche",
    fourSteps: "Quatre etapes pour commencer",
    steps: [
      { number: "01", title: "Creez votre compte", desc: "Inscrivez-vous gratuitement en moins d'une minute. Aucune carte bancaire necessaire." },
      { number: "02", title: "Ecrivez votre histoire", desc: "Partagez le parcours de votre ancetre - son regiment, ses batailles, son courage." },
      { number: "03", title: "Ajoutez vos documents", desc: "Ajoutez des certificats, medailles ou photos pour enrichir et authentifier l'histoire." },
      { number: "04", title: "Partagez avec le monde", desc: "Votre histoire rejoint des milliers d'autres, preservees pour les futures generations." },
    ],
    join: "Rejoindre Memberies",
    ctaTitle: "Ils avaient tous une histoire. Aidez-nous a la preserver.",
  },
} as const

function getContent(lang: Lang) {
  return contentByLang[lang]
}

export default async function Home() {
  const cookieStore = await cookies()
  const lang = normalizeLang(cookieStore.get(LANG_COOKIE_NAME)?.value)
  const t = getContent(lang)

  return (
    <div className="w-full" style={{ background: "#FFFCF8" }}>
      <section className="h-screen flex items-center px-20">
        <div className="flex-1">
          <h1
            className="font-bold tracking-tight font-logo mb-4"
            style={{ fontSize: "8vw", lineHeight: 1, color: "#000000" }}
          >
            Memberies
          </h1>
          <p
            className="text-2xl tracking-wide"
            style={{ marginTop: "-4px", color: "#3C3C3C" }}
          >
            &ldquo;{t.heroIntro}&rdquo;&nbsp;
            <span
              className="text-white px-3 py-2 rounded-lg italic"
              style={{ background: "#614798" }}
            >
              {t.heroHighlight}
            </span>
          </p>
          <div className="pt-7">
          <Link
            href="/register"
            className="mt-10 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-opacity hover:opacity-80 cursor-pointer"
            style={{ background: "#614798" }}
            >
            {t.getStarted}
          </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-20" style={{ background: "#EDE6FD" }}>
        <h2 className="text-5xl font-bold mb-16 font-logo" style={{ color: "#000000" }}>{t.testimonialsTitle}</h2>
        <div className="grid grid-cols-3 gap-6">
          {t.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-xl p-8 flex flex-col justify-between gap-8"
              style={{
                background: index === 1 ? "#614798" : "white",
                border: index === 1 ? "none" : "1px solid #B2A4D1",
              }}
            >
              <div>
                <span
                  className="text-5xl font-script"
                  style={{ color: index === 1 ? "rgba(255,255,255,0.4)" : "#B2A4D1" }}
                >
                  &ldquo;
                </span>
                <p
                  className="text-lg leading-relaxed mt-2 font-script"
                  style={{ color: index === 1 ? "white" : "#3C3C3C" }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Image src={testimonial.avatar} className="rounded-full" alt={testimonial.name} width={48} height={48} unoptimized />
                <div>
                  <p className="font-semibold tracking-wide" style={{ color: index === 1 ? "white" : "#000000" }}>{testimonial.name}</p>
                  <p className="text-xs tracking-widest" style={{ color: index === 1 ? "rgba(255,255,255,0.5)" : "#868585" }}>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-20" style={{ background: "#FFFCF8" }}>
        <p className="text-sm tracking-widest uppercase mb-4" style={{ color: "#868585" }}>{t.howItWorks}</p>
        <h2 className="text-5xl font-bold mb-16 font-logo" style={{ color: "#000000" }}>{t.fourSteps}</h2>
        <div className="grid grid-cols-4 gap-8">
          {t.steps.map((step, index) => (
            <div key={index} className="flex flex-col gap-4">
              <span className="text-4xl font-bold" style={{ color: "#B2A4D1" }}>
                {step.number}
              </span>
              <div className="h-px w-full" style={{ background: "#EDE6FD" }} />
              <h3 className="font-semibold text-lg" style={{ color: "#000000" }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#3C3C3C" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="py-32 px-12 flex flex-col items-center justify-center text-center"
        style={{ background: "#EDE6FD" }}
      >
        <p className="text-sm tracking-widest uppercase mb-6" style={{ color: "#868585" }}>
          {t.join}
        </p>
        <h2 className="text-5xl font-bold mb-10 max-w-xl font-logo" style={{ color: "#000000" }}>
          {t.ctaTitle}
        </h2>
        <Link
          href="/register"
          className="px-12 py-5 rounded-full text-white font-semibold text-xl transition-opacity hover:opacity-80 cursor-pointer"
          style={{ background: "#614798" }}
        >
          {t.getStarted}
        </Link>
      </section>
    </div>
  )
}
