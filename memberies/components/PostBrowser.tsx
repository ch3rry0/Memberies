"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

export type PublicPostCard = {
  id: string
  title: string
  summary: string
  coverImage: string | null
  deceasedName: string
  deathDateLabel: string
  ageAtDeathLabel: string
  authorName: string
  updatedAtLabel: string
  createdAtLabel: string
  content: string
  relationship: string | null
  deceasedPhoto: string | null
}

type PostBrowserProps = {
  posts: PublicPostCard[]
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 stroke-current stroke-[2] fill-none">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export default function PostBrowser({ posts }: PostBrowserProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedPost = useMemo(() => posts.find((post) => post.id === selectedId) ?? null, [posts, selectedId])

  useEffect(() => {
    if (!selectedId) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedId(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedId])

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="font-script text-3xl text-[#7d61b5]">Publications</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-stone-950 sm:text-5xl">Les posts publics</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-stone-600 sm:text-lg">
            Retrouvez ici les témoignages rendus publics, sous forme de cartes ouvrant un descriptif détaillé sans quitter la page.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-[2rem] border border-white/70 bg-[#fbf7f2] px-6 py-14 text-center shadow-[0_18px_38px_rgba(87,60,141,0.12)]">
            <p className="text-lg font-semibold text-stone-900">Aucun post public pour le moment.</p>
            <p className="mt-2 text-stone-600">Les cartes apparaîtront ici dès qu’un post sera rendu public.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => setSelectedId(post.id)}
                className="group overflow-hidden rounded-[2rem] border border-white/70 bg-[#fbf7f2] text-left shadow-[0_18px_38px_rgba(87,60,141,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(87,60,141,0.22)] focus:outline-none focus:ring-4 focus:ring-[#cfc3f5]/60"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#8a74c3] via-[#b79adf] to-[#d8c7f2]">
                  {post.coverImage || post.deceasedPhoto ? (
                    <Image
                      src={post.coverImage ?? post.deceasedPhoto ?? ""}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-6 text-center text-white">
                      <div>
                        <p className="font-script text-4xl">Memberies</p>
                        <p className="mt-2 text-sm uppercase tracking-[0.35em]">Souvenir public</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-sm uppercase tracking-[0.3em] text-white/80">{post.deceasedName}</p>
                    <h2 className="mt-1 text-2xl font-bold leading-tight">{post.title}</h2>
                  </div>
                </div>

                <div className="space-y-4 px-5 py-5">
                  <p className="line-clamp-3 text-sm leading-6 text-stone-600">{post.summary}</p>

                  <dl className="grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
                    <div>
                      <dt className="uppercase tracking-[0.2em] text-stone-400">Décès</dt>
                      <dd className="mt-1 font-semibold text-stone-900">{post.deathDateLabel}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-[0.2em] text-stone-400">Âge</dt>
                      <dd className="mt-1 font-semibold text-stone-900">{post.ageAtDeathLabel}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-[0.2em] text-stone-400">Auteur</dt>
                      <dd className="mt-1 font-semibold text-stone-900 break-words">{post.authorName}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-[0.2em] text-stone-400">Mise à jour</dt>
                      <dd className="mt-1 font-semibold text-stone-900">{post.updatedAtLabel}</dd>
                    </div>
                  </dl>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedPost ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Fermer la fenêtre de détails"
            className="absolute inset-0 bg-stone-950/55 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
          />

          <article className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/70 bg-[#fbf7f2] shadow-[0_30px_80px_rgba(30,15,60,0.32)]">
            <div className="flex items-start justify-between gap-4 border-b border-stone-200/80 px-6 py-5 sm:px-8">
              <div>
                <p className="font-script text-2xl text-[#7d61b5]">Détail du post</p>
                <h2 className="mt-1 text-3xl font-black tracking-[-0.05em] text-stone-950">{selectedPost.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 text-stone-700 transition hover:bg-stone-100"
                aria-label="Fermer"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[320px] bg-gradient-to-br from-[#8a74c3] via-[#b79adf] to-[#d8c7f2] lg:min-h-full">
                {selectedPost.coverImage || selectedPost.deceasedPhoto ? (
                  <Image
                    src={selectedPost.coverImage ?? selectedPost.deceasedPhoto ?? ""}
                    alt={selectedPost.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center p-8 text-center text-white">
                    <div>
                      <p className="font-script text-5xl">Memberies</p>
                      <p className="mt-3 text-sm uppercase tracking-[0.35em]">Souvenir public</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
                <div className="rounded-3xl border border-stone-200 bg-white/80 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-stone-400">Résumé</p>
                  <p className="mt-3 text-base leading-7 text-stone-700">{selectedPost.summary}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBlock label="Personne décédée" value={selectedPost.deceasedName} />
                  <InfoBlock label="Relation" value={selectedPost.relationship ?? "Non renseignée"} />
                  <InfoBlock label="Décès" value={selectedPost.deathDateLabel} />
                  <InfoBlock label="Âge au décès" value={selectedPost.ageAtDeathLabel} />
                  <InfoBlock label="Auteur" value={selectedPost.authorName} />
                  <InfoBlock label="Dernière modification" value={selectedPost.updatedAtLabel} />
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white/80 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-stone-400">Descriptif complet</p>
                  <p className="mt-3 whitespace-pre-line text-base leading-7 text-stone-700">{selectedPost.content}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white/80 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-stone-400">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-stone-900 break-words">{value}</p>
    </div>
  )
}
