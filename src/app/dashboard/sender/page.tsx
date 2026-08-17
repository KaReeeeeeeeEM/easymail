import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { SmtpConfigurationForm } from "@/components/dashboard/smtp-configuration-form";
import { SenderTable } from "@/components/dashboard/sender-table";
import { PageHeading } from "@/components/dashboard/page-heading";
import { db } from "@/db";
import { smtpConfiguration } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function SenderPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const organizationId = session?.session.activeOrganizationId;
  const senders = organizationId ? await db.select({ id: smtpConfiguration.id, label: smtpConfiguration.label, host: smtpConfiguration.host, port: smtpConfiguration.port, secure: smtpConfiguration.secure, senderName: smtpConfiguration.senderName, senderEmail: smtpConfiguration.senderEmail, isDefault: smtpConfiguration.isDefault, lastVerifiedAt: smtpConfiguration.lastVerifiedAt }).from(smtpConfiguration).where(eq(smtpConfiguration.organizationId, organizationId)).orderBy(desc(smtpConfiguration.isDefault), desc(smtpConfiguration.createdAt)) : [];
  return <div className="flex flex-col gap-8">
    <PageHeading eyebrow="Dynamic delivery providers" title="SMTP senders" description="Connect and manage up to 3 standards-compliant SMTP accounts in this workspace." action={<SmtpConfigurationForm disabled={senders.length >= 3} label={senders.length >= 3 ? "Sender limit reached" : "Add sender"} />} />
    <SenderTable senders={senders.map((sender) => ({ ...sender, lastVerifiedAt: sender.lastVerifiedAt?.toISOString() ?? null }))} emptyAction={<SmtpConfigurationForm label="Add your first sender" />} />
  </div>;
}
