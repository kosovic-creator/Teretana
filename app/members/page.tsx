import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { deleteMember } from "@/app/actions";
import { DeleteButton } from "@/components/delete-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { getMembers, isMembershipActive } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await getMembers();
  return <div className="mx-auto max-w-7xl p-6 md:p-10"><PageHeader eyebrow="Baza članova" title="Članovi" description={`${members.length} članova u evidenciji.`} action={<Button asChild><Link href="/members/new"><Plus className="size-4" />Dodaj člana</Link></Button>} />
    <Card><CardContent className="p-0">{members.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="px-5 py-4">Član</th><th className="px-5 py-4">Plan</th><th className="px-5 py-4">Članarina do</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Akcije</th></tr></thead><tbody>{members.map((member) => { const active = isMembershipActive(member.expiresAt); return <tr key={member.id} className="border-t"><td className="px-5 py-4"><strong>{member.firstName} {member.lastName}</strong><span className="block text-xs text-muted-foreground">{member.email ?? member.phone ?? "Bez kontakta"}</span></td><td className="px-5 py-4">{member.plan}</td><td className="px-5 py-4">{member.expiresAt?.toLocaleDateString("sr-Latn-ME") ?? "—"}</td><td className="px-5 py-4"><Badge className={active ? "bg-green-100 text-green-800" : "bg-red-50 text-red-700"}>{active ? "Aktivna" : "Istekla"}</Badge></td><td className="px-5 py-4"><div className="flex items-center gap-2"><Button asChild variant="outline" size="sm"><Link href={`/members/${member.id}/edit`}>Uredi</Link></Button><DeleteButton action={deleteMember} field="memberId" value={member.id} /></div></td></tr>; })}</tbody></table></div> : <div className="grid place-items-center px-6 py-20 text-center"><Users className="mb-4 size-10 text-muted-foreground" /><h2 className="font-bold">Još nema članova</h2><p className="mt-2 text-sm text-muted-foreground">Dodaj prvog člana nakon povezivanja baze.</p></div>}</CardContent></Card>
  </div>;
}
