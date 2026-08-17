import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { onboardingPageVisit } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PageOnboarding } from "@/components/dashboard/page-onboarding";
import { ImpersonationBanner } from "@/components/dashboard/impersonation-banner";
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
  if (session.user.mustChangePassword) redirect("/change-temporary-password");
  if (session.user.role === "SUPER_ADMIN") redirect("/superadmin");
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });
  const completedPages = await db.select({ pageKey: onboardingPageVisit.pageKey }).from(onboardingPageVisit).where(eq(onboardingPageVisit.userId, session.user.id));
  return (
    <SidebarProvider>
      <AppSidebar
        email={session.user.email}
        organizations={organizations}
        activeOrganizationId={session.session.activeOrganizationId ?? null}
      />
      <SidebarInset className="bg-muted/20">
        {session.session.impersonatedBy && <ImpersonationBanner email={session.user.email} />}
        <DashboardHeader email={session.user.email} />
        <div className="flex-1 p-5 sm:p-8">{children}</div>
        <PageOnboarding completedPages={completedPages.map((item) => item.pageKey)} />
      </SidebarInset>
    </SidebarProvider>
  );
}
