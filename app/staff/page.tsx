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
    <div className="mx-auto max-w-7xl p-6 md:p-10">
      <PageHeader
        eyebrow="Administracija"
        title="Zaposleni"
        description={`${staff.length} naloga s pristupom administraciji.`}
        action={<Button asChild><Link href="/staff/new"><Plus className="size-4" />Dodaj zaposlenog</Link></Button>}
      />
      {(params.created === "1" || params.updated === "1" || params.deleted === "1") && (
        <p role="status" className="mb-5 rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-800">
          {params.created === "1" ? "Nalog je kreiran. Zaposleni se može prijaviti svojim emailom i lozinkom." : params.updated === "1" ? "Podaci zaposlenog su sačuvani." : "Nalog zaposlenog je obrisan."}
        </p>
      )}
      {params.error === "self-delete" && <p role="alert" className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">Ne možeš obrisati aktivni nalog.</p>}
      <Card>
        <CardContent className="p-0">
          {staff.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr><th className="px-5 py-4">Zaposleni</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Dodat</th><th className="px-5 py-4">Akcije</th></tr>
                </thead>
                <tbody>
                  {staff.map((person) => (
                    <tr key={person.id} className="border-t">
                      <td className="px-5 py-4 font-semibold">{person.name}</td>
                      <td className="px-5 py-4">{person.email}</td>
                      <td className="px-5 py-4 text-muted-foreground">{person.createdAt.toLocaleDateString("sr-Latn-ME")}</td>
                      <td className="px-5 py-4">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
