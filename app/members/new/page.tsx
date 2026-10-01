import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { createMember } from "@/app/actions";

function parseFieldErrors(raw?: string) {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export default async function NewMemberPage({ searchParams }: { searchParams: Promise<{ error?: string; fieldErrors?: string }> }) {
  const { error, fieldErrors } = await searchParams;
  const parsedFieldErrors = parseFieldErrors(fieldErrors);

  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10">
      <PageHeader eyebrow="Baza članova" title="Novi član" description="Unesi osnovne podatke i početnu članarinu." />
      <Card>
        <CardHeader><CardTitle>Podaci člana</CardTitle></CardHeader>
        <CardContent>
          <form action={createMember} className="grid gap-5" noValidate>
            <Field label="Ime" error={parsedFieldErrors.firstName}><Input name="firstName" required minLength={2} aria-invalid={Boolean(parsedFieldErrors.firstName)} /></Field>
            <Field label="Prezime" error={parsedFieldErrors.lastName}><Input name="lastName" required minLength={2} aria-invalid={Boolean(parsedFieldErrors.lastName)} /></Field>
            <Field label="Email" error={parsedFieldErrors.email}><Input name="email" type="email" aria-invalid={Boolean(parsedFieldErrors.email)} /></Field>
            <Field label="Telefon" error={parsedFieldErrors.phone}><Input name="phone" aria-invalid={Boolean(parsedFieldErrors.phone)} /></Field>
            <Field label="Plan" error={parsedFieldErrors.plan}><select name="plan" className="h-10 w-full rounded-lg border bg-background px-3 text-sm" aria-invalid={Boolean(parsedFieldErrors.plan)}><option value="MJESEČNO">Mjesečna</option><option value="TROMJESEČNO">Tromjesečna</option><option value="GODIŠNJE">Godišnja</option></select></Field>
            <Field label="Članarina do" error={parsedFieldErrors.expiresAt}><Input name="expiresAt" type="date" aria-invalid={Boolean(parsedFieldErrors.expiresAt)} /></Field>
            <div className="flex flex-wrap gap-2">
              <Button type="submit">Sačuvaj člana</Button>
              <Button asChild variant="outline"><a href="/members"><X className="size-4" />Odustani</a></Button>
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
