# Hulk23 Teretana

Administrativni sistem za vođenje članova, zaposlenih, uplata i dolazaka u teretani. Aplikacija je jedna Next.js aplikacija; nema zaseban Client projekat.

## Tehnologije

Next.js App Router, TypeScript, PostgreSQL, Prisma ORM, Server Actions, Tailwind CSS i shadcn/ui komponente.

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

## SMS upozorenja za istek članarine

Za slanje SMS-a postavi `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` i `CRON_SECRET` među Environment Variables u Vercel projektu za Production, pa ponovo deployaj aplikaciju. Lokalni `.env` se ne koristi u produkciji. Brojevi članova trebaju biti uneseni u međunarodnom formatu, npr. `+387...`. `MEMBERSHIP_TIME_ZONE` određuje lokalni datum isteka (podrazumijevano `Europe/Sarajevo`).

Vercel Cron je podešen u `vercel.json` da svakog dana u 06:00 UTC pozove `/api/cron/membership-reminders`. Vercel automatski šalje `Authorization: Bearer <CRON_SECRET>` zaglavlje kada je `CRON_SECRET` postavljen u produkcijskom okruženju. Raspored važi za Production deployment. Na Vercel Hobby planu cron se izvršava najviše jednom dnevno, a vrijeme izvršavanja može odstupati od zakazanog.

```powershell
Invoke-WebRequest -Method Get -Uri "https://tvoja-domena/api/cron/membership-reminders" -Headers @{ Authorization = "Bearer $env:CRON_SECRET" }
```

Ruta šalje poruku članovima čije članstvo ističe narednog lokalnog dana, dakle podsjetnik stiže dan prije isteka, a ne u trenutku isteka. Ponovni poziv za isti datum ne šalje ponovo već evidentirane poruke; nakon uspješne obnove članarine upozorenje se šalje za novi datum isteka.

## Komande

### SMS dijagnostika

Na stranici Članovi dugme „Pošalji SMS podsjetnik“ šalje poruku samo izabranom članu, odmah, bez čekanja dnevnog cron-a. Potrebni su prijava administratora, telefon i datum isteka. Za već evidentiran podsjetnik dugme prikazuje „SMS poslat“ i onemogućeno je do promjene datuma isteka. Ručno slanje se evidentira kao i automatsko, pa ga cron preskače. Poruka „SMS je prihvaćen za slanje“ znači prihvatanje zahtjeva, a ne potvrdu isporuke.

Autorizovani poziv `/api/cron/membership-reminders?dryRun=1` provjerava bazu i vraća `date`, `matched`, `eligible` i `invalidPhones`, bez slanja poruka. `eligible: 0` znači da nema neposlatih podsjetnika za sutrašnji datum. Ova provjera ne potvrđuje Twilio pristupne podatke.

Poziv bez `dryRun` vraća i `errors` (ID člana i razlog greške, uključujući Twilio kod), te `accepted` (Twilio SID i početni status). `sent` označava prihvaćene i evidentirane zahtjeve; status `queued` još ne potvrđuje isporuku. Isporuku provjeri u Twilio Messaging Logs koristeći vraćeni SID. Ne ponavljaj slanje već prihvaćene poruke radi provjere isporuke.

Telefoni se normalizuju iz formata `00382...` u `+382...`, uz uklanjanje razmaka, crtica i zagrada. Lokalni brojevi bez pozivnog broja države se odbijaju. Poslije izmjene Vercel Environment Variables potreban je novi Production deployment.

```powershell
pnpm.cmd dev                  # razvojni server
pnpm.cmd typecheck            # TypeScript provjera
pnpm.cmd build                # produkcijski build
pnpm.cmd db:studio            # Prisma Studio
pnpm.cmd auth:create-admin    # kreiranje/reset administratorskog naloga
```

Podaci se više ne čuvaju u pregledniku. Admin forme koriste Next.js Server Actions i zapisuju ih u PostgreSQL preko Prisma ORM-a.

## PWA instalacija

Hulk23 se može instalirati na telefon ili računar i otvarati u zasebnom prozoru. Manifest i ikone su dostupni i prije prijave. U preglednicima koji podržavaju instalacioni prompt prikazuje se dugme „Instaliraj Hulk23“. Na iPhone/iPad uređajima otvori aplikaciju u Safariju i izaberi Dijeli → Dodaj na početni ekran.

Za produkciju koristi HTTPS. `http://localhost:3000` je dozvoljen za lokalnu provjeru, ali običan HTTP preko LAN IP adrese nije dovoljan za PWA na telefonu.

Provjera produkcijske aplikacije:

```powershell
pnpm.cmd build
pnpm.cmd start
```

Service worker se registruje samo u produkciji. Kešira isključivo javni ekran `offline.html`, koji se prikazuje ako otvaranje stranice ne uspije zbog prekida veze. Članovi, uplate, dolasci, prijava i izmjene zahtijevaju dostupan server i bazu; privatne stranice i API odgovori se ne čuvaju u PWA kešu. Za novu verziju offline ekrana promijeni `CACHE_NAME` u `public/sw.js`.
