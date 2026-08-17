import { z } from "zod";

const emailAddress = z.string().email().max(320);
const attachment = z.object({
  filename: z.string().trim().min(1).max(255),
  content: z.string().max(4_000_000),
  contentType: z.string().trim().max(100).optional(),
}).strict();

export const sendEmailSchema = z.object({
  senderId: z.string().uuid().optional(),
  to: z.union([emailAddress, z.array(emailAddress).min(1).max(50)]),
  cc: z.array(emailAddress).max(20).optional(),
  bcc: z.array(emailAddress).max(20).optional(),
  replyTo: emailAddress.optional(),
  subject: z.string().trim().min(1).max(200),
  text: z.string().max(200_000).optional(),
  html: z.string().max(200_000).optional(),
  attachments: z.array(attachment).max(3).optional(),
}).strict().refine((value) => value.text || value.html, {
  message: "Provide at least one of text or html",
  path: ["text"],
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;
