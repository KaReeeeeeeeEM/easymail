"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [pending, setPending] = useState(false);
  async function submit(formData: FormData) {
    setPending(true);
    try {
      const nextName = String(formData.get("name")).trim();
      const result = await authClient.updateUser({ name: nextName });
      if (result.error) return toast.error(result.error.message ?? "Could not update your profile.");
      toast.success("Profile updated successfully.");
    } catch { toast.error("Could not update your profile. Please try again."); }
    finally { setPending(false); }
  }
  return <form onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }}><FieldGroup>
    <Field><FieldLabel htmlFor="profile-name">Full name</FieldLabel><Input id="profile-name" name="name" defaultValue={name} placeholder="Your full name" minLength={2} required /></Field>
    <Field data-disabled><FieldLabel htmlFor="profile-email">Gmail address</FieldLabel><Input id="profile-email" value={email} placeholder="you@gmail.com" disabled /><FieldDescription>Your verified Gmail address is the identity for this account.</FieldDescription></Field>
    <Button type="submit" disabled={pending}>{pending && <Spinner data-icon="inline-start" />}{pending ? "Saving…" : "Save profile"}</Button>
  </FieldGroup></form>;
}
