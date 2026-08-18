"use client";

import { EllipsisVertical, Eye, Pencil, ShieldBan, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { DeleteConfirmDialog, UpdateConfirmDialog } from "@/components/confirm-action-dialog";
import { DetailTable } from "@/components/detail-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  banned: boolean | null;
  banReason: string | null;
  createdAt: Date;
};

export function UserRowActions({ item }: { item: ManagedUser }) {
  const router = useRouter();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [accessConfirmOpen, setAccessConfirmOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState(item.name);
  const [pending, setPending] = useState(false);
  const isAdmin = item.role === "SUPER_ADMIN";

  async function mutate(method: "PATCH" | "DELETE", body: Record<string, string>) {
    setPending(true);
    try {
      const response = await fetch("/api/superadmin/users", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "The action could not be completed.");
      toast.success(method === "DELETE" ? "User deleted permanently." : body.action === "restrict" ? "User restricted and signed out." : body.action === "restore" ? "User access restored." : "User details updated.");
      setEditOpen(false);
      setEditConfirmOpen(false);
      setAccessConfirmOpen(false);
      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The action could not be completed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${item.name}`} />}>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setViewOpen(true)}><Eye />View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setName(item.name); setEditOpen(true); }}><Pencil />Edit</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled={isAdmin} onClick={() => setAccessConfirmOpen(true)}>
              {item.banned ? <ShieldCheck /> : <ShieldBan />}
              {item.banned ? "Enable user" : "Restrict user"}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" disabled={isAdmin} onClick={() => setDeleteOpen(true)}><Trash2 />Delete user</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader><DialogTitle className="font-bold text-primary">{item.name}</DialogTitle><DialogDescription>Account identity, access, and security information.</DialogDescription></DialogHeader>
          <Tabs defaultValue="overview">
            <TabsList variant="line"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger></TabsList>
            <TabsContent value="overview"><DetailTable rows={[{ label: "Email", value: item.email }, { label: "Role", value: item.role }, { label: "Access", value: item.banned ? "Restricted" : "Enabled" }]} /></TabsContent>
            <TabsContent value="security"><DetailTable rows={[{ label: "Email status", value: item.emailVerified ? "Verified" : "Pending" }, { label: "Restriction reason", value: item.banReason ?? "Not restricted" }, { label: "Joined", value: item.createdAt.toLocaleString() }]} /></TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-bold text-primary">Edit user</DialogTitle><DialogDescription>Update the account name. The verified Gmail identity remains unchanged.</DialogDescription></DialogHeader>
          <form onSubmit={(event) => { event.preventDefault(); setEditConfirmOpen(true); }}>
            <FieldGroup><Field><FieldLabel htmlFor={`edit-user-${item.id}`}>Full name</FieldLabel><Input id={`edit-user-${item.id}`} value={name} onChange={(event) => setName(event.target.value)} placeholder="User's full name" minLength={2} maxLength={100} required /></Field></FieldGroup>
            <DialogFooter className="mt-6"><Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button><Button type="submit" disabled={pending}><Pencil data-icon="inline-start" />Review update</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <UpdateConfirmDialog open={editConfirmOpen} onOpenChange={setEditConfirmOpen} entityName={item.name} pending={pending} onConfirm={() => mutate("PATCH", { action: "edit", userId: item.id, name })} />
      <UpdateConfirmDialog open={accessConfirmOpen} onOpenChange={setAccessConfirmOpen} entityName={`access for ${item.name}`} pending={pending} onConfirm={() => mutate("PATCH", { action: item.banned ? "restore" : "restrict", userId: item.id })} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} entityName={item.name} pending={pending} onConfirm={() => mutate("DELETE", { userId: item.id })} />
      {pending && <span className="sr-only"><Spinner />Processing user action</span>}
    </>
  );
}
