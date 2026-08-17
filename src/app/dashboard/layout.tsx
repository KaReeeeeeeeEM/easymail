import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return (
    <SidebarProvider>
      <AppSidebar email={session.user.email} />
      <SidebarInset className="bg-muted/20">
        <DashboardHeader email={session.user.email} />
        <div className="flex-1 p-5 sm:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
