import { db } from "@puls/database";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const authSecret = process.env.AUTH_SECRET?.trim();
  const environment = {
    databaseUrlPresent: Boolean(databaseUrl),
    databaseUrlFormat: databaseUrl?.replace(/^(["'])(.*)\1$/, "$2").startsWith("postgresql://") ?? false,
    databaseUrlHasWhitespace: databaseUrl ? /\s/.test(databaseUrl) : false,
    authSecretPresent: Boolean(authSecret),
    authSecretLengthValid: (authSecret?.replace(/^(["'])(.*)\1$/, "$2").length ?? 0) >= 32,
  };

  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { ok: true, environment, database: "connected" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[health] Database connection failed", error);
    return NextResponse.json(
      {
        ok: false,
        environment,
        database: "connection_failed",
        errorType: error instanceof Error ? error.name : "UnknownError",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
