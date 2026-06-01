"use client"

export default function Home() {
  return (
    <div className="w-full" style={{ background: "#FFFCF8" }}>

      {/* Hero */}
      <section className="h-screen flex items-center px-20">
        
        {/* Gauche — texte */}
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
            Never forget{" "}
            <span
              className="text-white px-3 py-2 rounded-lg italic"
              style={{ background: "#614798" }}
            >
              your history.
            </span>
          </p>
          <button
            className="mt-10 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-opacity hover:opacity-80 cursor-pointer"
            style={{ background: "#614798" }}
          >
            Get Started
          </button>
        </div>

        {/* Droite — image */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/images/soldier-helmet.jpg"
            alt="WW1 Helmet"
            className="w-full max-w-2xl object-contain"
            style={{ maxHeight: "80vh" }}
          />
        </div>

      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-20" style={{ background: "#EDE6FD" }}>
        <h2 className="text-5xl font-bold mb-16 font-logo" style={{ color: "#000000" }}>Testimonials</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              quote: "Memberies allowed me to rediscover the story of my grandfather, a soldier in 1916. It's more than an archive — it's a sacred connection.",
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
          ].map((t, i) => (
            <div
              key={i}
              className="rounded-xl p-8 flex flex-col justify-between gap-8"
              style={{
                background: i === 1 ? "#614798" : "white",
                border: i === 1 ? "none" : "1px solid #B2A4D1"
              }}
            >
              <div>
                <span
                  className="text-5xl font-script"
                  style={{ color: i === 1 ? "rgba(255,255,255,0.4)" : "#B2A4D1" }}
                >
                  "
                </span>
                <p
                  className="text-lg leading-relaxed mt-2 font-script"
                  style={{ color: i === 1 ? "white" : "#3C3C3C" }}
                >
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img src={t.avatar} className="w-12 h-12 rounded-full" alt={t.name} />
                <div>
                  <p className="font-semibold tracking-wide" style={{ color: i === 1 ? "white" : "#000000" }}>{t.name}</p>
                  <p className="text-xs tracking-widest" style={{ color: i === 1 ? "rgba(255,255,255,0.5)" : "#868585" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="py-24 px-20" style={{ background: "#FFFCF8" }}>
        <p className="text-sm tracking-widest uppercase mb-4" style={{ color: "#868585" }}>How it works</p>
        <h2 className="text-5xl font-bold mb-16 font-logo" style={{ color: "#000000" }}>Four steps to get started</h2>
        <div className="grid grid-cols-4 gap-8">
          {[
            { number: "01", title: "Create your account", desc: "Sign up for free in less than a minute. No credit card required." },
            { number: "02", title: "Write your story", desc: "Share your ancestor's journey — their regiment, their battles, their courage." },
            { number: "03", title: "Upload certificates", desc: "Add documents, medals or photos to authenticate and enrich your story." },
            { number: "04", title: "Share with the world", desc: "Your story joins thousands of others, preserved for future generations." },
          ].map((step, i) => (
            <div key={i} className="flex flex-col gap-4">
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

      {/* ── CTA ── */}
      <section
        className="py-32 px-12 flex flex-col items-center justify-center text-center"
        style={{ background: "#EDE6FD" }}
      >
        <p className="text-sm tracking-widest uppercase mb-6" style={{ color: "#868585" }}>
          Join Memberies
        </p>
        <h2 className="text-5xl font-bold mb-10 max-w-xl font-logo" style={{ color: "#000000" }}>
          Every soldier had a story. Help us preserve it.
        </h2>
        <button
          className="px-12 py-5 rounded-full text-white font-semibold text-xl transition-opacity hover:opacity-80 cursor-pointer"
          style={{ background: "#614798" }}
        >
          Get Started
        </button>
      </section>

    </div>
  )
}