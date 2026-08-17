import { count, desc, sql } from "drizzle-orm";
import { Download, History } from "lucide-react";
import Link from "next/link";
import { AuditHeatmap } from "@/components/superadmin/audit-heatmap";
import { ManagementTable } from "@/components/superadmin/management-table";
import { RowActionMenu } from "@/components/superadmin/row-action-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { auditLog } from "@/db/schema";

export default async function AuditLogsPage() {
  const [events, activity] = await Promise.all([
    db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(100),
    db
      .select({
        day: sql<string>`date_trunc('day', ${auditLog.createdAt})::date::text`,
        value: count(),
      })
      .from(auditLog)
      .where(sql`${auditLog.createdAt} >= now() - interval '370 days'`)
      .groupBy(sql`1`),
  ]);
  const days = Array.from({ length: 371 }, (_, index) => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (370 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      date: key,
      count: Number(activity.find((item) => item.day === key)?.value ?? 0),
    };
  });
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-primary">
            Security intelligence
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Audit logs
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Inspect immutable security, customer-support, and administrative
            activity across the service.
          </p>
        </div>
        <Button
          variant="outline"
          render={<Link href="/api/superadmin/audit-logs/export" />}
        >
          <Download data-icon="inline-start" />
          Export current view
        </Button>
      </header>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="text-primary" />
            <CardTitle>Activity heatmap</CardTitle>
          </div>
          <CardDescription>
            Daily audit event density over the last 53 weeks · UTC · hover a
            cell for the exact count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuditHeatmap days={days} />
        </CardContent>
      </Card>
      <ManagementTable
        compact
        title="Event register"
        description="The 100 most recent audit events."
        headers={[
          "Action",
          "Entity",
          "Description",
          "Actor",
          "Time",
          "Actions",
        ]}
        rows={events.map((item) => [
          <Badge key="action" variant="secondary">
            {item.action}
          </Badge>,
          item.entity,
          item.description,
          item.actorEmail,
          item.createdAt.toLocaleString(),
          <RowActionMenu
            key="actions"
            id={item.id}
            title={item.action}
            description="Immutable audit event details."
            fields={[
              { label: "Entity", value: item.entity },
              { label: "Description", value: item.description },
              { label: "Actor", value: item.actorEmail },
              { label: "Time", value: item.createdAt.toLocaleString() },
            ]}
          />,
        ])}
      />
    </div>
  );
}
