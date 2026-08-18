import { desc, eq } from "drizzle-orm";
import { Bell } from "lucide-react";
import { NotificationList } from "@/components/superadmin/notification-list";
import { db } from "@/db";
import { adminNotification } from "@/db/schema";
import { requireSuperadmin } from "@/lib/superadmin";

export default async function NotificationsPage() {
  const session = await requireSuperadmin();
  const notifications = await db
    .select()
    .from(adminNotification)
    .where(eq(adminNotification.userId, session.user.id))
    .orderBy(desc(adminNotification.createdAt))
    .limit(100);
  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <Bell />
          Activity center
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Notifications
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Review security, reporting, and platform events that need managerial
          awareness.
        </p>
      </header>
      <NotificationList initialNotifications={notifications} />
    </div>
  );
}
