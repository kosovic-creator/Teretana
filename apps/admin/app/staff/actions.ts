"use server";

import { auth } from "@/auth";
import { db } from "@puls/database";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type CreateStaffState = { error?: string };

const staffSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(10).refine((value) => Buffer.byteLength(value, "utf8") <= 72),
  confirmPassword: z.string(),
});

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
    return { error: "Provjeri ime, email i lozinku (10–72 bajta)." };
  }

  const { name, email, password, confirmPassword } = parsed.data;
  if (password !== confirmPassword) return { error: "Lozinke se ne podudaraju." };

  const existing = await db.adminUser.findUnique({ where: { email }, select: { id: true } });
  if (existing) return { error: "Nalog s ovim emailom već postoji." };

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
