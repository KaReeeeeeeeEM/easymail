export const openApiDocument = {
  openapi: "3.1.0",
  info: { title: "easymail API", version: "1.0.0", description: "Send messages through a verified SMTP sender for an easymail workspace." },
  servers: [{ url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000" }],
  paths: {
    "/api/v1/emails": {
      post: {
        operationId: "sendEmail", summary: "Send an email", security: [{ bearerAuth: [] }],
        parameters: [{ name: "Idempotency-Key", in: "header", schema: { type: "string", maxLength: 200 } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SendEmail" } } } },
        responses: { "201": { description: "Email accepted by the SMTP provider" }, "401": { description: "Missing or invalid API key" }, "422": { description: "Invalid request" }, "502": { description: "SMTP provider rejection" } },
      },
    },
    "/api/v1/emails/{id}": {
      get: {
        operationId: "getEmailStatus", summary: "Get SMTP request status", security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Organization-scoped request status" }, "401": { description: "Missing or invalid API key" }, "404": { description: "Request not found" } },
      },
    },
  },
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" } },
    schemas: { SendEmail: { type: "object", required: ["to", "subject"], anyOf: [{ required: ["text"] }, { required: ["html"] }], properties: { senderId: { type: "string", format: "uuid", description: "Verified SMTP sender ID; defaults to the workspace sender." }, to: { oneOf: [{ type: "string", format: "email" }, { type: "array", maxItems: 50, items: { type: "string", format: "email" } }] }, cc: { type: "array", items: { type: "string", format: "email" } }, bcc: { type: "array", items: { type: "string", format: "email" } }, replyTo: { type: "string", format: "email" }, subject: { type: "string", maxLength: 200 }, text: { type: "string" }, html: { type: "string" } } } },
  },
} as const;
