import "server-only";

import { db } from "@/db";
import { auditLog } from "@/db/schema";

export async function recordAuditLog(input: { action: string; entity: string; entityId?: string; description: string; actorId?: string; actorEmail: string; metadata?: Record<string, unknown> }) {
  await db.insert(auditLog).values(input);
}
