"use client";

import { apiKeyClient } from "@better-auth/api-key/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
  organizationClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { adminAccess, adminRoles } from "@/lib/admin-access";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        acceptedTerms: {
          type: "boolean",
          required: false,
          defaultValue: false,
        },
        acceptedPrivacy: {
          type: "boolean",
          required: false,
          defaultValue: false,
        },
        legalAcceptedAt: { type: "date", required: false, input: false },
        legalVersion: { type: "string", required: false, input: false },
      },
    }),
    adminClient({ ac: adminAccess, roles: adminRoles }),
    passkeyClient(),
    twoFactorClient({ twoFactorPage: "/two-factor" }),
    emailOTPClient(),
    organizationClient({ teams: { enabled: true } }),
    apiKeyClient(),
  ],
});
