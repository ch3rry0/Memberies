import { NextResponse } from "next/server"
import { buildLangCookie, normalizeLang } from "../../../lib/lang"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { lang?: string }
  const lang = normalizeLang(body.lang)

  return NextResponse.json(
    { lang },
    {
      headers: {
        "Set-Cookie": buildLangCookie(lang),
      },
    },
  )
}