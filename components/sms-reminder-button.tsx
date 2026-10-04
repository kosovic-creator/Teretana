"use client";

import { useState, useTransition } from "react";
import { MessageSquare } from "lucide-react";
import { sendMemberReminder } from "@/app/members/sms-actions";
import { Button } from "@/components/ui/button";

export function SmsReminderButton({ memberId, available, alreadySent }: { memberId: string; available: boolean; alreadySent: boolean }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  return (
    <div className="flex max-w-xs flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending || !available || alreadySent || result?.success}
        title={!available ? "Unesi telefon i datum isteka članarine." : undefined}
        onClick={() => startTransition(async () => {
          try { setResult(await sendMemberReminder(memberId)); }
          catch { setResult({ success: false, message: "Zahtjev nije uspio. Provjeri vezu i Twilio status prije ponovnog slanja." }); }
        })}
      >
        <MessageSquare className="size-4" />
        {pending ? "Slanje…" : alreadySent || result?.success ? "SMS poslat" : "Pošalji SMS podsjetnik"}
      </Button>
      <p role="status" aria-live="polite" className={`text-xs ${result?.success ? "text-emerald-200" : "text-red-200"}`}>
        {result?.message}
      </p>
    </div>
  );
}
