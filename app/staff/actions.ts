"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type CreateStaffState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "password" | "confirmPassword", string>>;
};

const staffSchema = z.object({
  name: z.string().trim().min(2, "Ime i prezime mora imati najmanje 2 slova.").max(100, "Ime i prezime može imati najviše 100 znakova."),
  email: z.string().trim().toLowerCase().pipe(z.email("Email nije ispravan.")),
  password: z.string().min(10, "Lozinka mora imati najmanje 10 znakova.").refine((value) => Buffer.byteLength(value, "utf8") <= 72, "Lozinka može imati najviše 72 bajta."),
  confirmPassword: z.string(),
});

function getStaffFieldErrors(error: z.ZodError): CreateStaffState["fieldErrors"] {
  const map: CreateStaffState["fieldErrors"] = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field === "name" || field === "email" || field === "password" || field === "confirmPassword") {
      const message =
        field === "name"
          ? "Ime i prezime mora imati najmanje 2 slova."
          : field === "email"
            ? "Email nije ispravan."
            : field === "password"
              ? "Lozinka mora imati najmanje 10 znakova."
              : "Lozinke se ne podudaraju.";
      map[field] ??= issue.message || message;
    }
  }

  return map;
}

export async function createStaff(
  _state: CreateStaffState,
  formData: FormData,
): Promise<CreateStaffState> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Sesija je istekla. Prijavi se ponovo." };

  const parsed = staffSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { fieldErrors: getStaffFieldErrors(parsed.error) };
  }

  const { name, email, password, confirmPassword } = parsed.data;
  if (password !== confirmPassword) {
    return {
      fieldErrors: {
        password: "Lozinke se ne podudaraju.",
        confirmPassword: "Lozinke se ne podudaraju.",
      },
    };
  }

  const existing = await db.adminUser.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return {
      fieldErrors: {
        email: "Nalog s ovim emailom već postoji.",
      },
    };
  }

  try {
    await db.adminUser.create({
      data: { name, email, passwordHash: await hash(password, 12) },
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return { error: "Nalog s ovim emailom već postoji." };
    }
    throw error;
  }

  revalidatePath("/staff");
  redirect("/staff?created=1");
}
