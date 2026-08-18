import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { DeliveryStatusTable } from "@/components/dashboard/delivery-status-table";
import { PageHeading } from "@/components/dashboard/page-heading";
import { db } from "@/db";
import { emailDelivery, smtpConfiguration } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function DeliveriesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const organizationId = session?.session.activeOrganizationId;
  const deliveries = organizationId
    ? await db
        .select({
          id: emailDelivery.id,
          subject: emailDelivery.subject,
          recipients: emailDelivery.recipients,
          ccRecipients: emailDelivery.ccRecipients,
          status: emailDelivery.status,
          acceptedRecipients: emailDelivery.acceptedRecipients,
          rejectedRecipients: emailDelivery.rejectedRecipients,
          providerMessageId: emailDelivery.providerMessageId,
          providerResponse: emailDelivery.providerResponse,
          errorCode: emailDelivery.errorCode,
          textBody: emailDelivery.textBody,
          htmlBody: emailDelivery.htmlBody,
          attachmentNames: emailDelivery.attachmentNames,
          senderLabel: smtpConfiguration.label,
          senderEmail: smtpConfiguration.senderEmail,
          createdAt: emailDelivery.createdAt,
          sentAt: emailDelivery.sentAt,
        })
        .from(emailDelivery)
        .leftJoin(
          smtpConfiguration,
          eq(emailDelivery.smtpConfigurationId, smtpConfiguration.id),
        )
        .where(eq(emailDelivery.organizationId, organizationId))
        .orderBy(desc(emailDelivery.createdAt))
        .limit(500)
    : [];

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        eyebrow="Email activity"
        title="Delivery status"
        description="Review SMTP acceptance, failures, recipients, provider details, and the content submitted with each request."
      />
      <DeliveryStatusTable
        deliveries={deliveries.map((delivery) => ({
          ...delivery,
          createdAt: delivery.createdAt.toISOString(),
          sentAt: delivery.sentAt?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}
