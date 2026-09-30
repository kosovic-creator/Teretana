# Hulk23 Teretana admin monorepo

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

## PWA instalacija

Hulk23 se može instalirati na telefon ili računar i otvarati u zasebnom prozoru. Manifest i ikone su dostupni i prije prijave. U preglednicima koji podržavaju instalacioni prompt prikazuje se dugme „Instaliraj Hulk23“. Na iPhone/iPad uređajima otvori aplikaciju u Safariju i izaberi Dijeli → Dodaj na početni ekran.

Za produkciju koristi HTTPS. `http://localhost:3000` je dozvoljen za lokalnu provjeru, ali običan HTTP preko LAN IP adrese nije dovoljan za PWA na telefonu.

Provjera produkcijske aplikacije:

```powershell
pnpm.cmd build
pnpm.cmd --filter @hulk23/admin start
```

Service worker se registruje samo u produkciji. Kešira isključivo javni ekran `offline.html`, koji se prikazuje ako otvaranje stranice ne uspije zbog prekida veze. Članovi, uplate, dolasci, prijava i izmjene zahtijevaju dostupan server i bazu; privatne stranice i API odgovori se ne čuvaju u PWA kešu. Za novu verziju offline ekrana promijeni `CACHE_NAME` u `apps/admin/public/sw.js`.
