"use client";

import { useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  async function submit(formData: FormData) {
    setPending(true);
    await authClient.requestPasswordReset({ email: String(formData.get("email")), redirectTo: `${window.location.origin}/reset-password` });
    setPending(false);
    toast.success("If that account exists, recovery instructions are on the way.");
  }
  return <form action={submit}><FieldGroup><Field><FieldLabel htmlFor="recovery-email">Gmail address</FieldLabel><Input id="recovery-email" name="email" type="email" autoComplete="email" placeholder="you@gmail.com" pattern="[^\\s@]+@gmail\\.com" title="Use a Gmail address ending in @gmail.com" required /></Field><Button type="submit" disabled={pending}>{pending && <LoaderCircle data-icon="inline-start" className="animate-spin" />}Send recovery instructions</Button><FieldDescription className="text-center"><Link href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">Back to sign in</Link></FieldDescription></FieldGroup></form>;
}
