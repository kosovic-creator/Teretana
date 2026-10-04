import { timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { normalizeSmsPhone } from "@/lib/phone";
import { sendSms } from "@/lib/sms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getTomorrowDate(timeZone: string) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const tomorrow = new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day) + 1));
    const date = tomorrow.toISOString().slice(0, 10);

    return {
        date,
        start: new Date(`${date}T00:00:00.000Z`),
        end: new Date(Date.UTC(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate() + 1)),
    };
}

function isAuthorized(request: Request, secret: string) {
    const authorization = request.headers.get("authorization") ?? "";
    const provided = Buffer.from(authorization.replace(/^Bearer\s+/i, ""));
    const expected = Buffer.from(secret);
    return authorization.toLowerCase().startsWith("bearer ") && provided.length === expected.length && timingSafeEqual(provided, expected);
}


export async function GET(request: Request) {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || !isAuthorized(request, cronSecret)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (![process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, process.env.TWILIO_FROM_NUMBER].every((value) => value?.trim())) {
        return NextResponse.json({ error: "SMS provider nije konfigurisan." }, { status: 503 });
    }

    const timeZone = process.env.MEMBERSHIP_TIME_ZONE || "Europe/Sarajevo";
    let targetDate: ReturnType<typeof getTomorrowDate>;
    try {
        targetDate = getTomorrowDate(timeZone);
    } catch {
        return NextResponse.json({ error: "Neispravna vremenska zona." }, { status: 500 });
    }

    const members = await db.member.findMany({
        where: {
            phone: { not: null },
            expiresAt: { gte: targetDate.start, lt: targetDate.end },
        },
        select: { id: true, firstName: true, phone: true, expiresAt: true, smsReminderSentFor: true },
    }).catch((error) => {
        console.error("[membership-reminders] Čitanje baze nije uspjelo", error);
        return null;
    });
    if (!members) return NextResponse.json({ error: "Čitanje članova iz baze nije uspjelo. Provjeri DATABASE_URL i da li je prisma šema primijenjena." }, { status: 503 });

    const eligible = members.filter(member => member.phone && member.expiresAt && member.smsReminderSentFor?.getTime() !== member.expiresAt.getTime());
    if (new URL(request.url).searchParams.get("dryRun") === "1") {
        return NextResponse.json({ date: targetDate.date, timeZone, matched: members.length, eligible: eligible.length, invalidPhones: eligible.filter(member => {
            try { normalizeSmsPhone(member.phone!); return false; } catch { return true; }
        }).length });
    }

    let sent = 0;
    let failed = 0;
    const errors: { memberId: string; error: string }[] = [];
    const accepted: { memberId: string; sid: string; status: string }[] = [];
    for (const member of members) {
        if (!member.phone || !member.expiresAt || member.smsReminderSentFor?.getTime() === member.expiresAt.getTime()) continue;

        try {
            const message = await sendSms(
                member.phone,
                `Zdravo ${member.firstName}, članarina u Hulk23 teretani ističe ${targetDate.date}. Obnovi članarinu na vrijeme.`,
            );
            accepted.push({ memberId: member.id, ...message });
            await db.member.update({
                where: { id: member.id },
                data: { smsReminderSentFor: member.expiresAt },
            });
            sent += 1;
        } catch (error) {
            console.error(`[membership-reminders] Slanje nije uspjelo za člana ${member.id}`, error);
            failed += 1;
            errors.push({ memberId: member.id, error: error instanceof Error ? error.message : "Nepoznata greška slanja." });
        }
    }

    return NextResponse.json({ date: targetDate.date, matched: members.length, sent, failed, skipped: members.length - sent - failed, accepted, errors });
}
