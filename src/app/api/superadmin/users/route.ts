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
const updateSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("edit"), userId: z.string().min(1), name: z.string().trim().min(2).max(100) }),
  z.object({ action: z.literal("restrict"), userId: z.string().min(1) }),
  z.object({ action: z.literal("restore"), userId: z.string().min(1) }),
]);
const deleteSchema = z.object({ userId: z.string().min(1) });

async function requireAdmin() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session?.user || session.user.role !== "SUPER_ADMIN") return null;
  return { requestHeaders, session };
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 });
  const { requestHeaders, session } = admin;
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

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 });
  const { requestHeaders, session } = admin;
  try {
    const input = updateSchema.parse(await request.json());
    const [target] = await db.select().from(user).where(eq(user.id, input.userId)).limit(1);
    if (!target) return NextResponse.json({ error: { message: "User not found." } }, { status: 404 });

    if (input.action === "edit") {
      await db.update(user).set({ name: input.name, updatedAt: new Date() }).where(eq(user.id, target.id));
      await recordAuditLog({ action: "USER_UPDATED", entity: "user", entityId: target.id, description: `Updated account details for ${target.email}.`, actorId: session.user.id, actorEmail: session.user.email });
    } else {
      if (target.id === session.user.id || target.role === "SUPER_ADMIN") {
        return NextResponse.json({ error: { message: "Super administrator access cannot be restricted here." } }, { status: 400 });
      }
      if (input.action === "restrict") {
        await auth.api.banUser({ headers: requestHeaders, body: { userId: target.id, banReason: "Restricted by a super administrator" } });
        await recordAuditLog({ action: "USER_RESTRICTED", entity: "user", entityId: target.id, description: `Restricted ${target.email} and revoked all active sessions.`, actorId: session.user.id, actorEmail: session.user.email });
      } else {
        await auth.api.unbanUser({ headers: requestHeaders, body: { userId: target.id } });
        await recordAuditLog({ action: "USER_RESTORED", entity: "user", entityId: target.id, description: `Restored platform access for ${target.email}.`, actorId: session.user.id, actorEmail: session.user.email });
      }
    }
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The account could not be updated.";
    return NextResponse.json({ error: { message } }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 });
  const { requestHeaders, session } = admin;
  try {
    const input = deleteSchema.parse(await request.json());
    const [target] = await db.select().from(user).where(eq(user.id, input.userId)).limit(1);
    if (!target) return NextResponse.json({ error: { message: "User not found." } }, { status: 404 });
    if (target.id === session.user.id || target.role === "SUPER_ADMIN") {
      return NextResponse.json({ error: { message: "Super administrator accounts cannot be deleted here." } }, { status: 400 });
    }
    await auth.api.removeUser({ headers: requestHeaders, body: { userId: target.id } });
    await recordAuditLog({ action: "USER_DELETED", entity: "user", entityId: target.id, description: `Permanently deleted ${target.email}.`, actorId: session.user.id, actorEmail: session.user.email });
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The account could not be deleted.";
    return NextResponse.json({ error: { message } }, { status: 400 });
  }
}
