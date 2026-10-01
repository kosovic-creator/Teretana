import { notFound } from "next/navigation";
import { updatePayment } from "@/app/actions";
import { getMembers, getPayment } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

function parseFieldErrors(raw?: string) {
    if (!raw) return {};
    try {
        return JSON.parse(raw) as Record<string, string>;
    } catch {
        return {};
    }
}

export default async function EditPaymentPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; fieldErrors?: string }> }) {
    const { id } = await params;
    const { error, fieldErrors } = await searchParams;
    const [payment, members] = await Promise.all([getPayment(id), getMembers()]);
    if (!payment) notFound();
    const parsedFieldErrors = parseFieldErrors(fieldErrors);
    return <div className="mx-auto max-w-3xl p-6 md:p-10"><PageHeader eyebrow="Finansije" title="Uredi uplatu" description="Izmijeni člana, iznos, datum ili način plaćanja." /><Card><CardHeader><CardTitle>Podaci o uplati</CardTitle></CardHeader><CardContent><form action={updatePayment} className="grid gap-5"><input type="hidden" name="paymentId" value={payment.id} /><label className="grid gap-2 text-sm font-semibold">Član<select name="memberId" defaultValue={payment.memberId} required aria-invalid={Boolean(parsedFieldErrors.memberId)} className="h-10 rounded-lg border bg-background px-3"><option value="">Izaberi člana</option>{members.map((member) => <option key={member.id} value={member.id}>{member.firstName} {member.lastName}</option>)}</select>{parsedFieldErrors.memberId && <span className="text-xs font-medium text-red-600">{parsedFieldErrors.memberId}</span>}</label><label className="grid gap-2 text-sm font-semibold">Iznos (€)<Input name="amount" type="number" min="0.01" step="0.01" defaultValue={Number(payment.amount)} required aria-invalid={Boolean(parsedFieldErrors.amount)} />{parsedFieldErrors.amount && <span className="text-xs font-medium text-red-600">{parsedFieldErrors.amount}</span>}</label><label className="grid gap-2 text-sm font-semibold">Način plaćanja<select name="method" defaultValue={payment.method} aria-invalid={Boolean(parsedFieldErrors.method)} className="h-10 rounded-lg border bg-background px-3"><option value="CASH">Gotovina</option><option value="CARD">Kartica</option><option value="TRANSFER">Transfer</option></select>{parsedFieldErrors.method && <span className="text-xs font-medium text-red-600">{parsedFieldErrors.method}</span>}</label><label className="grid gap-2 text-sm font-semibold">Datum uplate<Input name="paidAt" type="date" defaultValue={payment.paidAt.toISOString().slice(0, 10)} required aria-invalid={Boolean(parsedFieldErrors.paidAt)} />{parsedFieldErrors.paidAt && <span className="text-xs font-medium text-red-600">{parsedFieldErrors.paidAt}</span>}</label><label className="grid gap-2 text-sm font-semibold">Članarina važi do<Input name="expiresAt" type="date" defaultValue={payment.member.expiresAt?.toISOString().slice(0, 10) ?? ""} required aria-invalid={Boolean(parsedFieldErrors.expiresAt)} />{parsedFieldErrors.expiresAt && <span className="text-xs font-medium text-red-600">{parsedFieldErrors.expiresAt}</span>}</label><div className="flex gap-2 sm:col-span-2"><Button type="submit">Sačuvaj izmjene</Button><Button asChild variant="outline"><a href="/payments">Odustani</a></Button></div></form></CardContent></Card></div>;
}