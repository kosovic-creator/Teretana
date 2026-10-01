import Link from "next/link";
import { Pencil, Plus, UserRoundCog } from "lucide-react";
import { auth } from "@/auth";
import { deleteStaff } from "@/app/staff/actions";
import { DeleteButton } from "@/components/delete-button";
import { PageHeader } from "@/components/page-header";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StaffPage({ searchParams }: { searchParams: Promise<{ created?: string; updated?: string; deleted?: string; error?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const currentEmail = session.user?.email;

  const [staff, params] = await Promise.all([
    db.adminUser.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    searchParams,
  ]);

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <PageHeader
        eyebrow="Administracija"
        title="Zaposleni"
        description={`${staff.length} naloga s pristupom administraciji.`}
        action={<Button asChild><Link href="/staff/new"><Plus className="size-4" />Dodaj zaposlenog</Link></Button>}
      />
      {(params.created === "1" || params.updated === "1" || params.deleted === "1") && (
        <p role="status" className="mb-5 rounded-2xl bg-green-100 px-4 py-3 text-sm font-medium text-green-800 shadow-sm">
          {params.created === "1" ? "Nalog je kreiran. Zaposleni se može prijaviti svojim emailom i lozinkom." : params.updated === "1" ? "Podaci zaposlenog su sačuvani." : "Nalog zaposlenog je obrisan."}
        </p>
      )}
      {params.error === "self-delete" && <p role="alert" className="mb-5 rounded-2xl bg-red-100 px-4 py-3 text-sm font-medium text-red-800 shadow-sm">Ne možeš obrisati aktivni nalog.</p>}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardContent className="p-4 md:p-6">
          {staff.length ? (
            <div className="space-y-3">
              {staff.map((person) => (
                <div key={person.id} className="flex flex-col gap-3 rounded-2xl border bg-muted/30 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.email}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 md:gap-4">
                    <span className="text-sm text-muted-foreground">{person.createdAt.toLocaleDateString("sr-Latn-ME")}</span>
                    {person.email === currentEmail ? (
                      <span className="text-xs text-muted-foreground">Aktivni nalog</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/staff/${person.id}/edit`}><Pencil className="size-4" />Uredi</Link>
                        </Button>
                        <DeleteButton field="staffId" value={person.id} action={deleteStaff} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid place-items-center px-6 py-20 text-center">
              <UserRoundCog className="mb-4 size-10 text-muted-foreground" />
              <h2 className="font-bold">Još nema zaposlenih</h2>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
