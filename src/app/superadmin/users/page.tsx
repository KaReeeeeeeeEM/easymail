import { desc } from "drizzle-orm";
import { Search } from "lucide-react";
import { CreateUserDialog } from "@/components/superadmin/create-user-dialog";
import { UserRowActions } from "@/components/superadmin/user-row-actions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { user } from "@/db/auth-schema";
export default async function UsersPage() {
  const users = await db
    .select()
    .from(user)
    .orderBy(desc(user.createdAt))
    .limit(100);
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-primary">
            Identity management
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Users</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Create managed accounts, review security status, or enter a customer
            session to operate the product on their behalf.
          </p>
        </div>
        <CreateUserDialog />
      </header>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>User directory</CardTitle>
          <CardDescription>
            {users.length} identities in this bounded view
          </CardDescription>
          <div className="relative mt-3 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search users…"
              aria-label="Search users"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Security</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((item) => (
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
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        variant={item.emailVerified ? "default" : "outline"}
                      >
                        {item.emailVerified ? "Verified" : "Pending"}
                      </Badge>
                      {item.mustChangePassword && (
                        <Badge variant="outline">Temporary password</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <UserRowActions item={item} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>{users.length} results</span>
            <span>Page 1 of 1</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
