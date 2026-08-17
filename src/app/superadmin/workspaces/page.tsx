import { count, desc, eq } from "drizzle-orm";
import { ManagementTable } from "@/components/superadmin/management-table";
import { db } from "@/db";
import { member, organization } from "@/db/auth-schema";
export default async function WorkspacesPage() { const workspaces = await db.select({ id: organization.id, name: organization.name, slug: organization.slug, createdAt: organization.createdAt, members: count(member.id) }).from(organization).leftJoin(member, eq(member.organizationId, organization.id)).groupBy(organization.id).orderBy(desc(organization.createdAt)).limit(100); return <ManagementTable title="Workspaces" description="Observe tenant creation and membership without operating customer SMTP configurations." headers={["Workspace", "Slug", "Members", "Created"]} rows={workspaces.map((item) => [item.name, item.slug, item.members, item.createdAt.toLocaleDateString()])} />; }
