"use server";

import { db } from "@/lib/db";
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

export async function updateMember(formData: FormData) {
  const memberId = z.string().min(1).parse(formData.get("memberId"));
  const parsed = memberSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/members/${memberId}/edit?error=invalid`);
  await db.member.update({
    where: { id: memberId },
    data: {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(`${parsed.data.expiresAt}T12:00:00`) : null,
    },
  });
  revalidatePath("/");
  revalidatePath("/members");
  redirect("/members");
}

export async function deleteMember(formData: FormData) {
  const memberId = z.string().min(1).parse(formData.get("memberId"));
  await db.member.delete({ where: { id: memberId } });
  revalidatePath("/");
  revalidatePath("/members");
  revalidatePath("/payments");
  redirect("/members");
}

const paymentSchema = z.object({
  memberId: z.string().min(1),
  amount: z.coerce.number().positive(),
  method: z.enum(["CASH", "CARD", "TRANSFER"]),
  expiresAt: z.string().optional(),
  paidAt: z.string().optional(),
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

export async function updatePayment(formData: FormData) {
  const paymentId = z.string().min(1).parse(formData.get("paymentId"));
  const parsed = paymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`/payments/${paymentId}/edit?error=invalid`);
  await db.$transaction([
    db.payment.update({
      where: { id: paymentId },
      data: {
        memberId: parsed.data.memberId,
        amount: parsed.data.amount,
        method: parsed.data.method,
        ...(parsed.data.paidAt ? { paidAt: new Date(`${parsed.data.paidAt}T12:00:00`) } : {}),
      },
    }),
    ...(parsed.data.expiresAt
      ? [db.member.update({ where: { id: parsed.data.memberId }, data: { expiresAt: new Date(`${parsed.data.expiresAt}T12:00:00`) } })]
      : []),
  ]);
  revalidatePath("/");
  revalidatePath("/members");
  revalidatePath("/payments");
  redirect("/payments");
}

export async function deletePayment(formData: FormData) {
  const paymentId = z.string().min(1).parse(formData.get("paymentId"));
  await db.payment.delete({ where: { id: paymentId } });
  revalidatePath("/");
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
