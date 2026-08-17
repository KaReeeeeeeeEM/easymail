import { desc } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { auditLog } from "@/db/schema";
import { auth } from "@/lib/auth";
function csv(value: unknown) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }
export async function GET() { const session = await auth.api.getSession({ headers: await headers() }); if (!session?.user || session.user.role !== "SUPER_ADMIN") return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 }); const events = await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(5000); const body = [["action", "entity", "entity_id", "description", "actor", "created_at"].map(csv).join(","), ...events.map((event) => [event.action, event.entity, event.entityId, event.description, event.actorEmail, event.createdAt.toISOString()].map(csv).join(","))].join("\n"); return new NextResponse(body, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="easymail-audit-log-${new Date().toISOString().slice(0,10)}.csv"` } }); }
