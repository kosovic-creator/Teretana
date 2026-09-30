"use client";

import { useActionState } from "react";
import { LoaderCircle, UserPlus } from "lucide-react";
import { Button } from "@puls/ui/components/button";
import { Input } from "@puls/ui/components/input";
import { createStaff, type CreateStaffState } from "../actions";

const initialState: CreateStaffState = {};

export function StaffForm() {
  const [state, action, pending] = useActionState(createStaff, initialState);

  return (
    <form action={action} className="grid gap-5">
      <label className="grid gap-2 text-sm font-semibold">
        Ime i prezime
        <Input name="name" autoComplete="name" minLength={2} maxLength={100} required />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Email za prijavu
        <Input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Lozinka
        <Input name="password" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Potvrdi lozinku
        <Input name="confirmPassword" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      {state.error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
        {pending ? "Kreiranje..." : "Kreiraj zaposlenog"}
      </Button>
    </form>
  );
}
