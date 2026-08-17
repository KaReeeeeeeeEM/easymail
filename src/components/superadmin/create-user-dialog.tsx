"use client";

import { MailPlus, UserPlus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function CreateUserDialog() {
  const router = useRouter(); const [open, setOpen] = useState(false); const [pending, setPending] = useState(false);
  async function submit(formData: FormData) { setPending(true); try { const response = await fetch("/api/superadmin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: formData.get("name"), email: formData.get("email") }) }); const result = await response.json(); if (!response.ok) return toast.error(result.error?.message ?? "User could not be created."); toast.success("User created and temporary credentials emailed."); setOpen(false); router.refresh(); } catch { toast.error("User creation could not be completed."); } finally { setPending(false); } }
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button />}><UserPlus data-icon="inline-start" />Create user</DialogTrigger><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Create a managed user</DialogTitle><DialogDescription>A temporary password is generated securely and sent to the user. They must replace it on first sign-in.</DialogDescription></DialogHeader><form onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }}><FieldGroup><Field><FieldLabel htmlFor="managed-name">Full name</FieldLabel><Input id="managed-name" name="name" placeholder="Amina Mushi" autoComplete="off" required /></Field><Field><FieldLabel htmlFor="managed-email">Gmail address</FieldLabel><Input id="managed-email" name="email" type="email" pattern="[A-Za-z0-9._%+-]+@gmail[.]com" placeholder="amina@gmail.com" autoComplete="off" required /><FieldDescription>Managed users follow the same Gmail-only identity policy.</FieldDescription></Field></FieldGroup><DialogFooter className="mt-6"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>Cancel</Button><Button type="submit" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : <MailPlus data-icon="inline-start" />}{pending ? "Creating and emailing…" : "Create and email credentials"}</Button></DialogFooter></form></DialogContent></Dialog>;
}
