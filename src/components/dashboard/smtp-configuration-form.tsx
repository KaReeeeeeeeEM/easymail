"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { configureSmtp } from "@/features/email/application/configure-smtp";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SmtpConfigurationForm({ label = "Add sender", variant = "default" }: { label?: string; variant?: "default" | "outline" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [pending, setPending] = useState(false);
  async function submit(formData: FormData) {
    setPending(true);
    try {
      const result = await configureSmtp(formData);
      if (!result.success) return toast.error(result.message);
      toast.success(result.message);
      setOpen(false); setStep(1); router.refresh();
    } catch { toast.error("Could not verify the sender. Please check the connection and try again."); }
    finally { setPending(false); }
  }
  return <Dialog open={open} onOpenChange={(next) => { if (!pending) { setOpen(next); if (!next) setStep(1); } }}>
    <DialogTrigger render={<Button variant={variant} />}><Plus data-icon="inline-start" />{label}</DialogTrigger>
    <DialogContent className="sm:max-w-xl">
      <DialogHeader><DialogTitle>Add an SMTP sender</DialogTitle><DialogDescription>Complete three short steps. The connection is verified before encrypted credentials are stored.</DialogDescription></DialogHeader>
      <Tabs value={String(step)}><TabsList variant="line" className="w-full"><TabsTrigger value="1">Identity</TabsTrigger><TabsTrigger value="2">Connection</TabsTrigger><TabsTrigger value="3">Credentials</TabsTrigger></TabsList></Tabs>
      <form onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }}>
        <div className={step === 1 ? "animate-in fade-in slide-in-from-right-2 duration-300" : "hidden"}><FieldGroup><Field><FieldLabel htmlFor="label">Configuration name</FieldLabel><Input id="label" name="label" placeholder="Production SMTP" required /></Field><Field><FieldLabel htmlFor="senderName">Sender name</FieldLabel><Input id="senderName" name="senderName" placeholder="Acme Support" required /></Field><Field><FieldLabel htmlFor="senderEmail">From email</FieldLabel><Input id="senderEmail" name="senderEmail" type="email" placeholder="support@acme.com" required /></Field></FieldGroup></div>
        <div className={step === 2 ? "animate-in fade-in slide-in-from-right-2 duration-300" : "hidden"}><FieldGroup><Field><FieldLabel htmlFor="host">SMTP host</FieldLabel><Input id="host" name="host" placeholder="smtp.gmail.com" required /></Field><Field><FieldLabel htmlFor="port">SMTP port</FieldLabel><Input id="port" name="port" type="number" min="1" max="65535" defaultValue="465" placeholder="465" required /></Field><Field><FieldLabel htmlFor="secure">Connection security</FieldLabel><select id="secure" name="secure" defaultValue="true" className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"><option value="true">SSL/TLS (usually port 465)</option><option value="false">STARTTLS (usually port 587)</option></select></Field></FieldGroup></div>
        <div className={step === 3 ? "animate-in fade-in slide-in-from-right-2 duration-300" : "hidden"}><FieldGroup><Field><FieldLabel htmlFor="username">SMTP username</FieldLabel><Input id="username" name="username" autoComplete="username" placeholder="support@acme.com" required /></Field><Field><FieldLabel htmlFor="password">SMTP password</FieldLabel><PasswordInput id="password" name="password" autoComplete="new-password" placeholder="App password or SMTP password" required /></Field><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isDefault" className="accent-primary" /> Use as the default sender</label><FieldDescription>Credentials are verified before the encrypted password is stored.</FieldDescription></FieldGroup></div>
        <DialogFooter className="mt-6"><Button type="button" variant="outline" disabled={step === 1 || pending} onClick={() => setStep((value) => value - 1)}><ArrowLeft data-icon="inline-start" />Back</Button>{step < 3 ? <Button type="button" onClick={() => setStep((value) => value + 1)}>Continue<ArrowRight data-icon="inline-end" /></Button> : <Button type="submit" disabled={pending}>{pending && <Spinner data-icon="inline-start" />}{pending ? "Verifying sender…" : "Verify and save sender"}</Button>}</DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;
}
