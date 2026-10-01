"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CreditCard, UserRound } from "lucide-react";
import { createPayment } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Plan = "MJESEČNO" | "TROMJESEČNO" | "GODIŠNJE";
type MemberOption = {
  id: string;
  firstName: string;
  lastName: string;
  plan: Plan;
  expiresAt: string | null;
};

const planDetails: Record<Plan, { label: string; months: number; amount: number }> = {
  MJESEČNO: { label: "Mjesečna", months: 1, amount: 30 },
  TROMJESEČNO: { label: "Tromjesečna", months: 3, amount: 80 },
  GODIŠNJE: { label: "Godišnja", months: 12, amount: 280 },
};

const today = () => {
  const value = new Date();
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};

function addMonths(value: string, months: number) {
  const [year, month, day] = value.split("-").map(Number);
  const lastDay = new Date(year, month - 1 + months + 1, 0).getDate();
  const result = new Date(year, month - 1 + months, Math.min(day, lastDay));
  return `${result.getFullYear()}-${String(result.getMonth() + 1).padStart(2, "0")}-${String(result.getDate()).padStart(2, "0")}`;
}

function formatDate(value: string | null) {
  if (!value) return "Nije određeno";
  return new Intl.DateTimeFormat("sr-Latn-ME", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export function PaymentForm({ members }: { members: MemberOption[] }) {
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("30");
  const [expiresAt, setExpiresAt] = useState("");
  const selectedMember = useMemo(() => members.find((member) => member.id === memberId), [memberId, members]);

  function selectMember(id: string) {
    setMemberId(id);
    const member = members.find((item) => item.id === id);
    if (!member) {
      setExpiresAt("");
      return;
    }
    const details = planDetails[member.plan];
    const baseDate = member.expiresAt && member.expiresAt >= today() ? member.expiresAt : today();
    setAmount(String(details.amount));
    setExpiresAt(addMonths(baseDate, details.months));
  }

  const currentStatus = !selectedMember?.expiresAt
    ? "Bez datuma isteka"
    : selectedMember.expiresAt >= today()
      ? "Aktivna"
      : "Istekla";

  return (
    <form action={createPayment} className="grid gap-5 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
        Član
        <select
          name="memberId"
          value={memberId}
          onChange={(event) => selectMember(event.target.value)}
          required
          className="h-10 rounded-lg border bg-background px-3"
        >
          <option value="">Izaberi člana</option>
          {members.map((member) => <option key={member.id} value={member.id}>{member.firstName} {member.lastName}</option>)}
        </select>
      </label>

      {selectedMember && (
        <div className="grid gap-3 rounded-xl border bg-muted/40 p-4 sm:col-span-2 sm:grid-cols-3">
          <MemberInfo icon={UserRound} label="Plan" value={planDetails[selectedMember.plan].label} />
          <MemberInfo icon={CalendarDays} label="Trenutno važi do" value={formatDate(selectedMember.expiresAt)} />
          <MemberInfo icon={CreditCard} label="Status" value={currentStatus} />
        </div>
      )}

      <label className="grid gap-2 text-sm font-semibold">
        Iznos (€)
        <Input name="amount" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Način plaćanja
        <select name="method" className="h-10 rounded-lg border bg-background px-3">
          <option value="CASH">Gotovina</option>
          <option value="CARD">Kartica</option>
          <option value="TRANSFER">Transfer</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Novi period važi do
        <Input name="expiresAt" type="date" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} required />
      </label>
      <div className="self-end">
        <Button disabled={!memberId} type="submit">Sačuvaj uplatu</Button>
      </div>
      {selectedMember && expiresAt && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800 sm:col-span-2">
          Nakon uplate članarina će važiti do <strong>{formatDate(expiresAt)}</strong>.
        </p>
      )}
    </form>
  );
}

function MemberInfo({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-background text-green-700"><Icon className="size-4" /></span><div><span className="block text-xs text-muted-foreground">{label}</span><strong className="text-sm">{value}</strong></div></div>;
}
