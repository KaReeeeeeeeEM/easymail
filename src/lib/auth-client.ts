"use client";

import { apiKeyClient } from "@better-auth/api-key/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient, organizationClient, twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    passkeyClient(),
    twoFactorClient({ twoFactorPage: "/two-factor" }),
    emailOTPClient(),
    organizationClient({ teams: { enabled: true } }),
    apiKeyClient(),
  ],
});
