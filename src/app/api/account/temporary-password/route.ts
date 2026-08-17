import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";

const schema = z.object({
  currentPassword: z.string().min(10).max(128),
  newPassword: z.string().min(10).max(128),
  acceptedTerms: z.literal(true),
  acceptedPrivacy: z.literal(true),
});

export async function POST(request: Request) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session?.user)
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 },
    );
  try {
    const input = schema.parse(await request.json());
    await auth.api.changePassword({
      headers: requestHeaders,
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        revokeOtherSessions: true,
      },
    });
    await db
      .update(user)
      .set({
        mustChangePassword: false,
        acceptedTerms: true,
        acceptedPrivacy: true,
        legalAcceptedAt: new Date(),
        legalVersion: "2026-08-17",
      })
      .where(eq(user.id, session.user.id));
    await recordAuditLog({
      action: "TEMPORARY_PASSWORD_REPLACED",
      entity: "user",
      entityId: session.user.id,
      description: "User replaced an administrator-issued temporary password.",
      actorId: session.user.id,
      actorEmail: session.user.email,
    });
    return NextResponse.json({ data: { changed: true } });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Password could not be changed.",
        },
      },
      { status: 400 },
    );
  }
}
