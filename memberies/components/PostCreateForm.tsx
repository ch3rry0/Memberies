"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"
import type { Lang } from "../lib/lang"

type PostCreateFormProps = {
  currentUserName: string
  lang: Lang
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

function UploadPreview({ src, alt, onRemove, removeLabel }: { src: string; alt: string; onRemove: () => void; removeLabel: string }) {
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
        {removeLabel}
      </button>
    </div>
  )
}

export function PostCreateForm({ currentUserName, lang }: PostCreateFormProps) {
  const t = labels[lang]
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
      setError(t.readImageError)
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
        throw new Error(data?.error ?? t.createFailed)
      }

      setSuccess(t.created)
      router.push("/posts")
      router.refresh()
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : t.createFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[#fbf7f2] shadow-[0_18px_38px_rgba(87,60,141,0.18)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b border-stone-200/80 px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12">
            <p className="font-script text-3xl text-[#7d61b5]">{t.newTribute}</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-stone-950 sm:text-5xl">{t.createPost}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
              {t.introA} {currentUserName} {t.introB}
            </p>
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
                <FieldLabel>{t.postTitle}</FieldLabel>
                <input
                  value={state.title}
                  onChange={(event) => setState((current) => ({ ...current, title: event.target.value }))}
                  className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                  placeholder={t.postTitlePlaceholder}
                  autoComplete="off"
                />
              </FieldShell>

              <div className="grid gap-5 sm:grid-cols-2">
                <FieldShell>
                  <FieldLabel>{t.firstName}</FieldLabel>
                  <input
                    value={state.firstName}
                    onChange={(event) => setState((current) => ({ ...current, firstName: event.target.value }))}
                    className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                    placeholder={t.firstNamePlaceholder}
                    autoComplete="off"
                  />
                </FieldShell>

                <FieldShell>
                  <FieldLabel>{t.lastName}</FieldLabel>
                  <input
                    value={state.lastName}
                    onChange={(event) => setState((current) => ({ ...current, lastName: event.target.value }))}
                    className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                    placeholder={t.lastNamePlaceholder}
                    autoComplete="off"
                  />
                </FieldShell>
              </div>

              <FieldShell>
                <FieldLabel>{t.relation}</FieldLabel>
                <input
                  value={state.relationship}
                  onChange={(event) => setState((current) => ({ ...current, relationship: event.target.value }))}
                  className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                  placeholder={t.relationPlaceholder}
                  autoComplete="off"
                />
              </FieldShell>

              <div className="grid gap-5 sm:grid-cols-2">
                <FieldShell>
                  <FieldLabel>{t.birthDate}</FieldLabel>
                  <input
                    type="date"
                    value={state.birthDate}
                    onChange={(event) => setState((current) => ({ ...current, birthDate: event.target.value }))}
                    className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                  />
                </FieldShell>

                <FieldShell>
                  <FieldLabel>{t.deathDate}</FieldLabel>
                  <input
                    type="date"
                    value={state.deathDate}
                    onChange={(event) => setState((current) => ({ ...current, deathDate: event.target.value }))}
                    className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                  />
                </FieldShell>
              </div>

              <FieldShell>
                <FieldLabel>{t.description}</FieldLabel>
                <textarea
                  value={state.content}
                  onChange={(event) => setState((current) => ({ ...current, content: event.target.value }))}
                  rows={8}
                  className="w-full rounded-[1rem] border border-stone-300 bg-white/95 px-4 py-4 text-[0.98rem] leading-7 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
                  placeholder={t.descriptionPlaceholder}
                />
              </FieldShell>

              <div className="grid gap-5">
                <UploadField
                  label={t.coverPhoto}
                  hint={t.coverHint}
                  preview={state.coverImage}
                  onChange={(event) => handleImageChange(event, "coverImage")}
                  onRemove={() => setState((current) => ({ ...current, coverImage: "" }))}
                  removeLabel={t.removeImage}
                  uploadCta={t.uploadCta}
                  uploadHint={t.uploadHint}
                />

                <UploadField
                  label={t.personPhoto}
                  hint={t.personHint}
                  preview={state.deceasedPhoto}
                  onChange={(event) => handleImageChange(event, "deceasedPhoto")}
                  onRemove={() => setState((current) => ({ ...current, deceasedPhoto: "" }))}
                  removeLabel={t.removeImage}
                  uploadCta={t.uploadCta}
                  uploadHint={t.uploadHint}
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
                  {t.publicCheckbox}
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center rounded-[0.9rem] bg-[#8a74c3] text-[1.06rem] font-bold text-white shadow-[0_10px_22px_rgba(110,85,168,0.35)] transition hover:-translate-y-0.5 hover:bg-[#7f67bb] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? t.creating : t.createPostButton}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

const labels = {
  en: {
    readImageError: "Unable to read selected image.",
    createFailed: "Post creation failed.",
    created: "Post created successfully.",
    newTribute: "New tribute",
    createPost: "Create a post",
    introA: "Provide details, description, dates and image. This post will be saved for",
    introB: "and can be made public afterward.",
    tip: "Tip",
    tipBody: "Images are currently stored as data URLs in this prototype. You can switch to object storage later.",
    author: "Author",
    visibility: "Visibility",
    publicOrPrivate: "Public or private",
    image: "Image",
    coverAndPortrait: "Cover + portrait",
    dates: "Dates",
    birthAndDeath: "Birth + death",
    postTitle: "Post title",
    postTitlePlaceholder: "A precious memory",
    firstName: "First name",
    firstNamePlaceholder: "Marie",
    lastName: "Last name",
    lastNamePlaceholder: "Dupont",
    relation: "Relation",
    relationPlaceholder: "Mother, friend, uncle, grandmother...",
    birthDate: "Birth date",
    deathDate: "Death date",
    description: "Description",
    descriptionPlaceholder: "Write the full tribute, context, memories and key moments here...",
    coverHint: "This image appears on the public post card.",
    personHint: "Optional, useful in post details.",
    coverPhoto: "Cover photo",
    personPhoto: "Person photo",
    removeImage: "Remove image",
    uploadCta: "Click to add an image",
    uploadHint: "PNG, JPG or WEBP recommended.",
    publicCheckbox: "Make this post public immediately. Otherwise it stays private for later publication.",
    creating: "Creating...",
    createPostButton: "Create post",
  },
  fr: {
    readImageError: "Impossible de lire l'image sélectionnée.",
    createFailed: "La création du post a échoué.",
    created: "Le post a bien été créé.",
    newTribute: "Nouveau témoignage",
    createPost: "Créer un post",
    introA: "Renseignez les informations de la personne, ajoutez une description, des dates et une image. Le post sera enregistré pour",
    introB: "et pourra être rendu public ensuite.",
    tip: "Conseil",
    tipBody: "Les images sont stockées comme URL de données dans la base actuelle. C’est pratique pour le prototype, mais vous pourrez migrer vers un stockage objet plus tard si besoin.",
    author: "Auteur",
    visibility: "Visibilité",
    publicOrPrivate: "Public ou privé",
    image: "Image",
    coverAndPortrait: "Couverture + portrait",
    dates: "Dates",
    birthAndDeath: "Naissance + décès",
    postTitle: "Titre du post",
    postTitlePlaceholder: "Un souvenir précieux",
    firstName: "Prénom",
    firstNamePlaceholder: "Marie",
    lastName: "Nom",
    lastNamePlaceholder: "Dupont",
    relation: "Lien / relation",
    relationPlaceholder: "Mère, ami, oncle, grand-mère...",
    birthDate: "Date de naissance",
    deathDate: "Date de décès",
    description: "Description",
    descriptionPlaceholder: "Écrivez ici le témoignage complet, le contexte, les souvenirs, les mots importants...",
    coverHint: "Elle apparaîtra sur la carte du post public.",
    personHint: "Optionnelle, utile pour le détail du témoignage.",
    coverPhoto: "Photo de couverture",
    personPhoto: "Photo de la personne",
    removeImage: "Supprimer l'image",
    uploadCta: "Cliquez pour ajouter une image",
    uploadHint: "PNG, JPG ou WEBP recommandé.",
    publicCheckbox: "Rendre ce post public immédiatement. Sinon, il restera privé dans la base pour une publication ultérieure.",
    creating: "Création en cours...",
    createPostButton: "Créer le post",
  },
} as const

function UploadField({
  label,
  hint,
  preview,
  onChange,
  onRemove,
  removeLabel,
  uploadCta,
  uploadHint,
}: {
  label: string
  hint: string
  preview: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
  removeLabel: string
  uploadCta: string
  uploadHint: string
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <p className="mb-3 text-sm leading-6 text-stone-600">{hint}</p>
      {preview ? (
        <UploadPreview src={preview} alt={label} onRemove={onRemove} removeLabel={removeLabel} />
      ) : (
        <label className="flex min-h-36 cursor-pointer items-center justify-center rounded-[1.35rem] border border-dashed border-stone-300 bg-white/80 px-6 py-8 text-center transition hover:border-[#8a74c3] hover:bg-[#faf7ff]">
          <div>
            <p className="text-sm font-semibold text-stone-900">{uploadCta}</p>
            <p className="mt-2 text-sm text-stone-500">{uploadHint}</p>
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