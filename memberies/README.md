This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

------------------------------------------------------------------------------------------------------------------

// ============================================
// 👤 UTILISATEUR
// ============================================
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  avatar    String?  // URL photo de profil (optionnel)

  posts     Post[]   // Un user peut avoir plusieurs posts

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ============================================
// 📝 POST (le témoignage écrit par l'utilisateur)
// ============================================
model Post {
  id         String  @id @default(cuid())
  title      String
  content    String  @db.Text // @db.Text = texte long (pas limité à 255 caractères)
  isPublic   Boolean @default(false)
  coverImage String? // URL d'une image d'illustration (optionnel)

  // Relation avec l'auteur
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId String

  // Relation avec la personne décédée
  deceased   DeceasedPerson @relation(fields: [deceasedId], references: [id], onDelete: Cascade)
  deceasedId String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ============================================
// 🕊️ PERSONNE DÉCÉDÉE (le sujet du témoignage)
// ============================================
model DeceasedPerson {
  id           String    @id @default(cuid())
  firstName    String
  lastName     String
  birthDate    DateTime? // Optionnel : on ne connaît pas toujours la date
  deathDate    DateTime? // Optionnel : idem
  photo        String?   // URL d'une photo du défunt (optionnel)
  relationship String?   // "père", "mère", "ami", "grand-mère"... (optionnel)

  posts Post[] // Une personne peut avoir plusieurs témoignages

  createdAt DateTime @default(now())
}