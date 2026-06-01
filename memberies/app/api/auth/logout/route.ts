import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { SESSION_COOKIE_NAME, buildClearSessionCookie, hashSessionToken, readCookieValue } from "../../../../lib/auth"

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || ""
  const token = readCookieValue(cookieHeader, SESSION_COOKIE_NAME)

  if (token) {
    await prisma.session.delete({ where: { tokenHash: hashSessionToken(token) } }).catch(() => null)
  }

  const clear = buildClearSessionCookie()
  return NextResponse.json({ ok: true }, { headers: { "Set-Cookie": clear } })
}
