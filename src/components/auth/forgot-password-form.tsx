"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Mail } from "lucide-react";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  async function submit(formData: FormData) {
    setPending(true);
    try {
      await authClient.requestPasswordReset({
        email: String(formData.get("email")),
        redirectTo: `${window.location.origin}/reset-password`,
      });
      toast.success(
        "If that account exists, recovery instructions are on the way.",
      );
    } catch {
      toast.error("Could not request recovery instructions. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit(new FormData(event.currentTarget));
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="recovery-email">Gmail address</FieldLabel>
          <Input
            id="recovery-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@gmail.com"
            pattern="[A-Za-z0-9._%+-]+@gmail[.]com"
            title="Use a Gmail address ending in @gmail.com"
            required
          />
        </Field>
        <Button type="submit" disabled={pending}>
        {pending ? <Spinner data-icon="inline-start" /> : <Mail data-icon="inline-start" />}
          {pending ? "Sending instructions…" : "Send recovery instructions"}
        </Button>
        <FieldDescription className="text-center">
          <Link
            href="/sign-in"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
