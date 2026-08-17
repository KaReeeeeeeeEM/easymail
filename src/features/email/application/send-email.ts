import "server-only";

import { and, desc, eq } from "drizzle-orm";
import nodemailer from "nodemailer";

import { db } from "@/db";
import { emailDelivery, smtpConfiguration } from "@/db/schema";
import type { SendEmailInput } from "@/features/email/domain/send-email";
import { decryptCredential } from "@/features/email/infrastructure/credential-crypto";

export class EmailServiceError extends Error {
  constructor(public readonly code: "SMTP_NOT_CONFIGURED" | "DELIVERY_FAILED", message: string) {
    super(message);
  }
}

export async function sendOrganizationEmail(input: SendEmailInput, context: { organizationId: string; idempotencyKey?: string }) {
  if (context.idempotencyKey) {
    const [existing] = await db.select().from(emailDelivery).where(and(
      eq(emailDelivery.organizationId, context.organizationId),
      eq(emailDelivery.idempotencyKey, context.idempotencyKey),
    )).limit(1);
    if (existing) return { id: existing.id, status: existing.status, duplicate: true } as const;
  }

  const configurationWhere = input.senderId
    ? and(eq(smtpConfiguration.organizationId, context.organizationId), eq(smtpConfiguration.id, input.senderId))
    : eq(smtpConfiguration.organizationId, context.organizationId);
  const configurations = await db.select().from(smtpConfiguration)
    .where(configurationWhere)
    .orderBy(desc(smtpConfiguration.isDefault), desc(smtpConfiguration.createdAt))
    .limit(1);
  const configuration = configurations[0];
  if (!configuration) throw new EmailServiceError("SMTP_NOT_CONFIGURED", input.senderId ? "That sender does not exist in this workspace" : "Configure an SMTP sender before sending email");

  const recipients = Array.isArray(input.to) ? input.to : [input.to];
  const [delivery] = await db.insert(emailDelivery).values({
    organizationId: context.organizationId,
    smtpConfigurationId: configuration.id,
    idempotencyKey: context.idempotencyKey,
    recipients,
    subject: input.subject,
  }).returning({ id: emailDelivery.id });

  try {
    const transporter = nodemailer.createTransport({
      host: configuration.host,
      port: configuration.port,
      secure: configuration.secure,
      auth: { user: configuration.username, pass: decryptCredential(configuration.encryptedPassword) },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
    const message = {
      ...input,
      attachments: input.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: Buffer.from(attachment.content, "base64"),
        contentType: attachment.contentType,
      })),
    };
    delete message.senderId;
    const result = await transporter.sendMail({
      from: { name: configuration.senderName, address: configuration.senderEmail },
      ...message,
    });
    const accepted = result.accepted.map(String);
    const rejected = result.rejected.map(String);
    if (accepted.length === 0) throw new Error("SMTP provider rejected every recipient");
    await db.update(emailDelivery).set({ status: "sent", sentAt: new Date(), providerMessageId: result.messageId, acceptedRecipients: accepted, rejectedRecipients: rejected, providerResponse: result.response })
      .where(eq(emailDelivery.id, delivery.id));
    return { id: delivery.id, status: "sent", messageId: result.messageId, accepted, rejected, duplicate: false } as const;
  } catch (error) {
    await db.update(emailDelivery).set({ status: "failed", errorCode: "SMTP_DELIVERY_FAILED", providerResponse: error instanceof Error ? error.message.slice(0, 500) : null })
      .where(eq(emailDelivery.id, delivery.id));
    throw new EmailServiceError("DELIVERY_FAILED", "The SMTP provider did not accept the message");
  }
}
