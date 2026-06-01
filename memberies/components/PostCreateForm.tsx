"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"

type PostCreateFormProps = {
  currentUserName: string
}

type FormState = {
  title: string
  content: string
  isPublic: boolean
  firstName: string
  lastName: string
  relationship: string
  birthDate: string
  deathDate: string
  coverImage: string
  deceasedPhoto: string
}

const initialState: FormState = {
  title: "",
  content: "",
  isPublic: false,
  firstName: "",
  lastName: "",
  relationship: "",
  birthDate: "",
  deathDate: "",
  coverImage: "",
  deceasedPhoto: "",
}

function FieldLabel({ children }: { children: string }) {
  return <label className="mb-2 block text-[0.95rem] font-semibold tracking-[0.14em] text-stone-900">{children}</label>
}

function FieldShell({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      resolve(result)
    }

    reader.onerror = () => reject(new Error("Impossible de lire le fichier."))
    reader.readAsDataURL(file)
  })
}

function UploadPreview({ src, alt, onRemove }: { src: string; alt: string; onRemove: () => void }) {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-stone-200 bg-white/80 p-3 shadow-[0_10px_24px_rgba(87,60,141,0.08)]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] bg-stone-100">
        <Image src={src} alt={alt} fill unoptimized className="object-cover" />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="mt-3 inline-flex h-10 items-center justify-center rounded-full border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
      >
        Supprimer l’image
      </button>
    </div>
  )
}

