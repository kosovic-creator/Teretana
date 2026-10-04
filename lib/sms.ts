import "server-only";
import { normalizeSmsPhone } from "@/lib/phone";

export async function sendSms(to: string, body: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
    const from = process.env.TWILIO_FROM_NUMBER?.trim();
    if (!accountSid || !authToken || !from) throw new Error("SMS provider nije konfigurisan.");

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: normalizeSmsPhone(to), From: from, Body: body }),
        signal: AbortSignal.timeout(15_000),
    });

    const result = await response.json() as { sid?: string; status?: string; code?: number; error_code?: number };
    if (!response.ok || result.status === "failed" || result.status === "undelivered") {
        const code = result.code ?? result.error_code;
        throw new Error(`Twilio HTTP ${response.status}${code ? `, kod ${code}: https://www.twilio.com/docs/api/errors/${code}` : ""}.`);
    }
    if (!result.sid || !result.status) throw new Error("Twilio nije potvrdio prihvatanje poruke.");
    return { sid: result.sid, status: result.status };
}
