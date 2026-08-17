"use client";

import { useState } from "react";
import { Building2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function WorkspaceSetup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function create(formData: FormData) {
    setPending(true);
    const name = String(formData.get("name")).trim();
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${crypto.randomUUID().slice(0, 6)}`;
    try {
      const result = await authClient.organization.create({ name, slug });
      if (result.error || !result.data) return toast.error(result.error?.message ?? "You can create a maximum of 5 workspaces.");
      const active = await authClient.organization.setActive({ organizationId: result.data.id });
      if (active.error) return toast.error(active.error.message ?? "Workspace was created but could not be opened.");
      toast.success("Workspace created successfully.");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Could not create workspace. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return <Dialog open={open} onOpenChange={(nextOpen) => !pending && setOpen(nextOpen)}>
    <Empty className="min-h-[420px] border bg-card/40">
      <EmptyHeader><EmptyMedia variant="icon"><Building2 /></EmptyMedia><EmptyTitle>No workspace yet</EmptyTitle><EmptyDescription>Create a personal or organization workspace to configure senders, issue API keys, and view your delivery overview.</EmptyDescription></EmptyHeader>
      <EmptyContent><DialogTrigger render={<Button />}><Plus data-icon="inline-start" />Create workspace</DialogTrigger></EmptyContent>
    </Empty>
    <DialogContent>
      <DialogHeader><DialogTitle>Create your first workspace</DialogTitle><DialogDescription>Use your name for a personal service or your organization name for a shared service. Each account can create up to 5 workspaces.</DialogDescription></DialogHeader>
      <form onSubmit={(event) => { event.preventDefault(); void create(new FormData(event.currentTarget)); }}>
        <FieldGroup><Field><FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel><Input id="workspace-name" name="name" placeholder="Acme Operations" autoFocus required minLength={2} maxLength={80} /></Field><DialogFooter><Button type="submit" disabled={pending}>{pending && <Spinner data-icon="inline-start" />}{pending ? "Creating workspace…" : "Create workspace"}</Button></DialogFooter></FieldGroup>
      </form>
    </DialogContent>
  </Dialog>;
}
