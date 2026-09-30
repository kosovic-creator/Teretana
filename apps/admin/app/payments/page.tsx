import { PageHeader } from "@/components/page-header";
import { PaymentForm } from "@/components/payment-form";
import { getMembers } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@puls/ui/components/card";

export const dynamic = "force-dynamic";
export default async function PaymentsPage() {
  const members = await getMembers();
  const memberOptions = members.map((member) => ({
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    plan: member.plan,
    expiresAt: member.expiresAt?.toISOString().slice(0, 10) ?? null,
  }));

  return <div className="mx-auto max-w-4xl p-6 md:p-10"><PageHeader eyebrow="Finansije" title="Nova uplata" description="Izaberi člana, provjeri trenutni period i produži članarinu." /><Card><CardHeader><CardTitle>Podaci o uplati</CardTitle></CardHeader><CardContent>{members.length ? <PaymentForm members={memberOptions} /> : <p className="text-sm text-muted-foreground">Prvo dodaj člana na stranici Članovi.</p>}</CardContent></Card></div>;
}
