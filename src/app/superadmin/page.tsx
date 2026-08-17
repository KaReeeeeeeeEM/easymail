import { count, desc, eq, sql } from "drizzle-orm";
import { Activity, Building2, MailCheck, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { organization, user } from "@/db/auth-schema";
import { auditLog, emailDelivery } from "@/db/schema";

export default async function SuperadminOverview() {
  const [[users], [workspaces], [deliveries], [accepted], events] = await Promise.all([
    db.select({ value: count() }).from(user), db.select({ value: count() }).from(organization), db.select({ value: count() }).from(emailDelivery).where(sql`${emailDelivery.createdAt} >= now() - interval '30 days'`), db.select({ value: count() }).from(emailDelivery).where(eq(emailDelivery.status, "sent")), db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(8),
  ]);
  const stats = [{ label: "Registered users", value: users.value, icon: Users }, { label: "Workspaces", value: workspaces.value, icon: Building2 }, { label: "Requests · 30 days", value: deliveries.value, icon: Activity }, { label: "Accepted email", value: accepted.value, icon: MailCheck }];
  return <div className="flex flex-col gap-8"><div><p className="text-sm font-medium text-primary">Managerial oversight</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Platform overview</h1><p className="mt-2 max-w-2xl text-muted-foreground">Observe adoption, workspace growth, delivery health, and administrative activity without entering operational workflows.</p></div><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon }) => <Card key={label}><CardHeader className="flex flex-row items-center justify-between pb-2"><CardDescription>{label}</CardDescription><Icon className="text-primary" /></CardHeader><CardContent><p className="text-3xl font-semibold tabular-nums">{value}</p></CardContent></Card>)}</section><Card><CardHeader><CardTitle>Recent audit activity</CardTitle><CardDescription>Latest immutable managerial and platform events.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">{events.length ? events.map((event) => <div key={event.id} className="flex items-center justify-between gap-4 rounded-lg border p-3"><div><p className="font-medium">{event.description}</p><p className="text-xs text-muted-foreground">{event.actorEmail} · {event.createdAt.toLocaleString()}</p></div><Badge variant="secondary">{event.action}</Badge></div>) : <p className="py-10 text-center text-sm text-muted-foreground">No audit events recorded yet.</p>}</CardContent></Card></div>;
}
