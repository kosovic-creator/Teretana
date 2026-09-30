import { Card, CardContent, CardHeader, CardTitle } from "@puls/ui/components/card";
import { PageHeader } from "@/components/page-header";
import { StaffForm } from "./staff-form";

export default function NewStaffPage() {
  return (
    <div className="mx-auto max-w-3xl p-6 md:p-10">
      <PageHeader
        eyebrow="Administracija"
        title="Novi zaposleni"
        description="Kreiraj nalog za zaposlenog koji će se prijavljivati u administraciju."
      />
      <Card>
        <CardHeader><CardTitle>Podaci zaposlenog</CardTitle></CardHeader>
        <CardContent><StaffForm /></CardContent>
      </Card>
    </div>
  );
}
