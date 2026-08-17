import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Plus } from "lucide-react";
import Link from "next/link";

import { SmtpConfigurationForm } from "@/components/dashboard/smtp-configuration-form";
import { SenderTable } from "@/components/dashboard/sender-table";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { smtpConfiguration } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function SenderPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const organizationId = session?.session.activeOrganizationId;
  const senders = organizationId ? await db.select({ id: smtpConfiguration.id, label: smtpConfiguration.label, host: smtpConfiguration.host, port: smtpConfiguration.port, secure: smtpConfiguration.secure, senderName: smtpConfiguration.senderName, senderEmail: smtpConfiguration.senderEmail, isDefault: smtpConfiguration.isDefault, lastVerifiedAt: smtpConfiguration.lastVerifiedAt }).from(smtpConfiguration).where(eq(smtpConfiguration.organizationId, organizationId)).orderBy(desc(smtpConfiguration.isDefault), desc(smtpConfiguration.createdAt)) : [];
  return <div className="flex flex-col gap-8">
    <PageHeading eyebrow="Dynamic delivery providers" title="SMTP senders" description="Connect and manage as many standards-compliant SMTP accounts as your workspace needs." action={<Button render={<Link href="#add-sender" />}><Plus data-icon="inline-start" />Add sender</Button>} />
    <SenderTable senders={senders.map((sender) => ({ ...sender, lastVerifiedAt: sender.lastVerifiedAt?.toISOString() ?? null }))} />
    <Card id="add-sender" className="scroll-mt-24"><CardHeader><CardTitle>Add an SMTP sender</CardTitle><CardDescription>The connection is tested before credentials are encrypted and saved.</CardDescription></CardHeader><CardContent><SmtpConfigurationForm /></CardContent></Card>
  </div>;
}
