import { asc } from "drizzle-orm";

import { db } from "@/db";
import { organization, user } from "@/db/auth-schema";
import { emailDelivery, smtpConfiguration } from "@/db/schema";

export const reportTypes = [
  "delivery",
  "users",
  "workspaces",
  "senders",
] as const;
export const reportFormats = ["csv", "xlsx", "docx", "pdf"] as const;
export type ReportType = (typeof reportTypes)[number];
export type ReportFormat = (typeof reportFormats)[number];
export type ReportRow = Record<string, string | number | boolean | null>;

export const reportTitles: Record<ReportType, string> = {
  delivery: "Email delivery report",
  users: "User adoption report",
  workspaces: "Workspace inventory report",
  senders: "SMTP sender report",
};

const REPORT_ROW_LIMIT = 5_000;

function iso(value: Date | null) {
  return value?.toISOString() ?? "Not recorded";
}

export async function createReportSnapshot(
  type: ReportType,
): Promise<ReportRow[]> {
  if (type === "delivery") {
    const rows = await db
      .select({
        status: emailDelivery.status,
        recipients: emailDelivery.recipients,
        subject: emailDelivery.subject,
        accepted: emailDelivery.acceptedRecipients,
        rejected: emailDelivery.rejectedRecipients,
        providerMessageId: emailDelivery.providerMessageId,
        createdAt: emailDelivery.createdAt,
        sentAt: emailDelivery.sentAt,
      })
      .from(emailDelivery)
      .orderBy(asc(emailDelivery.createdAt))
      .limit(REPORT_ROW_LIMIT);
    return rows.map((row) => ({
      Status: row.status,
      Recipients: row.recipients.join(", "),
      Subject: row.subject,
      Accepted: row.accepted.join(", ") || "None",
      Rejected: row.rejected.join(", ") || "None",
      "Provider message ID": row.providerMessageId ?? "Not available",
      Created: iso(row.createdAt),
      Sent: iso(row.sentAt),
    }));
  }

  if (type === "users") {
    const rows = await db
      .select({
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        status: user.banned,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(asc(user.createdAt))
      .limit(REPORT_ROW_LIMIT);
    return rows.map((row) => ({
      Name: row.name,
      Email: row.email,
      Role: row.role,
      "Email verified": row.emailVerified ? "Yes" : "No",
      "Two-factor authentication": row.twoFactorEnabled
        ? "Enabled"
        : "Disabled",
      Status: row.status ? "Suspended" : "Active",
      Joined: iso(row.createdAt),
    }));
  }

  if (type === "workspaces") {
    const rows = await db
      .select({
        name: organization.name,
        slug: organization.slug,
        createdAt: organization.createdAt,
      })
      .from(organization)
      .orderBy(asc(organization.createdAt))
      .limit(REPORT_ROW_LIMIT);
    return rows.map((row) => ({
      Name: row.name,
      Slug: row.slug,
      Created: iso(row.createdAt),
    }));
  }

  const rows = await db
    .select({
      label: smtpConfiguration.label,
      senderName: smtpConfiguration.senderName,
      senderEmail: smtpConfiguration.senderEmail,
      host: smtpConfiguration.host,
      port: smtpConfiguration.port,
      secure: smtpConfiguration.secure,
      isDefault: smtpConfiguration.isDefault,
      lastVerifiedAt: smtpConfiguration.lastVerifiedAt,
      createdAt: smtpConfiguration.createdAt,
    })
    .from(smtpConfiguration)
    .orderBy(asc(smtpConfiguration.createdAt))
    .limit(REPORT_ROW_LIMIT);
  return rows.map((row) => ({
    Configuration: row.label,
    Sender: `${row.senderName} <${row.senderEmail}>`,
    Host: row.host,
    Port: row.port,
    Security: row.secure ? "SSL/TLS" : "STARTTLS",
    Default: row.isDefault ? "Yes" : "No",
    "Last verified": iso(row.lastVerifiedAt),
    Created: iso(row.createdAt),
  }));
}
