import { PageHeader } from "@/components/page-header";
import { getActiveVisits, getMembers } from "@/lib/data";
import { VisitsAttendance } from "@/app/visits/visits-attendance";

export const dynamic = "force-dynamic";
export default async function VisitsPage() {
    const [members, activeVisits] = await Promise.all([getMembers(), getActiveVisits()]);

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-8">
            <PageHeader eyebrow="Evidencija" title="Dolasci" description="Evidentiraj ulazak i prati članove koji su trenutno u teretani." />
            <VisitsAttendance members={members} initialVisits={activeVisits} />
        </div>
    );
}
