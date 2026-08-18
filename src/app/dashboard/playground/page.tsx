import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { PageHeading } from "@/components/dashboard/page-heading";
import { PlaygroundExperience } from "@/components/dashboard/playground-experience";
import { db } from "@/db";
import { smtpConfiguration } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function PlaygroundPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const organizationId = session?.session.activeOrganizationId;
  const senders = organizationId
    ? await db
        .select({
          id: smtpConfiguration.id,
          label: smtpConfiguration.label,
          senderEmail: smtpConfiguration.senderEmail,
        })
        .from(smtpConfiguration)
        .where(eq(smtpConfiguration.organizationId, organizationId))
        .orderBy(
          desc(smtpConfiguration.isDefault),
          desc(smtpConfiguration.createdAt),
        )
    : [];

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        eyebrow="Developer tools"
        title="Email playground"
        description="Compose and preview a live email using a saved workspace sender, then copy production-ready API examples."
      />
      <PlaygroundExperience senders={senders} />
    </div>
  );
}
