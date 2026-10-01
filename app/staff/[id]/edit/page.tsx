import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateStaff } from "@/app/staff/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function parseFieldErrors(raw?: string) {
    if (!raw) return {};
    try {
        return JSON.parse(raw) as Record<string, string>;
    } catch {
        return {};
    }
}

export default async function EditStaffPage({ params, searchParams }: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ fieldErrors?: string }>;
}) {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    const [{ id }, { fieldErrors }] = await Promise.all([params, searchParams]);
    const staff = await db.adminUser.findUnique({
        where: { id },
        select: { id: true, name: true, email: true },
    });
    if (!staff) notFound();

    const errors = parseFieldErrors(fieldErrors);
    return (
        <div className="mx-auto max-w-3xl p-6 md:p-10">
            <PageHeader eyebrow="Administracija" title="Uredi zaposlenog" description="Izmijeni ime i email naloga zaposlenog." />
            <Card>
                <CardHeader><CardTitle>Podaci zaposlenog</CardTitle></CardHeader>
                <CardContent>
                    <form action={updateStaff} className="grid gap-5" noValidate>
                        <input type="hidden" name="staffId" value={staff.id} />
                        <Field label="Ime i prezime" error={errors.name}>
                            <Input name="name" defaultValue={staff.name} minLength={2} maxLength={100} required aria-invalid={Boolean(errors.name)} />
                        </Field>
                        <Field label="Email za prijavu" error={errors.email}>
                            <Input name="email" type="email" defaultValue={staff.email} required aria-invalid={Boolean(errors.email)} />
                        </Field>
                        <div className="flex gap-2">
                            <Button type="submit">Sačuvaj izmjene</Button>
                            <Button asChild variant="outline"><a href="/staff">Odustani</a></Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
    return <label className="grid gap-2 text-sm font-semibold"><span>{label}</span>{children}{error && <span className="text-xs font-medium text-red-600">{error}</span>}</label>;
}