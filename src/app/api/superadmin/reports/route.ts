import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { generatedReport } from "@/db/schema";
import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import {
  createReportSnapshot,
  reportFormats,
  reportTitles,
  reportTypes,
} from "@/lib/report-snapshots";

const schema = z.object({
  type: z.enum(reportTypes),
  format: z.enum(reportFormats),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "SUPER_ADMIN")
    return NextResponse.json(
      { error: { message: "Forbidden" } },
      { status: 403 },
    );
  try {
    const { type, format } = schema.parse(await request.json());
    const data = await createReportSnapshot(type);
    const [report] = await db
      .insert(generatedReport)
      .values({
        type,
        format,
        title: reportTitles[type],
        rowCount: data.length,
        data,
        generatedBy: session.user.id,
        generatedByEmail: session.user.email,
      })
      .returning();
    await recordAuditLog({
      action: "REPORT_GENERATED",
      entity: "report",
      entityId: report.id,
      description: `Generated ${reportTitles[type]} as ${format.toUpperCase()}.`,
      actorId: session.user.id,
      actorEmail: session.user.email,
      metadata: { type, format, rowCount: data.length },
    });
    return NextResponse.json(
      {
        data: {
          ...report,
          data: undefined,
          downloadUrl: `/api/superadmin/reports/${report.id}/download`,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Report generation failed.",
        },
      },
      { status: 400 },
    );
  }
}
