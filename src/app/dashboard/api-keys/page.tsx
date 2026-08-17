import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function ApiKeysPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders }); const organizationId = session?.session.activeOrganizationId;
  const result = organizationId ? await auth.api.listApiKeys({ headers: requestHeaders, query: { organizationId } }) : null;
  return <div className="flex flex-col gap-6"><div><p className="text-sm font-medium text-primary">Developer access</p><h1 className="text-3xl font-semibold tracking-tight">API keys</h1></div>{organizationId ? <ApiKeyManager organizationId={organizationId} initialKeys={(result?.apiKeys ?? []) as Parameters<typeof ApiKeyManager>[0]["initialKeys"]} /> : <Alert><AlertTitle>No active workspace</AlertTitle><AlertDescription>Create a workspace from the overview first.</AlertDescription></Alert>}</div>;
}
