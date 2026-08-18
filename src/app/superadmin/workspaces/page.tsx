import { count, desc, eq } from "drizzle-orm";
import { Building2 } from "lucide-react";
import Link from "next/link";

import { ManagementTable } from "@/components/superadmin/management-table";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { member, organization } from "@/db/auth-schema";

export default async function WorkspacesPage() {
  const workspaces = await db
    .select({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      createdAt: organization.createdAt,
      members: count(member.id),
    })
    .from(organization)
    .leftJoin(member, eq(member.organizationId, organization.id))
    .groupBy(organization.id)
    .orderBy(desc(organization.createdAt))
    .limit(100);
  return (
    <ManagementTable
      title="Workspaces"
      description="Review tenant ownership and activity without entering private user sessions."
      action={
        <Button render={<Link href="/superadmin/users" />}>
          <Building2 data-icon="inline-start" />
          Manage owners
        </Button>
      }
      headers={["Workspace", "Slug", "Members", "Created", "Actions"]}
      rows={workspaces.map((item) => [
        item.name,
        item.slug,
        item.members,
        item.createdAt.toLocaleDateString(),
        <Button key="action" size="sm" variant="outline" render={<Link href="/superadmin/users" />}>View owner</Button>,
      ])}
    />
  );
}
