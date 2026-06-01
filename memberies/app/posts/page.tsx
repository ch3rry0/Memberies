import Link from "next/link"
import { prisma } from "../../lib/prisma"
import PostBrowser, { type PublicPostCard } from "../../components/PostBrowser"

export const dynamic = "force-dynamic"

function formatDate(value: Date | null | undefined) {
  if (!value) return "Non renseignée"

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(value)
}

function formatAge(birthDate: Date | null | undefined, deathDate: Date | null | undefined) {
  if (!birthDate || !deathDate) return "Âge inconnu"

  const birthTime = birthDate.getTime()
  const deathTime = deathDate.getTime()

  if (Number.isNaN(birthTime) || Number.isNaN(deathTime) || deathTime < birthTime) {
    return "Âge inconnu"
  }

  let age = deathDate.getFullYear() - birthDate.getFullYear()
  const monthDelta = deathDate.getMonth() - birthDate.getMonth()

  if (monthDelta < 0 || (monthDelta === 0 && deathDate.getDate() < birthDate.getDate())) {
    age -= 1
  }

  return age <= 0 ? "Âge inconnu" : `${age} ans`
}

function buildSummary(content: string) {
  const cleanContent = content.replace(/\s+/g, " ").trim()

  if (cleanContent.length <= 180) return cleanContent

  return `${cleanContent.slice(0, 177).trimEnd()}...`
}

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { isPublic: true },
    include: {
      author: true,
      deceased: true,
    },
    orderBy: { updatedAt: "desc" },
  })

  const mappedPosts: PublicPostCard[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    summary: buildSummary(post.content),
    coverImage: post.coverImage,
    deceasedName: `${post.deceased.firstName} ${post.deceased.lastName}`.trim(),
    deathDateLabel: formatDate(post.deceased.deathDate),
    ageAtDeathLabel: formatAge(post.deceased.birthDate, post.deceased.deathDate),
    authorName: post.author.name,
    updatedAtLabel: formatDate(post.updatedAt),
    createdAtLabel: formatDate(post.createdAt),
    content: post.content,
    relationship: post.deceased.relationship,
    deceasedPhoto: post.deceased.photo,
  }))

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-[#fbf7f2] px-6 py-5 shadow-[0_18px_38px_rgba(87,60,141,0.12)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#7d61b5]">Création</p>
            <p className="mt-2 text-base text-stone-700">
              Vous pouvez aussi rédiger un nouveau témoignage depuis la page dédiée.
            </p>
          </div>
          <Link
            href="/posts/new"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#8a74c3] px-6 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(110,85,168,0.35)] transition hover:-translate-y-0.5 hover:bg-[#7f67bb]"
          >
            Créer un post
          </Link>
        </div>
      </section>

      <PostBrowser posts={mappedPosts} />
    </>
  )
}
