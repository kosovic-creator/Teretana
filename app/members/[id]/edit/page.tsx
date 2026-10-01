import { notFound } from "next/navigation";
import { updateMember } from "@/app/actions";
import { getMember } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const member = await getMember(id);
    if (!member) notFound();
    return <div className="mx-auto max-w-3xl p-6 md:p-10"><PageHeader eyebrow="Baza članova" title="Uredi člana" description="Izmijeni podatke člana i datum isteka članarine." /><Card><CardHeader><CardTitle>Podaci člana</CardTitle></CardHeader><CardContent><form action={updateMember} className="grid gap-5 sm:grid-cols-2"><input type="hidden" name="memberId" value={member.id} /><Field label="Ime"><Input name="firstName" defaultValue={member.firstName} required minLength={2} /></Field><Field label="Prezime"><Input name="lastName" defaultValue={member.lastName} required minLength={2} /></Field><Field label="Email"><Input name="email" type="email" defaultValue={member.email ?? ""} /></Field><Field label="Telefon"><Input name="phone" defaultValue={member.phone ?? ""} /></Field><Field label="Plan"><select name="plan" defaultValue={member.plan} className="h-10 w-full rounded-lg border bg-background px-3 text-sm"><option value="MJESEČNO">Mjesečna</option><option value="TROMJESEČNO">Tromjesečna</option><option value="GODIŠNJE">Godišnja</option></select></Field><Field label="Članarina do"><Input name="expiresAt" type="date" defaultValue={member.expiresAt?.toISOString().slice(0, 10) ?? ""} /></Field><div className="flex gap-2 sm:col-span-2"><Button type="submit">Sačuvaj izmjene</Button><Button asChild variant="outline"><a href="/members">Odustani</a></Button></div></form></CardContent></Card></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-semibold"><span>{label}</span>{children}</label>; }