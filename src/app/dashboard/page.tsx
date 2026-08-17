import { headers } from "next/headers";
import { Activity, MailCheck, Send, Server } from "lucide-react";
import Link from "next/link";

import { DeliveryChart } from "@/components/dashboard/delivery-chart";
import { WorkspaceSetup } from "@/components/dashboard/workspace-setup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardData } from "@/features/dashboard/queries/get-dashboard-data";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const organizationId = session?.session.activeOrganizationId;
  if (!organizationId) return <div className="flex flex-col gap-6"><div><p className="text-sm font-medium text-primary">Welcome to easymail</p><h1 className="text-3xl font-semibold tracking-tight">Set up your email service</h1></div><WorkspaceSetup /></div>;
  const data = await getDashboardData(organizationId);
  const cards = [
    { label: "Requests", value: data.metrics.total, detail: "Last 14 days", icon: Send },
    { label: "SMTP accepted", value: data.metrics.accepted, detail: "Provider accepted", icon: MailCheck },
    { label: "Acceptance rate", value: `${data.metrics.acceptanceRate}%`, detail: "Of completed requests", icon: Activity },
    { label: "Active senders", value: data.metrics.senders, detail: "Dynamic SMTP configs", icon: Server },
  ];
  return <div className="flex flex-col gap-8">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><Badge variant="secondary">Workspace active</Badge><h1 className="mt-3 text-3xl font-semibold tracking-tight">Delivery overview</h1><p className="mt-2 text-muted-foreground">SMTP activity for the active workspace.</p></div><Button render={<Link href="/dashboard/sender" />}>Add sender</Button></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, detail, icon: Icon }) => <Card key={label}><CardHeader className="flex flex-row items-center justify-between pb-2"><CardDescription>{label}</CardDescription><Icon className="size-4 text-primary" /></CardHeader><CardContent><p className="text-3xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></CardContent></Card>)}</div>
    <Card><CardHeader><CardTitle>SMTP outcomes</CardTitle><CardDescription>Daily accepted and failed requests · last 14 days · UTC · updated {data.updatedAt.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}</CardDescription></CardHeader><CardContent>{data.metrics.total ? <DeliveryChart data={data.trend} /> : <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center"><Send className="mb-3 size-8 text-primary"/><p className="font-medium">No delivery activity yet</p><p className="mt-1 text-sm text-muted-foreground">Send your first API request to populate this chart.</p><Button className="mt-4" variant="outline" render={<Link href="/docs" />}>Open quickstart</Button></div>}</CardContent></Card>
    <Card><CardHeader><CardTitle>Recent requests</CardTitle><CardDescription>SMTP accepted means the provider accepted the message; it is not an inbox-read receipt.</CardDescription></CardHeader><CardContent>{data.recent.length ? <Table><TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Recipient</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Time</TableHead></TableRow></TableHeader><TableBody>{data.recent.map((item) => <TableRow key={item.id}><TableCell className="max-w-64 truncate font-medium">{item.subject}</TableCell><TableCell>{item.recipients[0]}{item.recipients.length > 1 ? ` +${item.recipients.length - 1}` : ""}</TableCell><TableCell><Badge variant={item.status === "failed" ? "destructive" : "secondary"}>{item.status === "sent" ? "Accepted" : item.status}</Badge></TableCell><TableCell className="text-right text-muted-foreground">{item.createdAt.toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}</TableCell></TableRow>)}</TableBody></Table> : <p className="py-8 text-center text-sm text-muted-foreground">No recent requests.</p>}</CardContent></Card>
  </div>;
}
