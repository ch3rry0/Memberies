import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "../../../lib/prisma"
import { SESSION_COOKIE_NAME, readCookieValue } from "../../../lib/auth"
import { getCurrentUserByToken } from "../../../lib/current-user"

type CreatePostBody = {
  title?: unknown
  content?: unknown
  isPublic?: unknown
  coverImage?: unknown
  deceasedPhoto?: unknown
  firstName?: unknown
  lastName?: unknown
  relationship?: unknown
  birthDate?: unknown
  deathDate?: unknown
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function parseOptionalDate(value: unknown) {
  const rawValue = asString(value)

  if (!rawValue) {
    return null
  }

  const parsedDate = new Date(rawValue)

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined
  }

  return parsedDate
}

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? ""
  const token = readCookieValue(cookieHeader, SESSION_COOKIE_NAME)
  const user = await getCurrentUserByToken(token)

  if (!user) {
    return NextResponse.json({ error: "Vous devez être connecté pour créer un post." }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as CreatePostBody

  const title = asString(body.title)
  const content = asString(body.content)
  const firstName = asString(body.firstName)
  const lastName = asString(body.lastName)
  const relationship = asString(body.relationship)
  const coverImage = asString(body.coverImage)
  const deceasedPhoto = asString(body.deceasedPhoto)
  const isPublic = Boolean(body.isPublic)
  const birthDate = parseOptionalDate(body.birthDate)
  const deathDate = parseOptionalDate(body.deathDate)

  if (!title || !content || !firstName || !lastName) {
    return NextResponse.json(
      { error: "Le titre, la description et l'identité de la personne sont obligatoires." },
      { status: 400 },
    )
  }

  if (birthDate === undefined || deathDate === undefined) {
    return NextResponse.json({ error: "La ou les dates fournies sont invalides." }, { status: 400 })
  }

  if (birthDate && deathDate && deathDate.getTime() < birthDate.getTime()) {
    return NextResponse.json({ error: "La date de décès doit être postérieure à la date de naissance." }, { status: 400 })
  }

  const post = await prisma.$transaction(async (transaction) => {
    const deceased = await transaction.deceasedPerson.create({
      data: {
        firstName,
        lastName,
        birthDate: birthDate ?? undefined,
        deathDate: deathDate ?? undefined,
        photo: deceasedPhoto || undefined,
        relationship: relationship || undefined,
      },
    })

    return transaction.post.create({
      data: {
        title,
        content,
        isPublic,
        coverImage: coverImage || undefined,
        authorId: user.id,
        deceasedId: deceased.id,
      },
    })
  })

  revalidatePath("/posts")

  return NextResponse.json({ postId: post.id })
}