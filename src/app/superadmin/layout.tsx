import { AdminHeader } from "@/components/superadmin/admin-header";
import { AdminSidebar } from "@/components/superadmin/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireSuperadmin } from "@/lib/superadmin";

export const metadata = { title: "Superadmin", robots: { index: false, follow: false } };
export default async function SuperadminLayout({ children }: { children: React.ReactNode }) { const session = await requireSuperadmin(); return <SidebarProvider><AdminSidebar email={session.user.email} /><SidebarInset className="bg-muted/20"><AdminHeader /><main className="flex-1 p-5 sm:p-8">{children}</main></SidebarInset></SidebarProvider>; }
