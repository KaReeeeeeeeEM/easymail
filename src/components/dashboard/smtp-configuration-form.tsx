"use client";

import { useState } from "react";
import { toast } from "sonner";

import { configureSmtp } from "@/features/email/application/configure-smtp";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { Spinner } from "@/components/ui/spinner";

export function SmtpConfigurationForm() {
  const [pending, setPending] = useState(false);
  async function submit(formData: FormData) {
    setPending(true);
    try {
      const result = await configureSmtp(formData);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    } finally {
      setPending(false);
    }
  }
  return (
    <form onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }}>
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field><FieldLabel htmlFor="label">Configuration name</FieldLabel><Input id="label" name="label" placeholder="Production SMTP" required /></Field>
          <Field><FieldLabel htmlFor="senderName">Sender name</FieldLabel><Input id="senderName" name="senderName" placeholder="Acme Support" required /></Field>
          <Field><FieldLabel htmlFor="senderEmail">From email</FieldLabel><Input id="senderEmail" name="senderEmail" type="email" placeholder="support@acme.com" required /></Field>
          <Field><FieldLabel htmlFor="host">SMTP host</FieldLabel><Input id="host" name="host" placeholder="smtp.gmail.com" required /></Field>
          <Field><FieldLabel htmlFor="port">SMTP port</FieldLabel><Input id="port" name="port" type="number" min="1" max="65535" defaultValue="465" placeholder="465" required /></Field>
          <Field><FieldLabel htmlFor="secure">Connection security</FieldLabel><select id="secure" name="secure" defaultValue="true" className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"><option value="true">SSL/TLS (usually port 465)</option><option value="false">STARTTLS (usually port 587)</option></select></Field>
          <Field><FieldLabel htmlFor="username">SMTP username</FieldLabel><Input id="username" name="username" autoComplete="username" placeholder="support@acme.com" required /></Field>
          <Field><FieldLabel htmlFor="password">SMTP password</FieldLabel><PasswordInput id="password" name="password" autoComplete="new-password" placeholder="App password or SMTP password" required /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isDefault" className="accent-primary" /> Use as the default sender</label>
        <FieldDescription>Credentials are verified with the SMTP server before the encrypted password is stored.</FieldDescription>
        <Button type="submit" disabled={pending}>{pending && <Spinner data-icon="inline-start" />}{pending ? "Verifying sender…" : "Verify and save sender"}</Button>
      </FieldGroup>
    </form>
  );
}
