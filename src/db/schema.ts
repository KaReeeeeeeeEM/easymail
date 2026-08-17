import { sql } from "drizzle-orm";
import { boolean, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { organization } from "./auth-schema";

export const deliveryStatus = pgEnum("delivery_status", ["pending", "sent", "failed"]);

export const smtpConfiguration = pgTable("smtp_configuration", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  label: text("label").default("Primary sender").notNull(),
  host: text("host").default("smtp.gmail.com").notNull(),
  port: integer("port").default(465).notNull(),
  secure: boolean("secure").default(true).notNull(),
  senderName: text("sender_name").notNull(),
  senderEmail: text("sender_email").notNull(),
  username: text("username").notNull(),
  encryptedPassword: text("encrypted_password").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("smtp_configuration_org_idx").on(table.organizationId),
  uniqueIndex("smtp_configuration_org_label_uq").on(table.organizationId, table.label),
]);

export const emailDelivery = pgTable("email_delivery", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  smtpConfigurationId: uuid("smtp_configuration_id").references(() => smtpConfiguration.id, { onDelete: "set null" }),
  idempotencyKey: text("idempotency_key"),
  status: deliveryStatus("status").default("pending").notNull(),
  recipients: jsonb("recipients").$type<string[]>().notNull(),
  subject: text("subject").notNull(),
  providerMessageId: text("provider_message_id"),
  acceptedRecipients: jsonb("accepted_recipients").$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  rejectedRecipients: jsonb("rejected_recipients").$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  providerResponse: text("provider_response"),
  errorCode: text("error_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
}, (table) => [
  uniqueIndex("email_delivery_org_idempotency_uq")
    .on(table.organizationId, table.idempotencyKey)
    .where(sql`${table.idempotencyKey} is not null`),
  index("email_delivery_org_created_idx").on(table.organizationId, table.createdAt),
]);

export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  description: text("description").notNull(),
  actorId: text("actor_id"),
  actorEmail: text("actor_email").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("audit_log_created_idx").on(table.createdAt), index("audit_log_actor_idx").on(table.actorId)]);
