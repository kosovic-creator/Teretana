"use server";

import { db } from "@puls/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const optionalText = z.string().trim().transform((value) => value || undefined);
const memberSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z.union([z.string().trim().email(), z.literal("")]).transform((value) => value || undefined),
  phone: optionalText,
  plan: z.enum(["MJESEČNO", "TROMJESEČNO", "GODIŠNJE"]),
  expiresAt: z.string().optional(),
});

export async function createMember(formData: FormData) {
  const parsed = memberSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/members/new?error=invalid");
  await db.member.create({
    data: {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(`${parsed.data.expiresAt}T12:00:00`) : null,
    },
  });
  revalidatePath("/");
  revalidatePath("/members");
  redirect("/members");
}

const paymentSchema = z.object({
  memberId: z.string().min(1),
  amount: z.coerce.number().positive(),
  method: z.enum(["CASH", "CARD", "TRANSFER"]),
  expiresAt: z.string().optional(),
});

export async function createPayment(formData: FormData) {
  const parsed = paymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/payments?error=invalid");
  await db.$transaction([
    db.payment.create({ data: { memberId: parsed.data.memberId, amount: parsed.data.amount, method: parsed.data.method } }),
    ...(parsed.data.expiresAt
      ? [db.member.update({ where: { id: parsed.data.memberId }, data: { expiresAt: new Date(`${parsed.data.expiresAt}T12:00:00`) } })]
      : []),
  ]);
  revalidatePath("/");
  revalidatePath("/members");
  revalidatePath("/payments");
  redirect("/payments");
}

export async function createVisit(formData: FormData) {
  const memberId = z.string().min(1).parse(formData.get("memberId"));
  await db.visit.create({ data: { memberId } });
  revalidatePath("/");
  revalidatePath("/visits");
  redirect("/visits");
}
