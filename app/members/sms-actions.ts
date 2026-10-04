"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sendSms } from "@/lib/sms";
import { revalidatePath } from "next/cache";

export async function sendMemberReminder(memberId: string) {
  if (!(await auth())?.user) return { success: false, message: "Prijavi se da pošalješ SMS." };
  if (!memberId || typeof memberId !== "string") return { success: false, message: "Član nije odabran." };

  try {
    const member = await db.member.findUnique({ where: { id: memberId } });
    if (!member?.phone || !member.expiresAt) return { success: false, message: "Unesi telefon i datum isteka članarine." };
    if (member.smsReminderSentFor?.getTime() === member.expiresAt.getTime()) {
      return { success: false, message: "Podsjetnik je već poslat za ovaj datum isteka." };
    }
    const date = member.expiresAt.toISOString().slice(0, 10);
    await sendSms(member.phone, `Zdravo ${member.firstName}, članarina u Hulk23 teretani ističe ${date}. Obnovi članarinu na vrijeme.`);
    try {
      await db.member.updateMany({
        where: { id: member.id, expiresAt: member.expiresAt },
        data: { smsReminderSentFor: member.expiresAt },
      });
    } catch (error) {
      console.error("[manual-reminder] Evidentiranje prihvaćenog SMS-a nije uspjelo", error);
      return { success: true, message: "SMS je prihvaćen, ali nije evidentiran. Provjeri Twilio prije ponovnog slanja." };
    }
    revalidatePath("/members");
    return { success: true, message: "SMS je prihvaćen za slanje." };
  } catch (error) {
    console.error("[manual-reminder] Slanje nije uspjelo", error);
    const message = error instanceof Error ? error.message : "";
    return { success: false, message: message.startsWith("Twilio") || message.startsWith("Telefon") || message.startsWith("SMS provider") ? message : "Slanje nije uspjelo. Pokušaj ponovo kasnije." };
  }
}
