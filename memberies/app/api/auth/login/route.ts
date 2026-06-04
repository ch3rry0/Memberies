import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { buildSessionCookie, createSessionToken, hashSessionToken, normalizeEmail, verifyPassword } from "../../../../lib/auth"
import { getLangFromCookieHeader } from "../../../../lib/lang"

const SESSION_DAYS = 30

export async function POST(request: Request) {
  const lang = getLangFromCookieHeader(request.headers.get("cookie"))
  const t = {
    required: lang === "en" ? "Email and password are required." : "E-mail et mot de passe sont requis.",
    invalid: lang === "en" ? "Invalid credentials." : "Identifiants invalides.",
  }

  const body = await request.json().catch(() => ({}))

  const email = typeof body.email === "string" ? normalizeEmail(body.email) : ""
  const password = typeof body.password === "string" ? body.password : ""
  const rememberMe = Boolean(body.rememberMe)

  if (!email || !password) {
    return NextResponse.json({ error: t.required }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !verifyPassword(password, user.password)) {
    return NextResponse.json({ error: t.invalid }, { status: 401 })
  }

  const token = createSessionToken()
  const expiresAt = new Date(Date.now() + (rememberMe ? SESSION_DAYS : 7) * 24 * 60 * 60 * 1000)

  await prisma.session.create({ data: { tokenHash: hashSessionToken(token), expiresAt, userId: user.id } })

  const cookie = buildSessionCookie(token, expiresAt)
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { headers: { "Set-Cookie": cookie } })
}
