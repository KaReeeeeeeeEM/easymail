import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { CheckCircle2, Server } from "lucide-react";

import { SmtpConfigurationForm } from "@/components/dashboard/smtp-configuration-form";
import { SetDefaultSenderButton } from "@/components/dashboard/sender-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { smtpConfiguration } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function SenderPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const organizationId = session?.session.activeOrganizationId;
  const senders = organizationId ? await db.select({ id: smtpConfiguration.id, label: smtpConfiguration.label, host: smtpConfiguration.host, port: smtpConfiguration.port, secure: smtpConfiguration.secure, senderName: smtpConfiguration.senderName, senderEmail: smtpConfiguration.senderEmail, isDefault: smtpConfiguration.isDefault, lastVerifiedAt: smtpConfiguration.lastVerifiedAt }).from(smtpConfiguration).where(eq(smtpConfiguration.organizationId, organizationId)).orderBy(desc(smtpConfiguration.isDefault), desc(smtpConfiguration.createdAt)) : [];
  return <div className="flex max-w-5xl flex-col gap-8">
    <div><p className="text-sm font-medium text-primary">Dynamic delivery providers</p><h1 className="text-3xl font-semibold tracking-tight">SMTP senders</h1><p className="mt-2 max-w-2xl text-muted-foreground">Connect Gmail, Google Workspace, Outlook, or any standards-compliant SMTP account. Choose a sender per API request with <code>senderId</code>.</p></div>
    {senders.length > 0 && <div className="grid gap-4 md:grid-cols-2">{senders.map((sender) => <Card key={sender.id}><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle className="flex items-center gap-2"><Server className="size-4 text-primary" />{sender.label}</CardTitle><CardDescription>{sender.senderName} &lt;{sender.senderEmail}&gt;</CardDescription></div>{sender.isDefault && <Badge>Default</Badge>}</div></CardHeader><CardContent className="flex items-end justify-between gap-3"><div className="text-sm text-muted-foreground"><p>{sender.host}:{sender.port} · {sender.secure ? "TLS" : "STARTTLS"}</p><p className="mt-1 flex items-center gap-1"><CheckCircle2 className="size-3.5 text-emerald-600" /> Verified {sender.lastVerifiedAt?.toLocaleDateString("en", { dateStyle: "medium" })}</p></div>{!sender.isDefault && <SetDefaultSenderButton id={sender.id} />}</CardContent></Card>)}</div>}
    <Card><CardHeader><CardTitle>Add an SMTP sender</CardTitle><CardDescription>The connection is tested before credentials are encrypted and saved.</CardDescription></CardHeader><CardContent><SmtpConfigurationForm /></CardContent></Card>
  </div>;
}
