import "server-only";

import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { emailDelivery, smtpConfiguration } from "@/db/schema";

export async function getDashboardData(organizationId: string) {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 13);
  since.setUTCHours(0, 0, 0, 0);
  const [deliveries, senders] = await Promise.all([
    db.select().from(emailDelivery).where(and(eq(emailDelivery.organizationId, organizationId), gte(emailDelivery.createdAt, since))).orderBy(desc(emailDelivery.createdAt)).limit(2000),
    db.select({ id: smtpConfiguration.id, label: smtpConfiguration.label, isDefault: smtpConfiguration.isDefault }).from(smtpConfiguration).where(eq(smtpConfiguration.organizationId, organizationId)),
  ]);
  const dates = Array.from({ length: 14 }, (_, index) => { const date = new Date(since); date.setUTCDate(date.getUTCDate() + index); return date; });
  const trend = dates.map((date) => {
    const key = date.toISOString().slice(0, 10);
    const daily = deliveries.filter((item) => item.createdAt.toISOString().slice(0, 10) === key);
    return { date: date.toLocaleDateString("en", { month: "short", day: "numeric", timeZone: "UTC" }), accepted: daily.filter((item) => item.status === "sent").length, failed: daily.filter((item) => item.status === "failed").length };
  });
  const accepted = deliveries.filter((item) => item.status === "sent").length;
  const failed = deliveries.filter((item) => item.status === "failed").length;
  const completed = accepted + failed;
  return { metrics: { total: deliveries.length, accepted, failed, pending: deliveries.filter((item) => item.status === "pending").length, acceptanceRate: completed ? Math.round((accepted / completed) * 1000) / 10 : 0, senders: senders.length }, trend, recent: deliveries.slice(0, 8), updatedAt: new Date() };
}
