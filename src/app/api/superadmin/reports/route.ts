import { count } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { organization, user } from "@/db/auth-schema";
import { emailDelivery, generatedReport, smtpConfiguration } from "@/db/schema";
import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";

const schema = z.object({ type: z.enum(["delivery", "users", "workspaces", "senders"]) });
const titles = { delivery: "Email delivery report", users: "User adoption report", workspaces: "Workspace inventory report", senders: "SMTP sender report" } as const;

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "SUPER_ADMIN") return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 });
  try {
    const { type } = schema.parse(await request.json());
    const table = type === "delivery" ? emailDelivery : type === "users" ? user : type === "workspaces" ? organization : smtpConfiguration;
    const [result] = await db.select({ value: count() }).from(table);
    const [report] = await db.insert(generatedReport).values({ type, title: titles[type], rowCount: result.value, generatedBy: session.user.id, generatedByEmail: session.user.email }).returning();
    await recordAuditLog({ action: "REPORT_GENERATED", entity: "report", entityId: report.id, description: `Generated ${titles[type]}.`, actorId: session.user.id, actorEmail: session.user.email, metadata: { type, rowCount: result.value } });
    return NextResponse.json({ data: report }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: { message: error instanceof Error ? error.message : "Report generation failed." } }, { status: 400 });
  }
}
