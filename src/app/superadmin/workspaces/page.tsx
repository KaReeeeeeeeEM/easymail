import { count, desc, eq } from "drizzle-orm";
import { Building2 } from "lucide-react";
import Link from "next/link";

import { ImpersonateUserButton } from "@/components/superadmin/impersonate-user-button";
import { ManagementTable } from "@/components/superadmin/management-table";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { member, organization } from "@/db/auth-schema";

export default async function WorkspacesPage() {
  const workspaces = await db.select({ id: organization.id, name: organization.name, slug: organization.slug, createdAt: organization.createdAt, members: count(member.id) }).from(organization).leftJoin(member, eq(member.organizationId, organization.id)).groupBy(organization.id).orderBy(desc(organization.createdAt)).limit(100);
  const owners = await db.select({ organizationId: member.organizationId, userId: member.userId }).from(member).where(eq(member.role, "owner"));
  return <ManagementTable title="Workspaces" description="Review every tenant and enter its owner’s session when delegated operational work is required." action={<Button render={<Link href="/superadmin/users" />}><Building2 data-icon="inline-start" />Manage owners</Button>} headers={["Workspace", "Slug", "Members", "Created", "Action"]} rows={workspaces.map((item) => [item.name, item.slug, item.members, item.createdAt.toLocaleDateString(), <ImpersonateUserButton key="action" userId={owners.find((owner) => owner.organizationId === item.id)?.userId ?? ""} disabled={!owners.some((owner) => owner.organizationId === item.id)} />])} />;
}
