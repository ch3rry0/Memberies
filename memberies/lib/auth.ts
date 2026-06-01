import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

export const SESSION_COOKIE_NAME = "memberies_session"
const SESSION_BYTE_LENGTH = 32
const PASSWORD_SALT_LENGTH = 16

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function hashPassword(password: string) {
  const salt = randomBytes(PASSWORD_SALT_LENGTH).toString("hex")
  const derivedKey = scryptSync(password, salt, 64).toString("hex")

  return `${salt}:${derivedKey}`
}

export function verifyPassword(password: string, storedPassword: string) {
  const [salt, expectedKey] = storedPassword.split(":")

  if (!salt || !expectedKey) {
    return false
  }

  const actualKey = scryptSync(password, salt, 64).toString("hex")
  const expectedBuffer = Buffer.from(expectedKey, "hex")
  const actualBuffer = Buffer.from(actualKey, "hex")

  if (expectedBuffer.length !== actualBuffer.length) {
    return false
  }

  return timingSafeEqual(expectedBuffer, actualBuffer)
}

export function createSessionToken() {
  return randomBytes(SESSION_BYTE_LENGTH).toString("hex")
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function buildSessionCookie(token: string, expiresAt: Date) {
  const parts = [
    `${SESSION_COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Expires=${expiresAt.toUTCString()}`,
  ]

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure")
  }

  return parts.join("; ")
}

export function buildClearSessionCookie() {
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ]

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure")
  }

  return parts.join("; ")
}

export function readCookieValue(cookieHeader: string | undefined, cookieName: string) {
  if (!cookieHeader) {
    return undefined
  }

  const cookiePair = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`))

  if (!cookiePair) {
    return undefined
  }

  return cookiePair.slice(cookieName.length + 1)
}