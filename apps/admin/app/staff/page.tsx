import Link from "next/link";
import { Plus, UserRoundCog } from "lucide-react";
import { auth } from "@/auth";
import { PageHeader } from "@/components/page-header";
import { db } from "@puls/database";
import { Button } from "@puls/ui/components/button";
import { Card, CardContent } from "@puls/ui/components/card";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StaffPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

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
      {params.created === "1" && (
        <p role="status" className="mb-5 rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-800">
          Nalog je kreiran. Zaposleni se može prijaviti svojim emailom i lozinkom.
        </p>
      )}
      <Card>
        <CardContent className="p-0">
          {staff.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr><th className="px-5 py-4">Zaposleni</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Dodat</th></tr>
                </thead>
                <tbody>
                  {staff.map((person) => (
                    <tr key={person.id} className="border-t">
                      <td className="px-5 py-4 font-semibold">{person.name}</td>
                      <td className="px-5 py-4">{person.email}</td>
                      <td className="px-5 py-4 text-muted-foreground">{person.createdAt.toLocaleDateString("sr-Latn-ME")}</td>
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
