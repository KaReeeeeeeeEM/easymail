import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { emailDelivery } from "@/db/schema";
import { auth } from "@/lib/auth";

function errorResponse(status: number, code: string, message: string, requestId: string) {
  return Response.json({ error: { code, message, requestId } }, { status, headers: { "x-request-id": requestId } });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = request.headers.get("x-request-id")?.slice(0, 100) || randomUUID();
  const authorization = request.headers.get("authorization");
  const key = request.headers.get("x-api-key") ?? (authorization?.startsWith("Bearer ") ? authorization.slice(7) : null);
  if (!key) return errorResponse(401, "API_KEY_REQUIRED", "Provide an API key", requestId);
  const verification = await auth.api.verifyApiKey({ body: { key } });
  if (!verification.valid || !verification.key) return errorResponse(401, "INVALID_API_KEY", "The API key is invalid or expired", requestId);
  const { id } = await params;
  const [delivery] = await db.select({ id: emailDelivery.id, status: emailDelivery.status, recipients: emailDelivery.recipients, accepted: emailDelivery.acceptedRecipients, rejected: emailDelivery.rejectedRecipients, subject: emailDelivery.subject, messageId: emailDelivery.providerMessageId, errorCode: emailDelivery.errorCode, createdAt: emailDelivery.createdAt, acceptedAt: emailDelivery.sentAt }).from(emailDelivery).where(and(eq(emailDelivery.id, id), eq(emailDelivery.organizationId, verification.key.referenceId))).limit(1);
  if (!delivery) return errorResponse(404, "DELIVERY_NOT_FOUND", "Email request not found", requestId);
  return Response.json({ data: { ...delivery, status: delivery.status === "sent" ? "accepted" : delivery.status, statusMeaning: delivery.status === "sent" ? "The SMTP provider accepted at least one recipient; inbox placement is not guaranteed." : undefined }, requestId }, { headers: { "x-request-id": requestId } });
}
