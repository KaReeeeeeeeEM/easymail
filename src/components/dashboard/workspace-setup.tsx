"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function WorkspaceSetup() {
  const router = useRouter(); const [pending, setPending] = useState(false); const [error, setError] = useState("");
  async function create(formData: FormData) {
    setPending(true); setError("");
    const name = String(formData.get("name"));
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const result = await authClient.organization.create({ name, slug });
    if (result.error || !result.data) { setPending(false); return setError(result.error?.message ?? "Could not create workspace"); }
    await authClient.organization.setActive({ organizationId: result.data.id });
    router.refresh();
  }
  return <Card className="max-w-xl"><CardHeader><CardTitle>Create your first workspace</CardTitle><CardDescription>Use your name for a personal service or your organization name for a shared service.</CardDescription></CardHeader><CardContent><form action={create}><FieldGroup><Field><FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel><Input id="workspace-name" name="name" placeholder="Acme Operations" required minLength={2} maxLength={80} /></Field>{error && <Field data-invalid><FieldError>{error}</FieldError></Field>}<Button disabled={pending}>{pending && <LoaderCircle data-icon="inline-start" className="animate-spin" />}Create workspace</Button></FieldGroup></form></CardContent></Card>;
}
