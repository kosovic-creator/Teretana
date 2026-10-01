import { hash } from "bcryptjs";
import { db } from "../lib/db";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Postavi ADMIN_EMAIL i ADMIN_PASSWORD u .env fajlu.");
  }

  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD mora imati najmanje 10 karaktera.");
  }

  const passwordHash = await hash(password, 12);
  await db.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Administrator" },
  });

  console.log(`Administrator ${email} je spreman za prijavu.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
