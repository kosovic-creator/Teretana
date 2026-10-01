import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CreditCard, ScanLine, UserCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getDashboardData, isMembershipActive } from "@/lib/data";

export const dynamic = "force-dynamic";
const money = new Intl.NumberFormat("sr-Latn-ME", { style: "currency", currency: "EUR" });

export default async function DashboardPage() {
  const data = await getDashboardData();
  const now = new Date();
  const active = data.members.filter((member) => isMembershipActive(member.expiresAt, now)).length;
  const expiring = data.members.filter((member) => {
    if (!member.expiresAt) return false;
    return member.expiresAt.getTime() >= now.getTime() && member.expiresAt.getTime() <= now.getTime() + 7 * 86400000;
  }).length;
  const stats = [
    { label: "Aktivnih članova", value: active, icon: UserCheck },
    { label: "Ukupno članova", value: data.members.length, icon: Users },
    { label: "Uplate ovog mjeseca", value: money.format(data.income), icon: CreditCard },
    { label: "Dolazaka danas", value: data.visitsToday, icon: ScanLine },
  ];
  return <div className="mx-auto max-w-7xl p-6 md:p-10"><PageHeader eyebrow="Kontrolna tabla" title="Dobro došli u Hulk23" description="Pregled poslovanja tvoje teretane u realnom vremenu." />
    {!data.connected && <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertCircle className="size-5" />Poveži PostgreSQL i pokreni migraciju da bi se prikazali stvarni podaci.</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="p-5"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-green-700"><Icon className="size-5" /></span><p className="mt-5 text-2xl font-extrabold">{value}</p><p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p></CardContent></Card>)}</div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]"><Card><CardHeader><CardTitle>Članarine koje ističu</CardTitle></CardHeader><CardContent>{expiring ? <p className="text-4xl font-extrabold text-amber-600">{expiring}</p> : <p className="text-sm text-muted-foreground">Nema članarina koje ističu u narednih 7 dana.</p>}</CardContent></Card><Card><CardHeader><CardTitle>Posljednje uplate</CardTitle></CardHeader><CardContent className="space-y-4">{data.recentPayments.length ? data.recentPayments.map((payment) => <div key={payment.id} className="flex justify-between border-b pb-3 text-sm last:border-0"><span>{payment.member.firstName} {payment.member.lastName}</span><strong>{money.format(Number(payment.amount))}</strong></div>) : <p className="text-sm text-muted-foreground">Još nema evidentiranih uplata.</p>}</CardContent></Card></div>
  </div>;
}
