"use client";

import {
  BookOpen,
  FlaskConical,
  KeyRound,
  LayoutDashboard,
  MailCheck,
  Settings,
  Send,
  UserRound,
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
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/api-keys", label: "API keys", icon: KeyRound },
  { href: "/dashboard/sender", label: "SMTP senders", icon: Send },
  { href: "/dashboard/deliveries", label: "Delivery status", icon: MailCheck },
  { href: "/dashboard/docs", label: "Documentation", icon: BookOpen },
  { href: "/dashboard/playground", label: "Playground", icon: FlaskConical },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
];

type Workspace = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
};

export function AppSidebar({
  email,
  organizations,
  activeOrganizationId,
}: {
  email: string;
  organizations: Workspace[];
  activeOrganizationId: string | null;
}) {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="items-center p-3">
        <div className="flex w-full justify-center group-data-[collapsible=icon]:hidden">
          <Logo />
        </div>
        <Link
          href="/dashboard"
          aria-label="Dashboard"
          className="hidden size-8 place-items-center rounded-lg bg-primary text-lg font-semibold text-primary-foreground group-data-[collapsible=icon]:grid"
        >
          e
        </Link>
        <div className="w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <WorkspaceSwitcher
            organizations={organizations}
            activeOrganizationId={activeOrganizationId}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    data-onboarding={`nav-${label.toLowerCase().replaceAll(" ", "-")}`}
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
            <SidebarMenuButton
              data-onboarding="nav-settings"
              render={<Link href="/dashboard/settings" />}
              tooltip="Settings"
              isActive={pathname === "/dashboard/settings"}
              className="data-active:bg-primary/15 data-active:text-primary"
            >
              <Settings />
              <span className="truncate">{email}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
