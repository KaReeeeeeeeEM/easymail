import "server-only";

import { apiKey } from "@better-auth/api-key";
import { passkey } from "@better-auth/passkey";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { emailOTP, openAPI, organization, twoFactor } from "better-auth/plugins";
import { randomUUID } from "node:crypto";

import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";
import { normalizeGmailAddress as validateGmailAddress } from "@/lib/gmail-address";

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
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            email: normalizeGmailAddress(user.email),
            twoFactorEnabled: true,
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
            twoFactorEnabled: true,
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
      const { sendPasswordResetEmail } = await import("@/features/email/infrastructure/platform-mailer");
      await sendPasswordResetEmail({ email: user.email, name: user.name, url });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { sendVerificationEmail } = await import("@/features/email/infrastructure/platform-mailer");
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
      if (context.path === "/two-factor/disable") {
        throw new APIError("FORBIDDEN", {
          message: "Email two-factor authentication is required for every account.",
        });
      }
    }),
  },
  plugins: [
    passkey({
      rpName: "easymail",
      authenticatorSelection: { authenticatorAttachment: "platform", residentKey: "preferred", userVerification: "required" },
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
        const { sendAccountVerificationCodeEmail } = await import("@/features/email/infrastructure/platform-mailer");
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
          const { sendTwoFactorCodeEmail } = await import("@/features/email/infrastructure/platform-mailer");
          await sendTwoFactorCodeEmail({ email: user.email, name: user.name, otp });
        },
      },
      twoFactorCookieMaxAge: 600,
      trustDeviceMaxAge: 0,
      accountLockout: { enabled: true, maxFailedAttempts: 5, durationSeconds: 900 },
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
