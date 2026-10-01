"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const optionalText = z.string().trim().transform((value) => value || undefined);
const memberSchema = z.object({
  firstName: z.string().trim().min(2, "Ime mora imati najmanje 2 slova."),
  lastName: z.string().trim().min(2, "Prezime mora imati najmanje 2 slova."),
  email: z.union([z.string().trim().email("Email nije ispravan."), z.literal("")]).transform((value) => value || undefined),
  phone: optionalText,
  plan: z.enum(["MJESEČNO", "TROMJESEČNO", "GODIŠNJE"], { message: "Odaberi ispravan plan članarine." }),
  expiresAt: z.string().optional(),
});

function getValidationErrorMessage(error: z.ZodError) {
  const friendlyMessages: Record<string, string> = {
    firstName: "Ime mora imati najmanje 2 slova.",
    lastName: "Prezime mora imati najmanje 2 slova.",
    email: "Email nije ispravan.",
    phone: "Telefon nije ispravan.",
    plan: "Odaberi ispravan plan članarine.",
    memberId: "Nije odabran član.",
    amount: "Iznos mora biti pozitivan broj.",
    method: "Odaberi način plaćanja.",
    password: "Lozinka mora imati najmanje 10 znakova.",
    confirmPassword: "Lozinke se ne podudaraju.",
  };

  const firstIssue = error.issues[0];
  const fieldName = firstIssue?.path[0];

  if (typeof fieldName === "string" && fieldName in friendlyMessages) {
    return friendlyMessages[fieldName];
  }

  return "Provjeri unesene podatke.";
}

function getFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  const friendlyMessages: Record<string, string> = {
    firstName: "Ime mora imati najmanje 2 slova.",
    lastName: "Prezime mora imati najmanje 2 slova.",
    email: "Email nije ispravan.",
    phone: "Telefon nije ispravan.",
    plan: "Odaberi ispravan plan članarine.",
    memberId: "Nije odabran član.",
    amount: "Iznos mora biti pozitivan broj.",
    method: "Odaberi način plaćanja.",
    password: "Lozinka mora imati najmanje 10 znakova.",
    confirmPassword: "Lozinke se ne podudaraju.",
  };

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    if (!fieldErrors[field]) {
      fieldErrors[field] = friendlyMessages[field] || issue.message || getValidationErrorMessage(error);
    }
  }

  return fieldErrors;
}

function redirectWithFieldErrors(pathname: string, error: z.ZodError) {
  const params = new URLSearchParams({
    error: getValidationErrorMessage(error),
    fieldErrors: JSON.stringify(getFieldErrors(error)),
  });

  redirect(`${pathname}?${params.toString()}`);
}

export async function createMember(formData: FormData) {
  const parsed = memberSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    redirectWithFieldErrors("/members/new", parsed.error);
    return;
  }
  await db.member.create({
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      plan: parsed.data.plan,
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
  if (!parsed.success) {
    redirectWithFieldErrors(`/members/${memberId}/edit`, parsed.error);
    return;
  }
  await db.member.update({
    where: { id: memberId },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      plan: parsed.data.plan,
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
  memberId: z.string().min(1, "Nije odabran član."),
  amount: z.coerce.number().positive("Iznos mora biti pozitivan broj."),
  method: z.enum(["CASH", "CARD", "TRANSFER"], { message: "Odaberi način plaćanja." }),
  expiresAt: z.string().optional(),
  paidAt: z.string().optional(),
});

export async function createPayment(formData: FormData) {
  const parsed = paymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    redirectWithFieldErrors("/payments", parsed.error);
    return;
  }
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
  if (!parsed.success) {
    redirectWithFieldErrors(`/payments/${paymentId}/edit`, parsed.error);
    return;
  }
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
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const activeVisit = await db.visit.findFirst({
    where: { memberId, checkedOutAt: null, checkedIn: { gte: startOfDay } },
  });
  if (activeVisit) {
    revalidatePath("/visits");
    redirect("/visits");
  }
  await db.visit.create({ data: { memberId } });
  revalidatePath("/");
  revalidatePath("/visits");
  redirect("/visits");
}

export async function checkOutVisit(formData: FormData) {
  const visitId = z.string().min(1).parse(formData.get("visitId"));
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  await db.visit.updateMany({
    where: { id: visitId, checkedOutAt: null, checkedIn: { gte: startOfDay } },
    data: { checkedOutAt: new Date() },
  });
  revalidatePath("/");
  revalidatePath("/visits");
  redirect("/visits");
}
