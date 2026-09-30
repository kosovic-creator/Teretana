import { Button } from "@hulk23/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@hulk23/ui/components/card";
import { Input } from "@hulk23/ui/components/input";
import { PageHeader } from "@/components/page-header";
import { createMember } from "@/app/actions";

export default function NewMemberPage() {
  return <div className="mx-auto max-w-3xl p-6 md:p-10"><PageHeader eyebrow="Baza članova" title="Novi član" description="Unesi osnovne podatke i početnu članarinu." /><Card><CardHeader><CardTitle>Podaci člana</CardTitle></CardHeader><CardContent><form action={createMember} className="grid gap-5 sm:grid-cols-2"><Field label="Ime"><Input name="firstName" required minLength={2} /></Field><Field label="Prezime"><Input name="lastName" required minLength={2} /></Field><Field label="Email"><Input name="email" type="email" /></Field><Field label="Telefon"><Input name="phone" /></Field><Field label="Plan"><select name="plan" className="h-10 w-full rounded-lg border bg-background px-3 text-sm"><option value="MJESEČNO">Mjesečna</option><option value="TROMJESEČNO">Tromjesečna</option><option value="GODIŠNJE">Godišnja</option></select></Field><Field label="Članarina do"><Input name="expiresAt" type="date" /></Field><div className="sm:col-span-2"><Button type="submit">Sačuvaj člana</Button></div></form></CardContent></Card></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-semibold"><span>{label}</span>{children}</label>; }
