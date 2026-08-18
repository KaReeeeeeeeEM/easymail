"use client";

import {
  BarChart3,
  Bell,
  Building2,
  FileBarChart,
  History,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { href: "/superadmin", label: "Overview", icon: LayoutDashboard },
  { href: "/superadmin/users", label: "Users", icon: Users },
  { href: "/superadmin/workspaces", label: "Workspaces", icon: Building2 },
  { href: "/superadmin/reports", label: "Reports", icon: FileBarChart },
  { href: "/superadmin/audit-logs", label: "Audit logs", icon: History },
  { href: "/superadmin/notifications", label: "Notifications", icon: Bell },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="items-center p-3">
        <div className="group-data-[collapsible=icon]:hidden">
          <Logo />
        </div>
        <Link
          href="/superadmin"
          aria-label="Superadmin"
          className="hidden size-8 place-items-center rounded-lg bg-primary text-primary-foreground group-data-[collapsible=icon]:grid"
        >
          <ShieldCheck />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    render={<Link href={href} />}
                    tooltip={label}
                    isActive={pathname === href}
                    className="data-active:bg-primary/15 data-active:text-primary"
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Super administrator">
              <BarChart3 />
              <span className="truncate">{email}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
