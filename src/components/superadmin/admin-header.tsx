"use client";

import { usePathname } from "next/navigation";
import { AdminAccountMenu } from "@/components/superadmin/admin-account-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

const labels: Record<string, string> = {
  "/superadmin": "Overview",
  "/superadmin/users": "Users",
  "/superadmin/workspaces": "Workspaces",
  "/superadmin/reports": "Reports",
  "/superadmin/audit-logs": "Audit logs",
  "/superadmin/notifications": "Notifications",
  "/superadmin/profile": "Profile",
};
export function AdminHeader({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div>
          <p className="text-xs text-muted-foreground">Super administrator</p>
          <p className="font-semibold">{labels[pathname] ?? "Management"}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AdminAccountMenu user={user} />
      </div>
    </header>
  );
}
