import { db } from "@hulk23/database";
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
    const adminUsers = await db.adminUser.count();
    return NextResponse.json(
      { ok: true, environment, database: "connected", adminUsers },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[health] Database connection failed", error);
    const prismaError = error as {
      code?: unknown;
      meta?: {
        driverAdapterError?: {
          cause?: { kind?: unknown; originalCode?: unknown };
        };
      };
    };
    return NextResponse.json(
      {
        ok: false,
        environment,
        database: "connection_failed",
        errorType: error instanceof Error ? error.name : "UnknownError",
        prismaCode: typeof prismaError.code === "string" ? prismaError.code : null,
        databaseCode:
          typeof prismaError.meta?.driverAdapterError?.cause?.originalCode === "string"
            ? prismaError.meta.driverAdapterError.cause.originalCode
            : null,
        databaseErrorKind:
          typeof prismaError.meta?.driverAdapterError?.cause?.kind === "string"
            ? prismaError.meta.driverAdapterError.cause.kind
            : null,
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