export function PostCreateForm({ currentUserName }: PostCreateFormProps) {
  const [state, setState] = useState<FormState>(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>, field: "coverImage" | "deceasedPhoto") {
    const file = event.target.files?.[0]

    if (!file) {
      setState((current) => ({ ...current, [field]: "" }))
      return
    }

    try {
      const dataUrl = await readFileAsDataUrl(file)
      setState((current) => ({ ...current, [field]: dataUrl }))
    } catch {
      setError("Impossible de lire l'image sélectionnée.")
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      })

      const data = (await response.json().catch(() => null)) as { error?: string; postId?: string } | null

      if (!response.ok) {
        throw new Error(data?.error ?? "La création du post a échoué.")
      }

      setSuccess("Le post a bien été créé.")
      router.push("/posts")
      router.refresh()
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "La création du post a échoué.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[#fbf7f2] shadow-[0_18px_38px_rgba(87,60,141,0.18)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b border-stone-200/80 px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12">
            <p className="font-script text-3xl text-[#7d61b5]">Nouveau témoignage</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-stone-950 sm:text-5xl">Créer un post</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
              Renseignez les informations de la personne, ajoutez une description, des dates et une image.
              Le post sera enregistré pour {currentUserName} et pourra être rendu public ensuite.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-stone-200 bg-white/80 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-stone-400">Conseil</p>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                Les images sont stockées comme URL de données dans la base actuelle. C’est pratique pour le prototype,
                mais vous pourrez migrer vers un stockage objet plus tard si besoin.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoCard label="Auteur" value={currentUserName} />
              <InfoCard label="Visibilité" value="Public ou privé" />
              <InfoCard label="Image" value="Couverture + portrait" />
              <InfoCard label="Dates" value="Naissance + décès" />
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
            {error ? (
              <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <FieldShell>
                <FieldLabel>Titre du post</FieldLabel>
                <input
                  value={state.title}
                  onChange={(event) => setState((current) => ({ ...current, title: event.target.value }))}
                  className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                  placeholder="Un souvenir précieux"
                  autoComplete="off"
                />
              </FieldShell>

              <div className="grid gap-5 sm:grid-cols-2">
                <FieldShell>
                  <FieldLabel>Prénom</FieldLabel>
                  <input
                    value={state.firstName}
                    onChange={(event) => setState((current) => ({ ...current, firstName: event.target.value }))}
                    className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                    placeholder="Marie"
                    autoComplete="off"
                  />
                </FieldShell>

                <FieldShell>
                  <FieldLabel>Nom</FieldLabel>
                  <input
                    value={state.lastName}
                    onChange={(event) => setState((current) => ({ ...current, lastName: event.target.value }))}
                    className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                    placeholder="Dupont"
                    autoComplete="off"
                  />
                </FieldShell>
              </div>

              <FieldShell>
                <FieldLabel>Lien / relation</FieldLabel>
                <input
                  value={state.relationship}
                  onChange={(event) => setState((current) => ({ ...current, relationship: event.target.value }))}
                  className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                  placeholder="Mère, ami, oncle, grand-mère..."
                  autoComplete="off"
                />
              </FieldShell>

              <div className="grid gap-5 sm:grid-cols-2">
                <FieldShell>
                  <FieldLabel>Date de naissance</FieldLabel>
                  <input
                    type="date"
                    value={state.birthDate}
                    onChange={(event) => setState((current) => ({ ...current, birthDate: event.target.value }))}
                    className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                  />
                </FieldShell>

                <FieldShell>
                  <FieldLabel>Date de décès</FieldLabel>
                  <input
                    type="date"
                    value={state.deathDate}
                    onChange={(event) => setState((current) => ({ ...current, deathDate: event.target.value }))}
                    className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                  />
                </FieldShell>
              </div>

              <FieldShell>
                <FieldLabel>Description</FieldLabel>
                <textarea
                  value={state.content}
                  onChange={(event) => setState((current) => ({ ...current, content: event.target.value }))}
                  rows={8}
                  className="w-full rounded-[1rem] border border-stone-300 bg-white/95 px-4 py-4 text-[0.98rem] leading-7 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                  placeholder="Écrivez ici le témoignage complet, le contexte, les souvenirs, les mots importants..."
                />
              </FieldShell>

              <div className="grid gap-5">
                <UploadField
                  label="Photo de couverture"
                  hint="Elle apparaîtra sur la carte du post public."
                  preview={state.coverImage}
                  onChange={(event) => handleImageChange(event, "coverImage")}
                  onRemove={() => setState((current) => ({ ...current, coverImage: "" }))}
                />

                <UploadField
                  label="Photo de la personne"
                  hint="Optionnelle, utile pour le détail du témoignage."
                  preview={state.deceasedPhoto}
                  onChange={(event) => handleImageChange(event, "deceasedPhoto")}
                  onRemove={() => setState((current) => ({ ...current, deceasedPhoto: "" }))}
                />
              </div>

              <label className="flex items-start gap-3 rounded-[1rem] border border-stone-200 bg-white/80 p-4 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={state.isPublic}
                  onChange={(event) => setState((current) => ({ ...current, isPublic: event.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-[#7d61b5] focus:ring-[#7d61b5]"
                />
                <span>
                  Rendre ce post public immédiatement. Sinon, il restera privé dans la base pour une publication ultérieure.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center rounded-[0.9rem] bg-[#8a74c3] text-[1.06rem] font-bold text-white shadow-[0_10px_22px_rgba(110,85,168,0.35)] transition hover:-translate-y-0.5 hover:bg-[#7f67bb] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Création en cours..." : "Créer le post"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

function UploadField({
  label,
  hint,
  preview,
  onChange,
  onRemove,
}: {
  label: string
  hint: string
  preview: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <p className="mb-3 text-sm leading-6 text-stone-600">{hint}</p>
      {preview ? (
        <UploadPreview src={preview} alt={label} onRemove={onRemove} />
      ) : (
        <label className="flex min-h-36 cursor-pointer items-center justify-center rounded-[1.35rem] border border-dashed border-stone-300 bg-white/80 px-6 py-8 text-center transition hover:border-[#8a74c3] hover:bg-[#faf7ff]">
          <div>
            <p className="text-sm font-semibold text-stone-900">Cliquez pour ajouter une image</p>
            <p className="mt-2 text-sm text-stone-500">PNG, JPG ou WEBP recommandé.</p>
            <input type="file" accept="image/*" onChange={onChange} className="sr-only" />
          </div>
        </label>
      )}
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-stone-200 bg-white/80 p-4 shadow-[0_10px_24px_rgba(87,60,141,0.08)]">
      <p className="text-xs uppercase tracking-[0.3em] text-stone-400">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-stone-900">{value}</p>
    </div>
  )
}