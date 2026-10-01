import { checkOutVisit, createVisit } from "@/app/actions";
import { PageHeader } from "@/components/page-header";
import { getActiveVisits, getMembers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export default async function VisitsPage() {
    const [members, activeVisits] = await Promise.all([getMembers(), getActiveVisits()]);
    const activeMemberIds = new Set(activeVisits.map((visit) => visit.memberId));

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-8">
            <PageHeader eyebrow="Evidencija" title="Dolasci" description="Evidentiraj ulazak i prati članove koji su trenutno u teretani." />
            <Card className="mb-5 rounded-2xl border bg-card shadow-sm">
                <CardHeader><CardTitle>Novi dolazak</CardTitle></CardHeader>
                <CardContent>
                    <form action={createVisit} className="flex flex-col gap-3 sm:flex-row">
                        <select name="memberId" required className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm">
                            <option value="">Izaberi člana</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id} disabled={activeMemberIds.has(member.id)}>
                                    {member.firstName} {member.lastName}{activeMemberIds.has(member.id) ? " (već prisutan)" : ""}
                                </option>
                            ))}
                        </select>
                        <Button disabled={!members.some((member) => !activeMemberIds.has(member.id))} type="submit">Evidentiraj dolazak</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border bg-card shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between gap-3">
                    <CardTitle>Trenutno prisutni</CardTitle>
                    <span className="rounded-full border border-emerald-700/40 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-200">{activeVisits.length}</span>
                </CardHeader>
                <CardContent className="p-0">
                    {activeVisits.length ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[560px] text-left text-sm">
                                <thead className="border-y border-emerald-900/40 bg-black/10 text-xs uppercase text-emerald-100/60">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Član</th>
                                        <th className="px-6 py-3 font-semibold">Članarina važi do</th>
                                        <th className="px-6 py-3 font-semibold">Vrijeme ulaska</th>
                                        <th className="px-6 py-3 text-right font-semibold">Akcija</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-900/30">
                                    {activeVisits.map((visit) => (
                                        <tr key={visit.id}>
                                            <td className="px-6 py-4 font-semibold text-emerald-50">{visit.member.firstName} {visit.member.lastName}</td>
                                            <td className="px-6 py-4 text-emerald-100/70">{visit.member.expiresAt ? visit.member.expiresAt.toLocaleDateString("sr-Latn-ME") : "Bez roka"}</td>
                                            <td className="px-6 py-4 text-emerald-100/70">{visit.checkedIn.toLocaleTimeString("sr-Latn-ME", { hour: "2-digit", minute: "2-digit" })}</td>
                                            <td className="px-6 py-4 text-right">
                                                <form action={checkOutVisit}>
                                                    <input type="hidden" name="visitId" value={visit.id} />
                                                    <Button type="submit" size="sm" variant="outline">Evidentiraj izlazak</Button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="px-6 py-10 text-center text-sm text-emerald-100/70">Trenutno nema evidentiranih prisutnih članova.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
