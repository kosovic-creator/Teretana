"use client";

import { useState, useTransition } from "react";
import { checkOutVisit, createVisit } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AttendanceMember = {
    id: string;
    firstName: string;
    lastName: string;
    expiresAt: Date | null;
};

type AttendanceVisit = {
    id: string;
    memberId: string;
    checkedIn: Date;
    member: AttendanceMember;
};

export function VisitsAttendance({ members, initialVisits }: { members: AttendanceMember[]; initialVisits: AttendanceVisit[] }) {
    const [activeVisits, setActiveVisits] = useState(initialVisits);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();
    const activeMemberIds = new Set(activeVisits.map((visit) => visit.memberId));
    const availableMembers = members.filter((member) => !activeMemberIds.has(member.id));

    function handleCheckIn(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        startTransition(async () => {
            try {
                const result = await createVisit(selectedMemberId);
                if (!result.success) {
                    setError(result.message);
                    return;
                }
                setActiveVisits((visits) => [result.visit, ...visits]);
                setSelectedMemberId("");
            } catch {
                setError("Dolazak nije sačuvan. Pokušaj ponovo.");
            }
        });
    }

    function handleCheckOut(visitId: string) {
        setError("");
        startTransition(async () => {
            try {
                const result = await checkOutVisit(visitId);
                if (!result.success) {
                    setError(result.message);
                    return;
                }
                setActiveVisits((visits) => visits.filter((visit) => visit.id !== visitId));
            } catch {
                setError("Izlazak nije sačuvan. Pokušaj ponovo.");
            }
        });
    }

    return (
        <>
            <Card className="mb-5 rounded-2xl border bg-card shadow-sm">
                <CardHeader><CardTitle>Novi dolazak</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleCheckIn} className="flex flex-col gap-3 sm:flex-row">
                        <select
                            name="memberId"
                            required
                            value={selectedMemberId}
                            onChange={(event) => setSelectedMemberId(event.target.value)}
                            className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm"
                        >
                            <option value="">Izaberi člana</option>
                            {availableMembers.map((member) => (
                                <option key={member.id} value={member.id}>{member.firstName} {member.lastName}</option>
                            ))}
                        </select>
                        <Button disabled={!selectedMemberId || isPending} type="submit">
                            {isPending ? "Sačekaj..." : "Evidentiraj dolazak"}
                        </Button>
                    </form>
                    {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
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
                                                <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={() => handleCheckOut(visit.id)}>
                                                    Evidentiraj izlazak
                                                </Button>
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
        </>
    );
}