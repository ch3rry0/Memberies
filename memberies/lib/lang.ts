export type Lang = "fr" | "en"

export const LANG_COOKIE_NAME = "memberies_lang"

export function normalizeLang(value: string | null | undefined): Lang {
  return value === "en" ? "en" : "fr"
}

export function getLangFromCookieHeader(cookieHeader: string | null | undefined): Lang {
  if (!cookieHeader) return "fr"

  const cookiePair = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LANG_COOKIE_NAME}=`))

  if (!cookiePair) return "fr"

  return normalizeLang(cookiePair.slice(LANG_COOKIE_NAME.length + 1))
}

export function buildLangCookie(lang: Lang) {
  const oneYearInSeconds = 60 * 60 * 24 * 365
  return `${LANG_COOKIE_NAME}=${lang}; Path=/; SameSite=Lax; Max-Age=${oneYearInSeconds}`
}