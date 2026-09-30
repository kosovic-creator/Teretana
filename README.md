# Puls Gym admin monorepo

Administrativni sistem za vođenje teretane:

- `apps/admin` — administracija članova, uplata i dolazaka, port `3000`
- `packages/database` — PostgreSQL Prisma šema i zajednički klijent
- `packages/ui` — zajedničke shadcn/ui komponente

## Tehnologije

Next.js App Router, TypeScript, pnpm workspaces, PostgreSQL, Prisma ORM, Server Actions, Tailwind CSS i shadcn/ui struktura.

## Prvo pokretanje

Kopiraj `.env.example` kao `.env`, a zatim pokreni PostgreSQL. Ako koristiš Docker:

```powershell
Copy-Item .env.example .env
docker compose up -d
pnpm.cmd db:migrate
pnpm.cmd auth:create-admin
pnpm.cmd dev
```

Otvori admin aplikaciju na http://localhost:3000.

Ako PostgreSQL već postoji, u `.env` postavi svoj `DATABASE_URL` i pokreni `pnpm.cmd db:migrate`.

Za autentifikaciju postavi `AUTH_SECRET`, `ADMIN_EMAIL` i `ADMIN_PASSWORD` u `.env`. Komanda `auth:create-admin` kreira novog administratora ili mijenja lozinku postojećeg administratora. Lozinka se u bazi čuva kao bcrypt hash.

## Komande

```powershell
pnpm.cmd dev          # admin aplikacija
pnpm.cmd dev:admin    # isto, eksplicitna komanda
pnpm.cmd typecheck    # TypeScript provjera
pnpm.cmd build        # produkcijski build
pnpm.cmd db:studio    # Prisma Studio
pnpm.cmd auth:create-admin # kreiranje/reset administratorskog naloga
```

Podaci se više ne čuvaju u pregledniku. Admin forme koriste Next.js Server Actions i zapisuju ih u PostgreSQL preko Prisma ORM-a.
