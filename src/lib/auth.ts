import "server-only";

import { apiKey } from "@better-auth/api-key";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { openAPI, organization } from "better-auth/plugins";

import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";

export const auth = betterAuth({
  appName: "easymail",
  database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
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
  rateLimit: { enabled: true, window: 60, max: 100 },
  plugins: [
    organization({ teams: { enabled: true } }),
    apiKey({
      references: "organization",
      defaultPrefix: "gms_",
      requireName: true,
      rateLimit: { enabled: true, timeWindow: 60_000, maxRequests: 60 },
    }),
    openAPI(),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
