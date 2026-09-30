import { createPayment } from "@/app/actions";
import { PageHeader } from "@/components/page-header";
import { getMembers } from "@/lib/data";
import { Button } from "@puls/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@puls/ui/components/card";
import { Input } from "@puls/ui/components/input";

export const dynamic = "force-dynamic";
export default async function PaymentsPage() { const members = await getMembers(); return <div className="mx-auto max-w-4xl p-6 md:p-10"><PageHeader eyebrow="Finansije" title="Nova uplata" description="Evidentiraj uplatu i po potrebi produži članarinu." /><Card><CardHeader><CardTitle>Podaci o uplati</CardTitle></CardHeader><CardContent><form action={createPayment} className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-semibold sm:col-span-2">Član<select name="memberId" required className="h-10 rounded-lg border bg-background px-3"><option value="">Izaberi člana</option>{members.map((m) => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold">Iznos (€)<Input name="amount" type="number" min="0.01" step="0.01" defaultValue="30" required /></label><label className="grid gap-2 text-sm font-semibold">Način plaćanja<select name="method" className="h-10 rounded-lg border bg-background px-3"><option value="CASH">Gotovina</option><option value="CARD">Kartica</option><option value="TRANSFER">Transfer</option></select></label><label className="grid gap-2 text-sm font-semibold">Članarina do<Input name="expiresAt" type="date" /></label><div className="self-end"><Button disabled={!members.length} type="submit">Sačuvaj uplatu</Button></div></form></CardContent></Card></div>; }
