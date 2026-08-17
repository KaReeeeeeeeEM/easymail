import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { sendTemporaryCredentialsEmail } from "@/features/email/infrastructure/platform-mailer";
import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { normalizeGmailAddress } from "@/lib/gmail-address";

const inputSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().email() });

export async function POST(request: Request) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session?.user || session.user.role !== "SUPER_ADMIN") return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 });
  try {
    const input = inputSchema.parse(await request.json());
    const email = normalizeGmailAddress(input.email);
    const temporaryPassword = `${randomBytes(9).toString("base64url")}A9!`;
    const created = await auth.api.createUser({
      headers: requestHeaders,
      body: { email, name: input.name, password: temporaryPassword, role: "USER" },
    });
    await db.update(user).set({ emailVerified: true, mustChangePassword: true, twoFactorEnabled: true, role: "USER" }).where(eq(user.id, created.user.id));
    await sendTemporaryCredentialsEmail({ email, name: input.name, temporaryPassword });
    await recordAuditLog({ action: "USER_CREATED", entity: "user", entityId: created.user.id, description: `Created a managed account for ${email}.`, actorId: session.user.id, actorEmail: session.user.email });
    return NextResponse.json({ data: { id: created.user.id, email } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The user could not be created.";
    return NextResponse.json({ error: { message } }, { status: 400 });
  }
}
