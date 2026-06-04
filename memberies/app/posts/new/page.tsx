import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { PostCreateForm } from "../../../components/PostCreateForm"
import { SESSION_COOKIE_NAME } from "../../../lib/auth"
import { getCurrentUserByToken } from "../../../lib/current-user"
import { LANG_COOKIE_NAME, normalizeLang } from "../../../lib/lang"

export const metadata = {
  title: "Memberies - Créer un post",
  description: "Créer un nouveau post sur Memberies.",
}

export default async function NewPostPage() {
  const cookieStore = await cookies()
  const lang = normalizeLang(cookieStore.get(LANG_COOKIE_NAME)?.value)
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const user = await getCurrentUserByToken(token)

  if (!user) {
    redirect("/login")
  }

  const backLabel = lang === "en" ? "Back to posts" : "Retour aux posts"
  const connectedLabel = lang === "en" ? "Signed in as" : "Connecté en tant que"

  return (
    <main className="flex min-h-screen items-start justify-center px-4 py-6 sm:py-10 lg:py-8">
      <div className="w-full">
        <div className="mx-auto pt-12 mb-6 flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/posts"
            className="inline-flex h-11 items-center justify-center rounded-full border border-stone-300 bg-white/80 px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
          >
            {backLabel}
          </Link>
          <p className="hidden text-sm text-stone-500 sm:block">{connectedLabel} {user.name}</p>
        </div>

        <PostCreateForm currentUserName={user.name} lang={lang} />
      </div>
    </main>
  )
}