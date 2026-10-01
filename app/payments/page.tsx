import { PageHeader } from "@/components/page-header";
import { Pencil } from "lucide-react";
import { PaymentForm } from "@/components/payment-form";
import { getMembers } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deletePayment } from "@/app/actions";
import Link from "next/link";
import { getPayments } from "@/lib/data";
import { DeleteButton } from "@/components/delete-button";

export const dynamic = "force-dynamic";

function parseFieldErrors(raw?: string) {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ error?: string; fieldErrors?: string }> }) {
  const { error, fieldErrors } = await searchParams;
  const members = await getMembers();
  const payments = await getPayments();
  const memberOptions = members.map((member) => ({
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    plan: member.plan,
    expiresAt: member.expiresAt?.toISOString().slice(0, 10) ?? null,
  }));

  return <div className="mx-auto max-w-7xl p-4 md:p-8"><PageHeader eyebrow="Finansije" title="Uplate" description="Dodaj, pregledaj i uređuj uplate članova." /><Card className="rounded-[26px] border border-emerald-800/40 bg-[#10241f]/90 shadow-[0_20px_45px_-30px_rgba(0,0,0,0.8)]"><CardHeader><CardTitle>Nova uplata</CardTitle></CardHeader><CardContent>{members.length ? <PaymentForm members={memberOptions} errorMessage={error} fieldErrors={parseFieldErrors(fieldErrors)} /> : <p className="text-sm text-emerald-100/70">Prvo dodaj člana na stranici Članovi.</p>}</CardContent></Card><Card className="mt-6 rounded-[26px] border border-emerald-800/40 bg-[#10241f]/90 shadow-[0_20px_45px_-30px_rgba(0,0,0,0.8)]"><CardHeader><CardTitle>Postojeće uplate</CardTitle></CardHeader><CardContent className="p-4 md:p-6">{payments.length ? <div className="space-y-3">{payments.map((payment) => <div key={payment.id} className="flex flex-col gap-3 rounded-[22px] border border-emerald-800/30 bg-[#0d201c] p-4 shadow-[0_18px_35px_-28px_rgba(0,0,0,0.8)] md:flex-row md:items-center md:justify-between"><div><p className="font-semibold text-emerald-50">{payment.member.firstName} {payment.member.lastName}</p><p className="text-sm text-emerald-100/70">{payment.paidAt.toLocaleDateString("sr-Latn-ME")}</p></div><div className="flex items-center justify-between gap-3 md:gap-6"><span className="text-sm font-medium text-emerald-100/75">{payment.method === "CASH" ? "Gotovina" : payment.method === "CARD" ? "Kartica" : "Transfer"}</span><strong className="text-base text-emerald-50">{Number(payment.amount).toFixed(2)} €</strong><div className="flex items-center gap-2"><Button asChild variant="outline" size="sm"><Link href={`/payments/${payment.id}/edit`}><Pencil className="size-4" />Uredi</Link></Button><DeleteButton action={deletePayment} field="paymentId" value={payment.id} /></div></div></div>)}</div> : <p className="text-sm text-emerald-100/70">Još nema uplata.</p>}</CardContent></Card></div>;
}
