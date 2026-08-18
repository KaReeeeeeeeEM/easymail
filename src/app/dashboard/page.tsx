import { headers } from "next/headers";
import { Activity, BookOpen, MailCheck, Plus, Send, Server } from "lucide-react";
import Link from "next/link";

import { DeliveryChart } from "@/components/dashboard/delivery-chart";
import { StatusChart } from "@/components/dashboard/status-chart";
import { PageHeading } from "@/components/dashboard/page-heading";
import { RecentRequestsTable } from "@/components/dashboard/recent-requests-table";
import { WorkspaceSetup } from "@/components/dashboard/workspace-setup";
import {
  ActivateWorkspace,
  WorkspaceCards,
} from "@/components/dashboard/workspace-overview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardData } from "@/features/dashboard/queries/get-dashboard-data";
import { auth } from "@/lib/auth";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ workspace?: string }>;
}) {
  const requestHeaders = await headers();
  const [session, organizations, params] = await Promise.all([
    auth.api.getSession({ headers: requestHeaders }),
    auth.api.listOrganizations({ headers: requestHeaders }),
    searchParams,
  ]);
  const activeOrganizationId = session?.session.activeOrganizationId ?? null;
  const requestedOrganization = organizations.find(
    (organization) => organization.id === params.workspace,
  );

  if (organizations.length === 0)
    return (
      <div className="flex flex-col gap-8">
        <PageHeading
          eyebrow="Workspace overview"
          title="Delivery overview"
          description="Create a workspace to monitor email delivery, API usage, and sender health."
        />
        <WorkspaceSetup />
      </div>
    );

  if (organizations.length > 1 && !requestedOrganization)
    return (
      <div className="flex flex-col gap-8">
        <PageHeading
          eyebrow="Your workspaces"
          title="Choose a workspace"
          description="Select the workspace whose delivery activity, senders, and API usage you want to view."
        />
        <WorkspaceCards
          organizations={organizations}
          activeOrganizationId={activeOrganizationId}
        />
      </div>
    );

  const selectedOrganization = requestedOrganization ?? organizations[0];
  const organizationId = selectedOrganization.id;
  const data = await getDashboardData(organizationId);
  const cards = [
    {
      label: "Requests",
      value: data.metrics.total,
      detail: "Last 14 days",
      icon: Send,
    },
    {
      label: "SMTP accepted",
      value: data.metrics.accepted,
      detail: "Provider accepted",
      icon: MailCheck,
    },
    {
      label: "Acceptance rate",
      value: `${data.metrics.acceptanceRate}%`,
      detail: "Of completed requests",
      icon: Activity,
    },
    {
      label: "Active senders",
      value: data.metrics.senders,
      detail: "Dynamic SMTP configs",
      icon: Server,
    },
  ];
  return (
    <div className="flex flex-col gap-8">
      {organizationId !== activeOrganizationId && (
        <ActivateWorkspace organization={selectedOrganization} />
      )}
      <PageHeading
        eyebrow="Workspace active"
        title="Delivery overview"
        description={`Monitor SMTP activity, provider acceptance, and recent API requests for ${selectedOrganization.name}.`}
        action={
          <Button render={<Link href="/dashboard/sender#add-sender" />}>
            <Plus data-icon="inline-start" />
            Add sender
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{label}</CardDescription>
              <Icon className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>SMTP outcomes</CardTitle>
            <CardDescription>
              Daily accepted and failed requests · last 14 days · UTC · updated{" "}
              {data.updatedAt.toLocaleTimeString("en", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.metrics.total ? (
              <DeliveryChart data={data.trend} />
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <Send className="mb-3 size-8 text-primary" />
                <p className="font-medium">No delivery activity yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Send your first API request to populate this chart.
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  render={<Link href="/dashboard/docs" />}
                >
                  <BookOpen data-icon="inline-start" />
                  Open quickstart
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status distribution</CardTitle>
            <CardDescription>
              Outcome share for requests in this period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.metrics.total ? (
              <StatusChart
                accepted={data.metrics.accepted}
                failed={data.metrics.failed}
                pending={data.metrics.pending}
              />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                No status data yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Recent requests</CardTitle>
          <CardDescription>
            SMTP accepted means the provider accepted the message; it is not an
            inbox-read receipt.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <RecentRequestsTable
            requests={data.recent.map((item) => ({
              id: item.id,
              subject: item.subject,
              recipients: item.recipients,
              status: item.status,
              createdAt: item.createdAt.toISOString(),
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
