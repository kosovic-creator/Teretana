"use client";

import { Button } from "@/components/ui/button";

export function DeleteButton({ field, value, action }: { field: string; value: string; action: (formData: FormData) => void | Promise<void> }) {
    return <form action={action} onSubmit={(event) => { if (!window.confirm("Da li sigurno želiš obrisati ovaj zapis?")) event.preventDefault(); }}><input type="hidden" name={field} value={value} /><Button type="submit" variant="destructive" size="sm">Obriši</Button></form>;
}