import { randomUUID } from "node:crypto";

import { auth } from "@/lib/auth";
import { sendEmailSchema } from "@/features/email/domain/send-email";
import { EmailServiceError, sendOrganizationEmail } from "@/features/email/application/send-email";

export const maxDuration = 30;

function errorResponse(status: number, code: string, message: string, requestId: string, details?: unknown) {
  return Response.json({ error: { code, message, requestId, ...(details ? { details } : {}) } }, { status, headers: { "x-request-id": requestId } });
}

export async function POST(request: Request) {
  const requestId = request.headers.get("x-request-id")?.slice(0, 100) || randomUUID();
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("application/json")) return errorResponse(415, "UNSUPPORTED_MEDIA_TYPE", "Use application/json", requestId);
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 256_000) return errorResponse(413, "PAYLOAD_TOO_LARGE", "Request body exceeds 256 KB", requestId);

  const authorization = request.headers.get("authorization");
  const key = request.headers.get("x-api-key") ?? (authorization?.startsWith("Bearer ") ? authorization.slice(7) : null);
  if (!key) return errorResponse(401, "API_KEY_REQUIRED", "Provide an API key", requestId);

  const verification = await auth.api.verifyApiKey({ body: { key } });
  if (!verification.valid || !verification.key) return errorResponse(401, "INVALID_API_KEY", "The API key is invalid or expired", requestId);

  let body: unknown;
  try { body = await request.json(); }
  catch { return errorResponse(400, "INVALID_JSON", "Request body must be valid JSON", requestId); }
  const parsed = sendEmailSchema.safeParse(body);
  if (!parsed.success) return errorResponse(422, "VALIDATION_ERROR", "Check the request fields", requestId, parsed.error.flatten());

  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (idempotencyKey && idempotencyKey.length > 200) return errorResponse(422, "INVALID_IDEMPOTENCY_KEY", "Idempotency-Key must not exceed 200 characters", requestId);

  try {
    const result = await sendOrganizationEmail(parsed.data, { organizationId: verification.key.referenceId, idempotencyKey });
    return Response.json({ data: result, requestId }, { status: result.duplicate ? 200 : 201, headers: { "x-request-id": requestId } });
  } catch (error) {
    if (error instanceof EmailServiceError) {
      const status = error.code === "SMTP_NOT_CONFIGURED" ? 409 : 502;
      return errorResponse(status, error.code, error.message, requestId);
    }
    return errorResponse(500, "INTERNAL_ERROR", "The email could not be processed", requestId);
  }
}
