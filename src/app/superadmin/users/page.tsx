import { desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { ManagementTable } from "@/components/superadmin/management-table";
import { db } from "@/db";
import { user } from "@/db/auth-schema";
export default async function UsersPage() { const users = await db.select().from(user).orderBy(desc(user.createdAt)).limit(100); return <ManagementTable title="Users" description="Review identities, verification status, access roles, and registration trends across the platform." headers={["User", "Role", "Verification", "Joined"]} rows={users.map((item) => [<div key="user"><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.email}</p></div>, <Badge key="role" variant="secondary">{item.role}</Badge>, item.emailVerified ? "Verified" : "Pending", item.createdAt.toLocaleDateString()])} />; }
