import { PageHeader } from "@/components/page-header";
import { PaymentForm } from "@/components/payment-form";
import { getMembers } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deletePayment } from "@/app/actions";
import Link from "next/link";
import { getPayments } from "@/lib/data";
import { DeleteButton } from "@/components/delete-button";

export const dynamic = "force-dynamic";
export default async function PaymentsPage() {
  const members = await getMembers();
  const payments = await getPayments();
  const memberOptions = members.map((member) => ({
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    plan: member.plan,
    expiresAt: member.expiresAt?.toISOString().slice(0, 10) ?? null,
  }));

  return <div className="mx-auto max-w-7xl p-6 md:p-10"><PageHeader eyebrow="Finansije" title="Uplate" description="Dodaj, pregledaj i uređuj uplate članova." /><Card><CardHeader><CardTitle>Nova uplata</CardTitle></CardHeader><CardContent>{members.length ? <PaymentForm members={memberOptions} /> : <p className="text-sm text-muted-foreground">Prvo dodaj člana na stranici Članovi.</p>}</CardContent></Card><Card className="mt-6"><CardHeader><CardTitle>Postojeće uplate</CardTitle></CardHeader><CardContent className="p-0">{payments.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="px-5 py-4">Datum</th><th className="px-5 py-4">Član</th><th className="px-5 py-4">Iznos</th><th className="px-5 py-4">Način</th><th className="px-5 py-4">Akcije</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id} className="border-t"><td className="px-5 py-4">{payment.paidAt.toLocaleDateString("sr-Latn-ME")}</td><td className="px-5 py-4">{payment.member.firstName} {payment.member.lastName}</td><td className="px-5 py-4">{Number(payment.amount).toFixed(2)} €</td><td className="px-5 py-4">{payment.method === "CASH" ? "Gotovina" : payment.method === "CARD" ? "Kartica" : "Transfer"}</td><td className="px-5 py-4"><div className="flex items-center gap-2"><Button asChild variant="outline" size="sm"><Link href={`/payments/${payment.id}/edit`}>Uredi</Link></Button><DeleteButton action={deletePayment} field="paymentId" value={payment.id} /></div></td></tr>)}</tbody></table></div> : <p className="p-6 text-sm text-muted-foreground">Još nema uplata.</p>}</CardContent></Card></div>;
}
