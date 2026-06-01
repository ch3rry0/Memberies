import { AuthPanel } from "../../components/auth-panel"

export const metadata = {
  title: "Memberies - Login",
  description: "Connexion à Memberies.",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-start justify-center px-4 py-6 sm:py-10 lg:py-8">
      <AuthPanel initialTab="login" />
    </main>
  )
}
