import { cookies } from "next/headers"
import { AuthPanel } from "../../components/auth-panel"
import { LANG_COOKIE_NAME, normalizeLang } from "../../lib/lang"

export const metadata = {
  title: "Memberies - Login",
  description: "Connexion à Memberies.",
}

export default async function LoginPage() {
  const cookieStore = await cookies()
  const lang = normalizeLang(cookieStore.get(LANG_COOKIE_NAME)?.value)

  return (
    <main className="flex min-h-screen items-start justify-center px-4 py-6 sm:py-10 lg:py-8">
      <AuthPanel initialTab="login" lang={lang} />
    </main>
  )
}
