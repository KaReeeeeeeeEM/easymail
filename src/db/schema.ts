import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { organization, user } from "./auth-schema";

export const deliveryStatus = pgEnum("delivery_status", [
  "pending",
  "sent",
  "failed",
]);

export const smtpConfiguration = pgTable(
  "smtp_configuration",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
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
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("smtp_configuration_org_idx").on(table.organizationId),
    uniqueIndex("smtp_configuration_org_label_uq").on(
      table.organizationId,
      table.label,
    ),
  ],
);

export const emailDelivery = pgTable(
  "email_delivery",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    smtpConfigurationId: uuid("smtp_configuration_id").references(
      () => smtpConfiguration.id,
      { onDelete: "set null" },
    ),
    idempotencyKey: text("idempotency_key"),
    status: deliveryStatus("status").default("pending").notNull(),
    recipients: jsonb("recipients").$type<string[]>().notNull(),
    subject: text("subject").notNull(),
    textBody: text("text_body"),
    htmlBody: text("html_body"),
    ccRecipients: jsonb("cc_recipients")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    attachmentNames: jsonb("attachment_names")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    providerMessageId: text("provider_message_id"),
    acceptedRecipients: jsonb("accepted_recipients")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    rejectedRecipients: jsonb("rejected_recipients")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    providerResponse: text("provider_response"),
    errorCode: text("error_code"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("email_delivery_org_idempotency_uq")
      .on(table.organizationId, table.idempotencyKey)
      .where(sql`${table.idempotencyKey} is not null`),
    index("email_delivery_org_created_idx").on(
      table.organizationId,
      table.createdAt,
    ),
  ],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    description: text("description").notNull(),
    actorId: text("actor_id"),
    actorEmail: text("actor_email").notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("audit_log_created_idx").on(table.createdAt),
    index("audit_log_actor_idx").on(table.actorId),
  ],
);

export const generatedReport = pgTable(
  "generated_report",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: text("type").notNull(),
    title: text("title").notNull(),
    status: text("status").default("ready").notNull(),
    format: text("format").default("csv").notNull(),
    rowCount: integer("row_count").default(0).notNull(),
    data: jsonb("data")
      .$type<Array<Record<string, string | number | boolean | null>>>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    generatedBy: text("generated_by")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    generatedByEmail: text("generated_by_email").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("generated_report_created_idx").on(table.createdAt)],
);

export const onboardingPageVisit = pgTable(
  "onboarding_page_visit",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    pageKey: text("page_key").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("onboarding_page_user_uq").on(table.userId, table.pageKey),
    index("onboarding_page_user_idx").on(table.userId),
  ],
);

export const adminNotification = pgTable(
  "admin_notification",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: text("type").default("info").notNull(),
    entity: text("entity"),
    entityId: text("entity_id"),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("admin_notification_user_created_idx").on(
      table.userId,
      table.createdAt,
    ),
  ],
);
