import "server-only";

import { apiKey } from "@better-auth/api-key";
import { passkey } from "@better-auth/passkey";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  emailOTP,
  openAPI,
  organization,
  twoFactor,
} from "better-auth/plugins";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";
import { smtpConfiguration } from "@/db/schema";
import { normalizeGmailAddress as validateGmailAddress } from "@/lib/gmail-address";
import { adminAccess, adminRoles } from "@/lib/admin-access";

export const LEGAL_VERSION = "2026-08-17";

function normalizeGmailAddress(email: string) {
  try {
    return validateGmailAddress(email);
  } catch {
    throw new APIError("BAD_REQUEST", {
      message: "Use a valid Gmail address ending in @gmail.com.",
    });
  }
}

export const auth = betterAuth({
  appName: "easymail",
  database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
      mustChangePassword: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      acceptedTerms: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: true,
      },
      acceptedPrivacy: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: true,
      },
      legalAcceptedAt: { type: "date", required: false, input: false },
      legalVersion: { type: "string", required: false, input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            email: normalizeGmailAddress(user.email),
            twoFactorEnabled: true,
            ...(user.acceptedTerms && user.acceptedPrivacy
              ? { legalAcceptedAt: new Date(), legalVersion: LEGAL_VERSION }
              : {}),
          },
        }),
        after: async (user) => {
          await db.insert(authSchema.twoFactor).values({
            id: randomUUID(),
            userId: user.id,
            secret: randomUUID(),
            backupCodes: "[]",
            verified: true,
          });
        },
      },
      update: {
        before: async (user) => ({
          data: {
            ...user,
            ...(user.email ? { email: normalizeGmailAddress(user.email) } : {}),
          },
        }),
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 900,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      const { sendPasswordResetEmail } =
        await import("@/features/email/infrastructure/platform-mailer");
      await sendPasswordResetEmail({ email: user.email, name: user.name, url });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { sendVerificationEmail } =
        await import("@/features/email/infrastructure/platform-mailer");
      await sendVerificationEmail({ email: user.email, name: user.name, url });
    },
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 60,
    customRules: {
      "/api/auth/sign-up/email": { window: 60, max: 3 },
      "/api/auth/sign-in/email": { window: 60, max: 5 },
      "/api/auth/request-password-reset": { window: 900, max: 3 },
      "/api/auth/reset-password": { window: 900, max: 5 },
      "/api/auth/send-verification-email": { window: 300, max: 3 },
      "/api/auth/two-factor/send-otp": { window: 60, max: 3 },
      "/api/auth/two-factor/verify-otp": { window: 600, max: 5 },
      "/api/auth/email-otp/send-verification-otp": { window: 60, max: 3 },
      "/api/auth/email-otp/verify-email": { window: 600, max: 5 },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (context) => {
      if (context.path === "/sign-up/email") {
        const body = context.body as
          { acceptedTerms?: boolean; acceptedPrivacy?: boolean } | undefined;
        if (body?.acceptedTerms !== true || body?.acceptedPrivacy !== true) {
          throw new APIError("BAD_REQUEST", {
            message:
              "You must agree to the Terms and Privacy Policy before creating an account.",
          });
        }
      }
      if (context.path === "/two-factor/disable") {
        throw new APIError("FORBIDDEN", {
          message:
            "Email two-factor authentication is required for every account.",
        });
      }
    }),
    after: createAuthMiddleware(async (context) => {
      const session = context.context.session;
      if (context.path === "/admin/impersonate-user" && session?.user) {
        const targetUserId = (context.body as { userId?: string } | undefined)
          ?.userId;
        const { recordAuditLog } = await import("@/lib/audit");
        await recordAuditLog({
          action: "USER_IMPERSONATION_STARTED",
          entity: "user",
          entityId: targetUserId,
          description:
            "Super administrator entered a user session for delegated support.",
          actorId: session.user.id,
          actorEmail: session.user.email,
          metadata: { targetUserId },
        });
      }
      if (context.path === "/two-factor/verify-otp" && session?.user) {
        const { recordAuditLog } = await import("@/lib/audit");
        await recordAuditLog({
          action: "AUTH_LOGIN",
          entity: "session",
          description: "User completed email two-factor authentication.",
          actorId: session.user.id,
          actorEmail: session.user.email,
        });
      }
      if (context.path !== "/api-key/create") return;
      const body = context.body as
        | {
            name?: string;
            organizationId?: string;
            metadata?: { senderId?: string };
          }
        | undefined;
      const organizationId = body?.organizationId;
      const senderId = body?.metadata?.senderId;
      if (!session?.user || !organizationId || !senderId) return;
      try {
        const [workspace] = await db
          .select({ name: authSchema.organization.name })
          .from(authSchema.organization)
          .where(eq(authSchema.organization.id, organizationId))
          .limit(1);
        const [sender] = await db
          .select({ label: smtpConfiguration.label })
          .from(smtpConfiguration)
          .where(
            and(
              eq(smtpConfiguration.id, senderId),
              eq(smtpConfiguration.organizationId, organizationId),
            ),
          )
          .limit(1);
        if (!workspace || !sender) return;
        const { sendApiKeyCreatedEmail } =
          await import("@/features/email/infrastructure/platform-mailer");
        await sendApiKeyCreatedEmail({
          email: session.user.email,
          name: session.user.name,
          keyName: body.name ?? "Unnamed key",
          workspaceName: workspace.name,
          senderLabel: sender.label,
        });
        const { recordAuditLog } = await import("@/lib/audit");
        await recordAuditLog({
          action: "API_KEY_CREATED",
          entity: "api_key",
          description: `Created API key ${body.name ?? "Unnamed key"} for ${workspace.name}.`,
          actorId: session.user.id,
          actorEmail: session.user.email,
          metadata: { organizationId, senderId },
        });
      } catch (error) {
        console.error("Failed to send API key creation notification", error);
      }
    }),
  },
  plugins: [
    admin({
      ac: adminAccess,
      roles: adminRoles,
      defaultRole: "USER",
      impersonationSessionDuration: 60 * 30,
    }),
    passkey({
      rpName: "easymail",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        residentKey: "preferred",
        userVerification: "required",
      },
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 5,
      storeOTP: "encrypted",
      resendStrategy: "rotate",
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      rateLimit: { window: 60, max: 3 },
      sendVerificationOTP: async ({ email, otp, type }) => {
        normalizeGmailAddress(email);
        if (type !== "email-verification") return;
        const { sendAccountVerificationCodeEmail } =
          await import("@/features/email/infrastructure/platform-mailer");
        await sendAccountVerificationCodeEmail({ email, otp });
      },
    }),
    twoFactor({
      issuer: "easymail",
      totpOptions: { disable: true },
      otpOptions: {
        digits: 6,
        period: 5,
        allowedAttempts: 5,
        storeOTP: "encrypted",
        sendOTP: async ({ user, otp }) => {
          normalizeGmailAddress(user.email);
          const { sendTwoFactorCodeEmail } =
            await import("@/features/email/infrastructure/platform-mailer");
          await sendTwoFactorCodeEmail({
            email: user.email,
            name: user.name,
            otp,
          });
        },
      },
      twoFactorCookieMaxAge: 600,
      trustDeviceMaxAge: 0,
      accountLockout: {
        enabled: true,
        maxFailedAttempts: 5,
        durationSeconds: 900,
      },
    }),
    organization({
      organizationLimit: 5,
      teams: { enabled: true },
    }),
    apiKey({
      references: "organization",
      defaultPrefix: "gms_",
      requireName: true,
      enableMetadata: true,
      rateLimit: { enabled: true, timeWindow: 60_000, maxRequests: 60 },
    }),
    openAPI(),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
