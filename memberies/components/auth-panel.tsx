"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { FormEvent, ReactNode } from "react"
import type { Lang } from "../lib/lang"

type Tab = "login" | "signup"

type AuthFormState = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  rememberMe: boolean
}

const defaultState: AuthFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  rememberMe: true,
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <label className="mb-2 block text-[0.95rem] font-semibold tracking-[0.14em] text-stone-900">{children}</label>
}

function TextField({
  label,
  fieldName,
  type = "text",
  value,
  onChange,
  placeholder,
  rightSlot,
  autoComplete,
}: {
  label: string
  fieldName: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rightSlot?: ReactNode
  autoComplete?: string
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <input
          name={fieldName}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 text-[0.98rem] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
        />
        {rightSlot ? <div className="absolute inset-y-0 right-4 flex items-center text-stone-500">{rightSlot}</div> : null}
      </div>
    </div>
  )
}

function PasswordField({
  label,
  fieldName,
  value,
  onChange,
  placeholder,
  visible,
  onToggleVisible,
  autoComplete,
}: {
  label: string
  fieldName: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  visible: boolean
  onToggleVisible: () => void
  autoComplete?: string
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <input
          name={fieldName}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-14 w-full rounded-[0.35rem] border border-stone-300 bg-white/95 px-4 pr-12 text-[0.98rem] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8a74c3] focus:ring-4 focus:ring-[#cfc3f5]/40"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          className="absolute inset-y-0 right-3 flex items-center text-[#5c6fb5] transition hover:text-[#4d5fa1]"
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          <EyeIcon />
        </button>
      </div>
    </div>
  )
}

async function submitAuth(endpoint: string, payload: Record<string, unknown>) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => null)) as { error?: string } | null

  if (!response.ok) {
    throw new Error(data?.error ?? "Une erreur est survenue.")
  }
}

type AuthPanelProps = {
  initialTab?: Tab
  lang: Lang
}

const labels = {
  en: {
    titleLogin: "Welcome back,",
    titleSignup: "Welcome,",
    subtitleLogin: "Remember them? Why not your password ;)",
    subtitleSignup: "New? Let's get you in!",
    successLogin: "Logged in successfully.",
    successSignup: "Account created and connected.",
    errorLogin: "Login failed.",
    errorSignup: "Registration failed.",
    mismatch: "Passwords do not match.",
    loginTab: "Log In",
    signupTab: "Sign Up",
    email: "E-mail",
    password: "Password",
    rememberMe: "Remember Me",
    forgotPassword: "Forgot Password?",
    loading: "Loading...",
    fullName: "Full Name",
    confirmPassword: "Confirm Password",
    submitLogin: "Log In",
    submitSignup: "Sign Up",
    orLoginWith: "or log in with",
    needHelp: "Need Help?",
    lookHere: "Look here!",
  },
  fr: {
    titleLogin: "Bon retour,",
    titleSignup: "Bienvenue,",
    subtitleLogin: "On se souvient d'eux, souvenez-vous aussi de votre mot de passe ;)",
    subtitleSignup: "Nouveau ici ? Créons votre espace.",
    successLogin: "Connexion réussie.",
    successSignup: "Compte créé et connecté.",
    errorLogin: "Connexion impossible.",
    errorSignup: "Inscription impossible.",
    mismatch: "Les mots de passe ne correspondent pas.",
    loginTab: "Connexion",
    signupTab: "Inscription",
    email: "E-mail",
    password: "Mot de passe",
    rememberMe: "Se souvenir de moi",
    forgotPassword: "Mot de passe oublié ?",
    loading: "Chargement...",
    fullName: "Nom complet",
    confirmPassword: "Confirmer le mot de passe",
    submitLogin: "Se connecter",
    submitSignup: "S'inscrire",
    orLoginWith: "ou se connecter avec",
    needHelp: "Besoin d'aide ?",
    lookHere: "Regardez ici !",
  },
} as const

