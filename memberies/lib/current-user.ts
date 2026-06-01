import { prisma } from "./prisma"
import { SESSION_COOKIE_NAME, hashSessionToken, readCookieValue } from "./auth"

export async function getCurrentUserByToken(token: string | undefined) {
  if (!token) {
    return null
  }

  const tokenHash = hashSessionToken(token)
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  })

  if (!session) {
    return null
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { tokenHash } }).catch(() => null)
    return null
  }

  return session.user
}

export function getCurrentUserTokenFromCookieHeader(cookieHeader: string | undefined) {
  return readCookieValue(cookieHeader, SESSION_COOKIE_NAME)
}