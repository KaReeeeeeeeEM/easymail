"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { z } from "zod";

import { member } from "@/db/auth-schema";
import { db } from "@/db";
import { smtpConfiguration } from "@/db/schema";
import { encryptCredential } from "@/features/email/infrastructure/credential-crypto";
import { auth } from "@/lib/auth";

const schema = z.object({
  provider: z.enum(["gmail", "yahoo", "zoho", "zoho-org", "ses", "custom"]),
  label: z.string().trim().min(2).max(80),
  host: z.string().trim().min(1).max(253),
  port: z.coerce.number().int().min(1).max(65535),
  secure: z.enum(["true", "false"]).transform((value) => value === "true"),
  senderName: z.string().trim().min(1).max(100),
  senderEmail: z.string().email().max(320),
  username: z.string().trim().min(1).max(320),
  password: z.string().min(1).max(500),
  isDefault: z.enum(["on"]).optional().transform(Boolean),
});

type ActionResult = { success: boolean; message: string };

async function authorizedOrganization() {
  const session = await auth.api.getSession({ headers: await headers() });
  const organizationId = session?.session.activeOrganizationId;
  if (!session || !organizationId) return null;
  const [membership] = await db.select({ role: member.role }).from(member).where(and(eq(member.userId, session.user.id), eq(member.organizationId, organizationId))).limit(1);
  if (!membership || !["owner", "admin"].includes(membership.role)) return null;
  return organizationId;
}

export async function configureSmtp(formData: FormData): Promise<ActionResult> {
  const organizationId = await authorizedOrganization();
  if (!organizationId) return { success: false, message: "You do not have permission to manage senders." };
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Check the sender details." };
  const values = parsed.data;
  const providerHosts: Partial<Record<typeof values.provider, string>> = {
    gmail: "smtp.gmail.com",
    yahoo: "smtp.mail.yahoo.com",
    zoho: "smtp.zoho.com",
    "zoho-org": "smtppro.zoho.com",
  };
  const expectedHost = providerHosts[values.provider];
  if (expectedHost && values.host !== expectedHost) {
    return { success: false, message: `Use ${expectedHost} for the selected provider.` };
  }
  if (values.provider === "ses" && !/^email-smtp\.[a-z0-9-]+\.amazonaws\.com$/.test(values.host)) {
    return { success: false, message: "Select a valid Amazon SES SMTP region." };
  }
  if ((values.port === 465) !== values.secure) {
    return { success: false, message: "Use SSL/TLS with port 465, or STARTTLS with ports 587, 2525, and 25." };
  }
  const password = values.provider === "gmail"
    ? values.password.replaceAll(" ", "")
    : values.password;
  const existingSenders = await db
    .select({ id: smtpConfiguration.id })
    .from(smtpConfiguration)
    .where(eq(smtpConfiguration.organizationId, organizationId))
    .limit(3);
  if (existingSenders.length >= 3) {
    return { success: false, message: "A workspace can have a maximum of 3 SMTP senders." };
  }
  try {
    const transport = nodemailer.createTransport({
      host: values.host,
      port: values.port,
      secure: values.secure,
      auth: { user: values.username, pass: password },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
    await transport.verify();
  } catch {
    return { success: false, message: "SMTP verification failed. Check the host, port, security mode, and credentials." };
  }
  const [existing] = existingSenders;
  const makeDefault = values.isDefault || !existing;
  if (makeDefault) await db.update(smtpConfiguration).set({ isDefault: false }).where(eq(smtpConfiguration.organizationId, organizationId));
  try {
    await db.insert(smtpConfiguration).values({
      organizationId,
      label: values.label,
      host: values.host,
      port: values.port,
      secure: values.secure,
      senderName: values.senderName,
      senderEmail: values.senderEmail,
      username: values.username,
      encryptedPassword: encryptCredential(password),
      isDefault: makeDefault,
      lastVerifiedAt: new Date(),
    });
  } catch {
    return { success: false, message: "A sender with that label already exists." };
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sender");
  return { success: true, message: "Sender verified and saved." };
}

export async function setDefaultSender(id: string): Promise<ActionResult> {
  const organizationId = await authorizedOrganization();
  if (!organizationId) return { success: false, message: "You do not have permission to manage senders." };
  const [sender] = await db.select({ id: smtpConfiguration.id }).from(smtpConfiguration).where(and(eq(smtpConfiguration.id, id), eq(smtpConfiguration.organizationId, organizationId))).limit(1);
  if (!sender) return { success: false, message: "Sender not found." };
  await db.update(smtpConfiguration).set({ isDefault: false }).where(eq(smtpConfiguration.organizationId, organizationId));
  await db.update(smtpConfiguration).set({ isDefault: true, updatedAt: new Date() }).where(eq(smtpConfiguration.id, id));
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sender");
  return { success: true, message: "Default sender updated." };
}
