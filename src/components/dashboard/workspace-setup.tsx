"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function WorkspaceSetup() {
  const router = useRouter(); const [pending, setPending] = useState(false);
  async function create(formData: FormData) {
    setPending(true);
    const name = String(formData.get("name"));
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    try {
      const result = await authClient.organization.create({ name, slug });
      if (result.error || !result.data) {
        const message = result.error?.message ?? "Could not create workspace";
        toast.error(message);
        return;
      }
      await authClient.organization.setActive({ organizationId: result.data.id });
      toast.success("Workspace created successfully.");
      router.refresh();
    } finally {
      setPending(false);
    }
  }
  return <Card className="max-w-xl"><CardHeader><CardTitle>Create your first workspace</CardTitle><CardDescription>Use your name for a personal service or your organization name for a shared service.</CardDescription></CardHeader><CardContent><form onSubmit={(event) => { event.preventDefault(); void create(new FormData(event.currentTarget)); }}><FieldGroup><Field><FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel><Input id="workspace-name" name="name" placeholder="Acme Operations" required minLength={2} maxLength={80} /></Field><Button disabled={pending}>{pending && <Spinner data-icon="inline-start" />}{pending ? "Creating workspace…" : "Create workspace"}</Button></FieldGroup></form></CardContent></Card>;
}
