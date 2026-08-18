import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { generatedReport } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createReportFile } from "@/lib/report-files";
import { reportFormats, type ReportFormat } from "@/lib/report-snapshots";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "SUPER_ADMIN")
    return NextResponse.json(
      { error: { message: "Forbidden" } },
      { status: 403 },
    );
  const { id } = await context.params;
  const [report] = await db
    .select()
    .from(generatedReport)
    .where(eq(generatedReport.id, id))
    .limit(1);
  if (!report)
    return NextResponse.json(
      { error: { message: "Report not found." } },
      { status: 404 },
    );
  if (!reportFormats.includes(report.format as ReportFormat))
    return NextResponse.json(
      { error: { message: "Unsupported report format." } },
      { status: 400 },
    );
  const file = await createReportFile({
    id: report.id,
    title: report.title,
    format: report.format as ReportFormat,
    rows: report.data,
    generatedBy: report.generatedByEmail,
    createdAt: report.createdAt,
  });
  return new Response(new Uint8Array(file.buffer), {
    headers: {
      "Content-Type": file.mime,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
