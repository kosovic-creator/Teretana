import { createVisit } from "@/app/actions";
import { PageHeader } from "@/components/page-header";
import { getMembers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export default async function VisitsPage() { const members = await getMembers(); return <div className="mx-auto max-w-3xl p-6 md:p-10"><PageHeader eyebrow="Evidencija" title="Dolasci" description="Evidentiraj ulazak člana u teretanu." /><Card><CardHeader><CardTitle>Novi dolazak</CardTitle></CardHeader><CardContent><form action={createVisit} className="flex flex-col gap-4 sm:flex-row"><select name="memberId" required className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm"><option value="">Izaberi člana</option>{members.map((m) => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}</select><Button disabled={!members.length} type="submit">Evidentiraj dolazak</Button></form></CardContent></Card></div>; }
