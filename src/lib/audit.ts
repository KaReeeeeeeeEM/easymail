import "server-only";

import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { adminNotification, auditLog } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function recordAuditLog(input: {
  action: string;
  entity: string;
  entityId?: string;
  description: string;
  actorId?: string;
  actorEmail: string;
  metadata?: Record<string, unknown>;
}) {
  await db.insert(auditLog).values(input);
  const administrators = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.role, "SUPER_ADMIN"));
  if (administrators.length) {
    await db.insert(adminNotification).values(
      administrators.map((administrator) => ({
        userId: administrator.id,
        title: input.action
          .split("_")
          .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
          .join(" "),
        description: input.description,
        type:
          input.action.includes("FAILED") || input.action.includes("DELETED")
            ? "warning"
            : "info",
        entity: input.entity,
        entityId: input.entityId,
      })),
    );
  }
}