export function AuthPanel({ initialTab = "login", lang }: AuthPanelProps) {
  const tab = initialTab
  const t = labels[lang]
  const [state, setState] = useState<AuthFormState>(defaultState)
  const [loginVisible, setLoginVisible] = useState(false)
  const [signupVisible, setSignupVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const title = useMemo(() => (tab === "login" ? t.titleLogin : t.titleSignup), [tab, t.titleLogin, t.titleSignup])
  const subtitle = useMemo(
    () => (tab === "login" ? t.subtitleLogin : t.subtitleSignup),
    [tab, t.subtitleLogin, t.subtitleSignup],
  )

  function resetMessages() {
    setError(null)
    setSuccess(null)
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    resetMessages()

    const formData = new FormData(event.currentTarget)

    try {
      await submitAuth("/api/auth/login", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        rememberMe: formData.get("rememberMe") === "on",
      })

      setSuccess(t.successLogin)
      router.refresh()
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : t.errorLogin)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    resetMessages()

    const formData = new FormData(event.currentTarget)
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")

    if (password !== confirmPassword) {
      setError(t.mismatch)
      setLoading(false)
      return
    }

    try {
      await submitAuth("/api/auth/register", {
        name: String(formData.get("fullName") ?? ""),
        email: String(formData.get("email") ?? ""),
        password,
        rememberMe: formData.get("rememberMe") === "on",
      })

      setSuccess(t.successSignup)
      router.refresh()
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : t.errorSignup)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[58rem] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 text-center sm:mb-8">
        <div className="font-logo text-[clamp(3rem,6vw,5rem)] leading-none text-stone-950">Memberies.</div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-[#fbf7f2] shadow-[0_18px_38px_rgba(87,60,141,0.26)] backdrop-blur">
        <div className="border-b border-stone-200/80 bg-[#fbf7f2]/90 px-4 pt-2 sm:px-8">
          <div className="grid grid-cols-2 text-center text-[1rem] font-semibold text-stone-500">
            <Link
              href="/login"
              onClick={resetMessages}
              className={`relative pb-3 pt-1 transition ${tab === "login" ? "text-stone-900" : "hover:text-stone-700"}`}
            >
              {t.loginTab}
              <span className={`absolute inset-x-6 bottom-0 h-[3px] rounded-full bg-[#7d61b5] transition ${tab === "login" ? "opacity-100" : "opacity-0"}`} />
            </Link>
            <Link
              href="/register"
              onClick={resetMessages}
              className={`relative pb-3 pt-1 transition ${tab === "signup" ? "text-stone-900" : "hover:text-stone-700"}`}
            >
              {t.signupTab}
              <span className={`absolute inset-x-6 bottom-0 h-[3px] rounded-full bg-[#7d61b5] transition ${tab === "signup" ? "opacity-100" : "opacity-0"}`} />
            </Link>
          </div>
        </div>

        <div className="px-5 py-7 sm:px-10 sm:py-9">
          <div className="mx-auto max-w-[31rem] text-center">
            <h1 className="text-4xl font-black tracking-[-0.05em] text-stone-950 sm:text-[2.9rem]">{title}</h1>
            <p className="mt-4 text-[1.05rem] text-stone-600 font-script">{subtitle}</p>
          </div>

          {error ? (
            <div className="mx-auto mt-6 max-w-[31rem] rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mx-auto mt-6 max-w-[31rem] rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}

          <div className="mx-auto mt-8 max-w-[31rem]">
            {tab === "login" ? (
              <form className="space-y-5" onSubmit={handleLogin}>
                <TextField
                  label={t.email}
                  fieldName="email"
                  type="email"
                  value={state.email}
                  onChange={(value) => setState((current) => ({ ...current, email: value }))}
                  placeholder="john.doe@exemple.com"
                  autoComplete="email"
                />

                <PasswordField
                  label={t.password}
                  fieldName="password"
                  value={state.password}
                  onChange={(value) => setState((current) => ({ ...current, password: value }))}
                  placeholder="••••••••"
                  visible={loginVisible}
                  onToggleVisible={() => setLoginVisible((current) => !current)}
                  autoComplete="current-password"
                />

                <div className="flex items-center justify-between gap-4 text-sm text-stone-700">
                  <label className="flex items-center gap-3">
                    <input
                      name="rememberMe"
                      type="checkbox"
                      checked={state.rememberMe}
                      onChange={(event) => setState((current) => ({ ...current, rememberMe: event.target.checked }))}
                      className="h-4 w-4 rounded border-stone-300 text-[#7d61b5] focus:ring-[#7d61b5]"
                    />
                      {t.rememberMe}
                  </label>
                    <span className="cursor-default text-stone-500">{t.forgotPassword}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 flex h-14 w-full items-center justify-center rounded-[0.9rem] bg-[#8a74c3] text-[1.06rem] font-bold text-white shadow-[0_10px_22px_rgba(110,85,168,0.35)] transition hover:-translate-y-0.5 hover:bg-[#7f67bb] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? t.loading : t.submitLogin}
                </button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleSignup}>
                <TextField
                  label={t.fullName}
                  fieldName="fullName"
                  value={state.fullName}
                  onChange={(value) => setState((current) => ({ ...current, fullName: value }))}
                  placeholder="John Doe"
                  autoComplete="name"
                />

                <TextField
                  label={t.email}
                  fieldName="email"
                  type="email"
                  value={state.email}
                  onChange={(value) => setState((current) => ({ ...current, email: value }))}
                  placeholder="john.doe@exemple.com"
                  autoComplete="email"
                />

                <PasswordField
                  label={t.password}
                  fieldName="password"
                  value={state.password}
                  onChange={(value) => setState((current) => ({ ...current, password: value }))}
                  placeholder="••••••••"
                  visible={signupVisible}
                  onToggleVisible={() => setSignupVisible((current) => !current)}
                  autoComplete="new-password"
                />

                <PasswordField
                  label={t.confirmPassword}
                  fieldName="confirmPassword"
                  value={state.confirmPassword}
                  onChange={(value) => setState((current) => ({ ...current, confirmPassword: value }))}
                  placeholder="••••••••"
                  visible={signupVisible}
                  onToggleVisible={() => setSignupVisible((current) => !current)}
                  autoComplete="new-password"
                />

                <label className="flex items-center gap-3 text-sm text-stone-700">
                  <input
                    name="rememberMe"
                    type="checkbox"
                    checked={state.rememberMe}
                    onChange={(event) => setState((current) => ({ ...current, rememberMe: event.target.checked }))}
                    className="h-4 w-4 rounded border-stone-300 text-[#7d61b5] focus:ring-[#7d61b5]"
                  />
                  {t.rememberMe}
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 flex h-14 w-full items-center justify-center rounded-[0.9rem] bg-[#8a74c3] text-[1.06rem] font-bold text-white shadow-[0_10px_22px_rgba(110,85,168,0.35)] transition hover:-translate-y-0.5 hover:bg-[#7f67bb] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? t.loading : t.submitSignup}
                </button>
              </form>
            )}
          </div>

          <div className="mx-auto mt-8 max-w-[31rem]">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-x-0 top-1/2 h-px bg-stone-200" />
              <span className="relative z-10 bg-[#fbf7f2] px-4 text-sm text-stone-500">{t.orLoginWith}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[28rem] text-center text-stone-500">
        <p className="text-sm">{t.needHelp}</p>
        <p className="mt-1 text-sm">{t.lookHere}</p>
      </div>
    </div>
  )
}