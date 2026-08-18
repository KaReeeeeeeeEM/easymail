import { count, desc, eq, sql } from "drizzle-orm";
import {
  Activity,
  Building2,
  FilePlus2,
  MailCheck,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";

import {
  DeliveryStatusChart,
  DeliveryTrendChart,
  GrowthChart,
  SecurityPostureChart,
} from "@/components/superadmin/admin-analytics-charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { organization, user } from "@/db/auth-schema";
import { emailDelivery } from "@/db/schema";

function shortDay(date: Date) {
  return date.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
function shortMonth(date: Date) {
  return date.toLocaleDateString("en", { month: "short", timeZone: "UTC" });
}

export default async function SuperadminOverview() {
  const [
    [users],
    [workspaces],
    [deliveries],
    [accepted],
    [verified],
    [twoFactor],
    recentUsers,
    dailyRows,
    statusRows,
    userGrowth,
    workspaceGrowth,
  ] = await Promise.all([
    db.select({ value: count() }).from(user),
    db.select({ value: count() }).from(organization),
    db
      .select({ value: count() })
      .from(emailDelivery)
      .where(sql`${emailDelivery.createdAt} >= now() - interval '30 days'`),
    db
      .select({ value: count() })
      .from(emailDelivery)
      .where(eq(emailDelivery.status, "sent")),
    db
      .select({ value: count() })
      .from(user)
      .where(eq(user.emailVerified, true)),
    db
      .select({ value: count() })
      .from(user)
      .where(eq(user.twoFactorEnabled, true)),
    db.select().from(user).orderBy(desc(user.updatedAt)).limit(7),
    db
      .select({
        day: sql<string>`date_trunc('day', ${emailDelivery.createdAt})::date::text`,
        status: emailDelivery.status,
        value: count(),
      })
      .from(emailDelivery)
      .where(sql`${emailDelivery.createdAt} >= now() - interval '13 days'`)
      .groupBy(sql`1`, emailDelivery.status),
    db
      .select({ status: emailDelivery.status, value: count() })
      .from(emailDelivery)
      .groupBy(emailDelivery.status),
    db
      .select({
        month: sql<string>`date_trunc('month', ${user.createdAt})::date::text`,
        value: count(),
      })
      .from(user)
      .where(sql`${user.createdAt} >= now() - interval '5 months'`)
      .groupBy(sql`1`),
    db
      .select({
        month: sql<string>`date_trunc('month', ${organization.createdAt})::date::text`,
        value: count(),
      })
      .from(organization)
      .where(sql`${organization.createdAt} >= now() - interval '5 months'`)
      .groupBy(sql`1`),
  ]);
  const daily = Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (13 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      day: shortDay(date),
      sent: Number(
        dailyRows.find((row) => row.day === key && row.status === "sent")
          ?.value ?? 0,
      ),
      failed: Number(
        dailyRows.find((row) => row.day === key && row.status === "failed")
          ?.value ?? 0,
      ),
    };
  });
  const growth = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() - (5 - index));
    const key = date.toISOString().slice(0, 7);
    return {
      month: shortMonth(date),
      users: Number(
        userGrowth.find((row) => row.month.startsWith(key))?.value ?? 0,
      ),
      workspaces: Number(
        workspaceGrowth.find((row) => row.month.startsWith(key))?.value ?? 0,
      ),
    };
  });
  const statuses = ["sent", "failed", "pending"].map((status, index) => ({
    status,
    value: Number(statusRows.find((row) => row.status === status)?.value ?? 0),
    fill: `var(--chart-${index + 1})`,
  }));
  const stats = [
    { label: "Registered users", value: users.value, icon: Users },
    { label: "Workspaces", value: workspaces.value, icon: Building2 },
    { label: "Requests · 30 days", value: deliveries.value, icon: Activity },
    { label: "Accepted email", value: accepted.value, icon: MailCheck },
  ];
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-primary">
            Managerial command center
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Platform overview
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Monitor adoption, delivery, and account security across the
            platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            render={<Link href="/superadmin/reports" />}
          >
            <FilePlus2 data-icon="inline-start" />
            Generate report
          </Button>
          <Button render={<Link href="/superadmin/users" />}>
            <UserPlus data-icon="inline-start" />
            Create or manage user
          </Button>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{label}</CardDescription>
              <Icon className="text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery health</CardTitle>
            <CardDescription>
              Accepted and failed requests over 14 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeliveryTrendChart data={daily} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Platform growth</CardTitle>
            <CardDescription>
              New users and workspaces over six months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GrowthChart data={growth} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delivery distribution</CardTitle>
            <CardDescription>
              Current request status across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeliveryStatusChart data={statuses} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account security posture</CardTitle>
            <CardDescription>
              Verified and two-factor-protected identities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecurityPostureChart
              data={[
                { label: "Verified email", value: verified.value },
                { label: "Two-factor", value: twoFactor.value },
                { label: "All users", value: users.value },
              ]}
            />
          </CardContent>
        </Card>
      </section>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Recent user activity</CardTitle>
            <CardDescription>
              Most recently updated user accounts. This is the final overview
              section.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/superadmin/users" />}
          >
            View users
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.emailVerified ? "default" : "outline"}>
                      {item.emailVerified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.updatedAt.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      render={<Link href="/superadmin/users" />}
                    >
                      <Users data-icon="inline-start" />
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
