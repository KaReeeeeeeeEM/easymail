import { desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { ManagementTable } from "@/components/superadmin/management-table";
import { db } from "@/db";
import { auditLog } from "@/db/schema";
export default async function AuditLogsPage() { const events = await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(100); return <ManagementTable title="Audit logs" description="Inspect immutable security and administrative activity across the service." headers={["Action", "Entity", "Description", "Actor", "Time"]} rows={events.map((item) => [<Badge key="action" variant="secondary">{item.action}</Badge>, item.entity, item.description, item.actorEmail, item.createdAt.toLocaleString()])} />; }
