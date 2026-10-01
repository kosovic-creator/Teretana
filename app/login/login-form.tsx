"use client";

import { useActionState } from "react";
import { LoaderCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "./actions";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [error, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="grid gap-2 text-sm font-semibold">Email<Input name="email" type="email" autoComplete="email" required autoFocus /></label>
      <label className="grid gap-2 text-sm font-semibold">Lozinka<Input name="password" type="password" autoComplete="current-password" required /></label>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <Button type="submit" size="lg" disabled={pending}>{pending ? <LoaderCircle className="size-4 animate-spin" /> : <LogIn className="size-4" />}{pending ? "Prijavljivanje..." : "Prijavi se"}</Button>
    </form>
  );
}
