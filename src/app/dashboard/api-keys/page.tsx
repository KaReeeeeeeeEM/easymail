import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ApiKeysPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders }); const organizationId = session?.session.activeOrganizationId;
  const result = organizationId ? await auth.api.listApiKeys({ headers: requestHeaders, query: { organizationId } }) : null;
  return <div className="flex flex-col gap-8"><PageHeading eyebrow="Developer access" title="API keys" description="Create, search, rotate, and revoke the credentials your applications use." action={<Button render={<Link href="#create-key" />}><Plus data-icon="inline-start" />Create key</Button>} />{organizationId ? <ApiKeyManager organizationId={organizationId} initialKeys={(result?.apiKeys ?? []) as Parameters<typeof ApiKeyManager>[0]["initialKeys"]} /> : <Alert><AlertTitle>No active workspace</AlertTitle><AlertDescription>Create a workspace from the overview first.</AlertDescription></Alert>}</div>;
}
