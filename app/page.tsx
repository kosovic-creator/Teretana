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
  return <div className="mx-auto max-w-7xl p-4 md:p-8"><PageHeader eyebrow="Kontrolna tabla" title="Dobro došli u Hulk23" description="Pregled poslovanja tvoje teretane u realnom vremenu." />
    {!data.connected && <div className="mb-6 flex items-center gap-3 rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-[0_18px_30px_-25px_rgba(146,64,14,0.8)]"><AlertCircle className="size-5 text-amber-600" />Poveži PostgreSQL i pokreni migraciju da bi se prikazali stvarni podaci.</div>}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon }) => <Card key={label} className="rounded-[26px] border border-emerald-800/40 bg-[#10241f]/90 shadow-[0_20px_45px_-30px_rgba(0,0,0,0.8)]"><CardContent className="p-5"><span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600/20 via-emerald-500/10 to-amber-400/20 text-amber-300 shadow-inner"><Icon className="size-5" /></span><p className="mt-5 text-2xl font-extrabold text-emerald-50">{value}</p><p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-emerald-100/70">{label}</p></CardContent></Card>)}</div>
    <div className="mt-5 grid gap-5"><Card className="rounded-[26px] border border-emerald-800/40 bg-[#10241f]/90 shadow-[0_20px_45px_-30px_rgba(0,0,0,0.8)]"><CardHeader><CardTitle>Članarine koje ističu</CardTitle></CardHeader><CardContent>{expiring ? <p className="text-4xl font-extrabold text-amber-300">{expiring}</p> : <p className="text-sm text-emerald-100/70">Nema članarina koje ističu u narednih 7 dana.</p>}</CardContent></Card><Card className="rounded-[26px] border border-emerald-800/40 bg-[#10241f]/90 shadow-[0_20px_45px_-30px_rgba(0,0,0,0.8)]"><CardHeader><CardTitle>Posljednje uplate</CardTitle></CardHeader><CardContent className="space-y-4">{data.recentPayments.length ? data.recentPayments.map((payment) => <div key={payment.id} className="flex items-center justify-between rounded-2xl border border-emerald-800/30 bg-[#0d201c] px-3 py-3 text-sm"><span className="text-emerald-100/80">{payment.member.firstName} {payment.member.lastName}</span><strong className="text-emerald-50">{money.format(Number(payment.amount))}</strong></div>) : <p className="text-sm text-emerald-100/70">Još nema evidentiranih uplata.</p>}</CardContent></Card></div>
  </div>;
}
