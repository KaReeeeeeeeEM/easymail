"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ScrollProgress } from "@/components/scroll-progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardAccountMenu } from "@/components/dashboard/dashboard-account-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

const pageNames: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/api-keys": "API keys",
  "/dashboard/sender": "SMTP senders",
  "/dashboard/settings": "Settings",
  "/dashboard/profile": "Profile",
  "/dashboard/docs": "Documentation",
  "/dashboard/playground": "Playground",
  "/dashboard/deliveries": "Delivery status",
};

export function DashboardHeader({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b bg-background/90 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/dashboard" />}>
                Workspace
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="truncate font-semibold">
                {pageNames[pathname] ?? "Dashboard"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DashboardAccountMenu user={user} />
      </div>
      <ScrollProgress />
    </header>
  );
}
