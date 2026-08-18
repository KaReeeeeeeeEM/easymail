"use client";

import { useState } from "react";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";

type Workspace = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
};

export function WorkspaceSwitcher({
  organizations,
  activeOrganizationId,
}: {
  organizations: Workspace[];
  activeOrganizationId: string | null;
}) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const active =
    organizations.find(
      (organization) => organization.id === activeOrganizationId,
    ) ?? organizations[0];
  const atLimit = organizations.length >= 5;

  async function switchWorkspace(organizationId: string) {
    if (organizationId === activeOrganizationId || pending) return;
    setPending(true);
    try {
      const result = await authClient.organization.setActive({
        organizationId,
      });
      if (result.error)
        return toast.error(
          result.error.message ?? "Could not switch workspace.",
        );
      toast.success("Workspace switched.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Could not switch workspace.");
    } finally {
      setPending(false);
    }
  }

  async function createWorkspace(formData: FormData) {
    if (atLimit)
      return toast.error("You can create a maximum of 5 workspaces.");
    setPending(true);
    const name = String(formData.get("name")).trim();
    const slug = `${name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}-${crypto.randomUUID().slice(0, 6)}`;
    try {
      const result = await authClient.organization.create({ name, slug });
      if (result.error || !result.data)
        return toast.error(
          result.error?.message ?? "Could not create workspace.",
        );
      const selected = await authClient.organization.setActive({
        organizationId: result.data.id,
      });
      if (selected.error)
        return toast.error("Workspace created, but it could not be opened.");
      toast.success("Workspace created successfully.");
      setCreateOpen(false);
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Could not create workspace.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  data-onboarding="workspace-switcher"
                  size="lg"
                  tooltip={active?.name ?? "Select workspace"}
                  className="group-data-[collapsible=icon]:justify-center"
                />
              }
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Building2 />
              </span>
              <span className="min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
                <span className="block truncate font-medium">
                  {active?.name ?? "Select workspace"}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {organizations.length} of 5 workspaces
                </span>
              </span>
              <span className="shrink-0 group-data-[collapsible=icon]:hidden">
                {pending ? <Spinner /> : <ChevronsUpDown />}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={6}
              className="min-w-64"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                {organizations.map((organization) => (
                  <DropdownMenuItem
                    key={organization.id}
                    disabled={pending}
                    onClick={() => void switchWorkspace(organization.id)}
                  >
                    <Building2 />
                    <span className="min-w-0 flex-1 truncate">
                      {organization.name}
                    </span>
                    {organization.id === activeOrganizationId && <Check />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  disabled={atLimit || pending}
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus />
                  Create workspace
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {atLimit && (
                <p className="px-1.5 py-1 text-xs text-muted-foreground">
                  Maximum of 5 workspaces reached.
                </p>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => !pending && setCreateOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create workspace</DialogTitle>
            <DialogDescription>
              Create another workspace for a project or organization. You can
              create {5 - organizations.length} more.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void createWorkspace(new FormData(event.currentTarget));
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="sidebar-workspace-name">
                  Workspace name
                </FieldLabel>
                <Input
                  id="sidebar-workspace-name"
                  name="name"
                  placeholder="Acme Operations"
                  autoFocus
                  required
                  minLength={2}
                  maxLength={80}
                />
              </Field>
              <DialogFooter>
                <Button type="submit" disabled={pending}>
                  {pending ? <Spinner data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
                  {pending ? "Creating workspace…" : "Create workspace"}
                </Button>
              </DialogFooter>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
