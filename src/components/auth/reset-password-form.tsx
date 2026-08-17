"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/password-input";
import { Spinner } from "@/components/ui/spinner";

export function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const token = params.get("token");
  async function submit(formData: FormData) {
    if (!token) return;
    const password = String(formData.get("password"));
    const confirmation = String(formData.get("confirmation"));
    if (password !== confirmation) { toast.error("Passwords do not match."); return; }
    setPending(true);
    const result = await authClient.resetPassword({ newPassword: password, token }).finally(() => setPending(false));
    if (result.error) { toast.error(result.error.message ?? "The reset link is invalid or expired."); return; }
    toast.success("Password updated. You can now sign in.");
    router.push("/sign-in");
  }
  if (!token) return <Field data-invalid><FieldError>This password reset link is missing or invalid.</FieldError></Field>;
  return <form action={submit}><FieldGroup><Field><FieldLabel htmlFor="new-password">New password</FieldLabel><PasswordInput id="new-password" name="password" autoComplete="new-password" placeholder="Enter at least 10 characters" minLength={10} maxLength={128} required /></Field><Field><FieldLabel htmlFor="confirmation">Confirm password</FieldLabel><PasswordInput id="confirmation" name="confirmation" autoComplete="new-password" placeholder="Repeat your new password" minLength={10} maxLength={128} required /></Field><Button type="submit" disabled={pending}>{pending && <Spinner data-icon="inline-start" />}{pending ? "Resetting password…" : "Reset password"}</Button></FieldGroup></form>;
}
