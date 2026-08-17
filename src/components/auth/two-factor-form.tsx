"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function TwoFactorForm() {
  const router = useRouter();
  const requested = useRef(false);
  const [pending, setPending] = useState(false);
  const [sending, setSending] = useState(true);
  const [error, setError] = useState("");

  async function sendCode(showToast = false) {
    setSending(true);
    setError("");
    const result = await authClient.twoFactor.sendOtp();
    setSending(false);
    if (result.error) {
      setError(result.error.message ?? "Unable to send a security code. Sign in again.");
      return;
    }
    if (showToast) toast.success("A new security code was sent to your Gmail inbox.");
  }

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    void sendCode();
  }, []);

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    const code = String(formData.get("code")).replace(/\D/g, "");
    const result = await authClient.twoFactor.verifyOtp({ code, trustDevice: false });
    setPending(false);
    if (result.error) {
      setError(result.error.message ?? "The security code is invalid or expired.");
      return;
    }
    toast.success("Identity confirmed. Welcome back.");
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form action={submit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="security-code">Security code</FieldLabel>
          <Input id="security-code" name="code" inputMode="numeric" autoComplete="one-time-code" placeholder="000000" pattern="[0-9]{6}" maxLength={6} className="h-12 text-center text-xl tracking-[0.45em]" required autoFocus />
          <FieldDescription>{sending ? "Sending a code to your Gmail inbox…" : "Enter the six-digit code sent to your Gmail inbox. It expires in 5 minutes."}</FieldDescription>
        </Field>
        {error && <Field data-invalid><FieldError>{error}</FieldError></Field>}
        <Button type="submit" disabled={pending || sending}>{pending && <LoaderCircle data-icon="inline-start" className="animate-spin" />}Verify and continue</Button>
        <Button type="button" variant="outline" disabled={sending} onClick={() => void sendCode(true)}>{sending ? "Sending code…" : "Send a new code"}</Button>
      </FieldGroup>
    </form>
  );
}
