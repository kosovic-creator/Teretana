"use client";

import { useActionState } from "react";
import { LoaderCircle, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createStaff, type CreateStaffState } from "../actions";

const initialState: CreateStaffState = {};

export function StaffForm() {
  const [state, action, pending] = useActionState(createStaff, initialState);

  return (
    <form action={action} className="grid gap-5" noValidate>
      <label className="grid gap-2 text-sm font-semibold">
        Ime i prezime
        <Input
          name="name"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
          aria-invalid={Boolean(state.fieldErrors?.name)}
        />
        {state.fieldErrors?.name && <span className="text-xs font-medium text-red-600">{state.fieldErrors.name}</span>}
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Email za prijavu
        <Input
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
        {state.fieldErrors?.email && <span className="text-xs font-medium text-red-600">{state.fieldErrors.email}</span>}
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Lozinka
        <Input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        {state.fieldErrors?.password && <span className="text-xs font-medium text-red-600">{state.fieldErrors.password}</span>}
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Potvrdi lozinku
        <Input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
        />
        {state.fieldErrors?.confirmPassword && <span className="text-xs font-medium text-red-600">{state.fieldErrors.confirmPassword}</span>}
      </label>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
          {pending ? "Kreiranje..." : "Kreiraj zaposlenog"}
        </Button>
        <Button asChild variant="outline" type="button">
          <a href="/staff"><X className="size-4" />Odustani</a>
        </Button>
      </div>
    </form>
  );
}
