import { NextResponse } from "next/server"
import { getCurrentUserByToken } from "../../../../lib/current-user"
import { SESSION_COOKIE_NAME, readCookieValue } from "../../../../lib/auth"

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || ""
  const token = readCookieValue(cookieHeader, SESSION_COOKIE_NAME)
  const user = await getCurrentUserByToken(token)

  return NextResponse.json(
    user
      ? { user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } }
      : { user: null },
  )
}
