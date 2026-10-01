import Link from "next/link";
import { Pencil, Plus, Users } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <PageHeader
        eyebrow="Baza članova"
        title="Članovi"
        description={`${members.length} članova u evidenciji.`}
        action={
          <Button asChild>
            <Link href="/members/new">
              <Plus className="size-4" />
              Dodaj člana
            </Link>
          </Button>
        }
      />

      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardContent className="p-4 md:p-6">
          {members.length ? (
            <div className="space-y-3">
              {members.map((member) => {
                const active = isMembershipActive(member.expiresAt);

                return (
                  <div
                    key={member.id}
                    className="flex flex-col gap-3 rounded-2xl border bg-muted/30 p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-full bg-[#0f2d2a] font-semibold text-emerald-50">
                        {(member.firstName?.[0] ?? "").toUpperCase()}
                        {(member.lastName?.[0] ?? "").toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-semibold text-emerald-50">
                          {member.firstName} {member.lastName}
                        </h3>
                        <p className="text-sm text-emerald-100/70">
                          {member.email ?? member.phone ?? "Bez kontakta"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-sm text-emerald-100/70 md:items-end">
                      <div>
                        <span className="font-medium text-emerald-50">Plan:</span> {member.plan}
                      </div>
                      <div>
                        <span className="font-medium text-emerald-50">Članarina do:</span>{" "}
                        {member.expiresAt?.toLocaleDateString("sr-Latn-ME") ?? "—"}
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between md:items-end">
                      <Badge
                        className={
                          active ? "border-emerald-600/40 bg-emerald-900/60 text-emerald-100" : "border-red-700/40 bg-red-950/50 text-red-100"
                        }
                      >
                        {active ? "Aktivna" : "Istekla"}
                      </Badge>

                      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/members/${member.id}/edit`}>
                            <Pencil className="size-4" />
                            Uredi
                          </Link>
                        </Button>

                        <DeleteButton
                          action={deleteMember}
                          field="memberId"
                          value={member.id}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid place-items-center px-6 py-20 text-center">
              <Users className="mb-4 size-10 text-muted-foreground" />
              <h2 className="font-bold">Još nema članova</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Dodaj prvog člana nakon povezivanja baze.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
