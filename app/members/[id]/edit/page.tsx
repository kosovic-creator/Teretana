import { notFound } from "next/navigation";
import { updateMember } from "@/app/actions";
import { getMember } from "@/lib/data";
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

export default async function EditMemberPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; fieldErrors?: string }> }) {
    const { id } = await params;
    const { error, fieldErrors } = await searchParams;
    const parsedFieldErrors = parseFieldErrors(fieldErrors);
    const member = await getMember(id);
    if (!member) notFound();
    return <div className="mx-auto max-w-3xl p-6 md:p-10"><PageHeader eyebrow="Baza članova" title="Uredi člana" description="Izmijeni podatke člana i datum isteka članarine." /><Card><CardHeader><CardTitle>Podaci člana</CardTitle></CardHeader><CardContent><form action={updateMember} className="grid gap-5 sm:grid-cols-2" noValidate><input type="hidden" name="memberId" value={member.id} /><Field label="Ime" error={parsedFieldErrors.firstName}><Input name="firstName" defaultValue={member.firstName} required minLength={2} aria-invalid={Boolean(parsedFieldErrors.firstName)} /></Field><Field label="Prezime" error={parsedFieldErrors.lastName}><Input name="lastName" defaultValue={member.lastName} required minLength={2} aria-invalid={Boolean(parsedFieldErrors.lastName)} /></Field><Field label="Email" error={parsedFieldErrors.email}><Input name="email" type="email" defaultValue={member.email ?? ""} aria-invalid={Boolean(parsedFieldErrors.email)} /></Field><Field label="Telefon" error={parsedFieldErrors.phone}><Input name="phone" defaultValue={member.phone ?? ""} aria-invalid={Boolean(parsedFieldErrors.phone)} /></Field><Field label="Plan" error={parsedFieldErrors.plan}><select name="plan" defaultValue={member.plan} className="h-10 w-full rounded-lg border bg-background px-3 text-sm" aria-invalid={Boolean(parsedFieldErrors.plan)}><option value="MJESEČNO">Mjesečna</option><option value="TROMJESEČNO">Tromjesečna</option><option value="GODIŠNJE">Godišnja</option></select></Field><Field label="Članarina do" error={parsedFieldErrors.expiresAt}><Input name="expiresAt" type="date" defaultValue={member.expiresAt?.toISOString().slice(0, 10) ?? ""} aria-invalid={Boolean(parsedFieldErrors.expiresAt)} /></Field><div className="flex gap-2 sm:col-span-2"><Button type="submit">Sačuvaj izmjene</Button><Button asChild variant="outline"><a href="/members">Odustani</a></Button></div></form></CardContent></Card></div>;
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) { return <label className="grid gap-2 text-sm font-semibold"><span>{label}</span>{children}{error && <span className="text-xs font-medium text-red-600">{error}</span>}</label>; }