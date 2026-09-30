import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { db } from "@puls/database";
import authConfig from "./auth.config";

const authSecret = process.env.AUTH_SECRET?.trim().replace(/^(["'])(.*)\1$/, "$2");

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: authSecret,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Lozinka", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const admin = await db.adminUser.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });
        if (!admin || !(await compare(parsed.data.password, admin.passwordHash))) return null;

        return { id: admin.id, name: admin.name, email: admin.email };
      },
    }),
  ],
});
