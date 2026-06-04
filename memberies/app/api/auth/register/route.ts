import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import {
  buildSessionCookie,
  createSessionToken,
  hashSessionToken,
  hashPassword,
  normalizeEmail,
} from "../../../../lib/auth"
import { getLangFromCookieHeader } from "../../../../lib/lang"

const SESSION_DAYS = 30

export async function POST(request: Request) {
  const lang = getLangFromCookieHeader(request.headers.get("cookie"))
  const t = {
    required: lang === "en" ? "All fields are required." : "Tous les champs sont obligatoires.",
    weakPassword: lang === "en" ? "Password must be at least 8 characters." : "Le mot de passe doit contenir au moins 8 caractères.",
    emailUsed: lang === "en" ? "This email is already in use." : "Cet e-mail est déjà utilisé.",
  }

  const body = await request.json().catch(() => ({}))

  const name = typeof body.name === "string" ? body.name.trim() : ""
  const email = typeof body.email === "string" ? normalizeEmail(body.email) : ""
  const password = typeof body.password === "string" ? body.password : ""
  const rememberMe = Boolean(body.rememberMe)

  if (!name || !email || !password) {
    return NextResponse.json({ error: t.required }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: t.weakPassword }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: t.emailUsed }, { status: 409 })
  }

  const user = await prisma.user.create({ data: { name, email, password: hashPassword(password) } })

  const token = createSessionToken()
  const expiresAt = new Date(Date.now() + (rememberMe ? SESSION_DAYS : 7) * 24 * 60 * 60 * 1000)

  await prisma.session.create({ data: { tokenHash: hashSessionToken(token), expiresAt, userId: user.id } })

  const cookie = buildSessionCookie(token, expiresAt)
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { headers: { "Set-Cookie": cookie } })
}
