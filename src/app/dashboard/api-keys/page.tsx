import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { smtpConfiguration } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import Link from "next/link";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function ApiKeysPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const organizationId = session?.session.activeOrganizationId;
  const result = organizationId
    ? await auth.api.listApiKeys({
        headers: requestHeaders,
        query: { organizationId },
      })
    : null;
  const senders = organizationId
    ? await db.select({ id: smtpConfiguration.id, label: smtpConfiguration.label, senderEmail: smtpConfiguration.senderEmail }).from(smtpConfiguration).where(eq(smtpConfiguration.organizationId, organizationId))
    : [];
  return (
    <div className="flex flex-col gap-8">
      {organizationId ? (
        <ApiKeyManager
          organizationId={organizationId}
          initialKeys={
            (result?.apiKeys ?? []) as Parameters<
              typeof ApiKeyManager
            >[0]["initialKeys"]
          }
          senders={senders}
        />
      ) : (
        <>
          <PageHeading
            eyebrow="Developer access"
            title="API keys"
            description="Create, search, rotate, and revoke the credentials your applications use."
          />
          <Empty className="min-h-[420px] border bg-card/40">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Building2 />
              </EmptyMedia>
              <EmptyTitle>No active workspace</EmptyTitle>
              <EmptyDescription>
                Create a workspace before issuing application API keys.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button render={<Link href="/dashboard" />}>
                Go to overview
              </Button>
            </EmptyContent>
          </Empty>
        </>
      )}
    </div>
  );
}
