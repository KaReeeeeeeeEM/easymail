"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export function TwoFactorForm() {
  const router = useRouter();
  const requested = useRef(false);
  const [pending, setPending] = useState(false);
  const [sending, setSending] = useState(true);
  const [error, setError] = useState("");

  async function sendCode(showToast = false) {
    setSending(true);
    setError("");
    const result = await authClient.twoFactor.sendOtp().finally(() => setSending(false));
    if (result.error) {
      const message = result.error.message ?? "Unable to send a security code. Sign in again.";
      setError(message);
      toast.error(message);
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
    const result = await authClient.twoFactor.verifyOtp({ code, trustDevice: false }).finally(() => setPending(false));
    if (result.error) {
      const message = result.error.message ?? "The security code is invalid or expired.";
      setError(message);
      toast.error(message);
      return;
    }
    toast.success("Identity confirmed. Welcome back.");
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="security-code">Security code</FieldLabel>
          <InputOTP id="security-code" name="code" maxLength={6} pattern={REGEXP_ONLY_DIGITS} disabled={pending || sending} autoFocus required containerClassName="justify-center">
            <InputOTPGroup>{[0, 1, 2, 3, 4, 5].map((index) => <InputOTPSlot key={index} index={index} className="size-11 text-lg" />)}</InputOTPGroup>
          </InputOTP>
          <FieldDescription>{sending ? "Sending a code to your Gmail inbox…" : "Enter the six-digit code sent to your Gmail inbox. It expires in 5 minutes."}</FieldDescription>
        </Field>
        {error && <Field data-invalid><FieldError>{error}</FieldError></Field>}
        <Button type="submit" disabled={pending || sending}>{pending && <Spinner data-icon="inline-start" />}{pending ? "Verifying code…" : "Verify and continue"}</Button>
        <Button type="button" variant="outline" disabled={pending || sending} onClick={() => void sendCode(true)}>{sending && <Spinner data-icon="inline-start" />}{sending ? "Sending code…" : "Send a new code"}</Button>
      </FieldGroup>
    </form>
  );
}
