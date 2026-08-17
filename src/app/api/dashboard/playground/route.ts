import { randomUUID } from "node:crypto";
import { headers } from "next/headers";

import { sendOrganizationEmail, EmailServiceError } from "@/features/email/application/send-email";
import { sendEmailSchema } from "@/features/email/domain/send-email";
import { auth } from "@/lib/auth";

export const maxDuration = 30;

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const organizationId = session?.session.activeOrganizationId;
  if (!session?.user || !organizationId) {
    return Response.json({ error: { message: "Select a workspace before sending a test email." } }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4_500_000) {
    return Response.json({ error: { message: "The test request exceeds 4.5 MB." } }, { status: 413 });
  }

  const parsed = sendEmailSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !parsed.data.senderId) {
    return Response.json({ error: { message: "Choose a sender and check the email fields." } }, { status: 422 });
  }

  try {
    const result = await sendOrganizationEmail(parsed.data, {
      organizationId,
      idempotencyKey: `playground-${randomUUID()}`,
    });
    return Response.json({ data: result }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: { message: error instanceof EmailServiceError ? error.message : "The test email could not be sent." } },
      { status: error instanceof EmailServiceError && error.code === "SMTP_NOT_CONFIGURED" ? 409 : 502 },
    );
  }
}
