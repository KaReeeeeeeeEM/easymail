"use client";

import { apiKeyClient } from "@better-auth/api-key/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/react";
import { adminClient, emailOTPClient, organizationClient, twoFactorClient } from "better-auth/client/plugins";
import { adminAccess, adminRoles } from "@/lib/admin-access";

export const authClient = createAuthClient({
  plugins: [
    adminClient({ ac: adminAccess, roles: adminRoles }),
    passkeyClient(),
    twoFactorClient({ twoFactorPage: "/two-factor" }),
    emailOTPClient(),
    organizationClient({ teams: { enabled: true } }),
    apiKeyClient(),
  ],
});
