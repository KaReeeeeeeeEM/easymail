"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Fingerprint, Mail, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export function TwoFactorForm() {
  const router = useRouter();
  const [method, setMethod] = useState<"email" | null>(null);
  const [pending, setPending] = useState(false);
  const [sending, setSending] = useState(false);

  async function sendCode(showToast = false) {
    setSending(true);
    const result = await authClient.twoFactor
      .sendOtp()
      .finally(() => setSending(false));
    if (result.error) {
      const message =
        result.error.message ??
        "Unable to send a security code. Sign in again.";
      toast.error(message);
      return false;
    }
    if (showToast)
      toast.success("A new security code was sent to your Gmail inbox.");
    return true;
  }

  async function selectEmail() {
    const sent = await sendCode(false);
    if (sent) setMethod("email");
  }

  async function authenticatePasskey() {
    setPending(true);
    try {
      const result = await authClient.signIn.passkey();
      if (result?.error)
        return toast.error(
          result.error.message ?? "Biometric verification failed.",
        );
      toast.success("Biometric identity confirmed. Welcome back.");
      router.replace("/dashboard");
      router.refresh();
    } catch {
      toast.error("Biometric verification was cancelled or unavailable.");
    } finally {
      setPending(false);
    }
  }

  async function submit(formData: FormData) {
    setPending(true);
    const code = String(formData.get("code")).replace(/\D/g, "");
    const result = await authClient.twoFactor
      .verifyOtp({ code, trustDevice: false })
      .finally(() => setPending(false));
    if (result.error) {
      const message =
        result.error.message ?? "The security code is invalid or expired.";
      toast.error(message);
      return;
    }
    toast.success("Identity confirmed. Welcome back.");
    router.replace("/dashboard");
    router.refresh();
  }

  if (!method)
    return (
      <div className="flex flex-col gap-3">
        <p className="text-center text-sm text-muted-foreground">
          Choose how to verify this sign-in.
        </p>
        <Button
          type="button"
          onClick={() => void selectEmail()}
          disabled={pending || sending}
        >
          {sending ? <Spinner data-icon="inline-start" /> : <Mail data-icon="inline-start" />}
          {sending ? "Sending security code…" : "Email security code"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => void authenticatePasskey()}
          disabled={pending || sending}
        >
          {pending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Fingerprint data-icon="inline-start" />
          )}
          {pending ? "Waiting for device…" : "Biometrics or passkey"}
        </Button>
      </div>
    );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit(new FormData(event.currentTarget));
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="security-code">Security code</FieldLabel>
          <InputOTP
            id="security-code"
            name="code"
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            disabled={pending || sending}
            autoFocus
            required
            containerClassName="justify-center"
          >
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="size-11 text-lg"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription>
            {sending
              ? "Sending a code to your Gmail inbox…"
              : "Enter the six-digit code sent to your Gmail inbox. It expires in 5 minutes."}
          </FieldDescription>
        </Field>
        <Button type="submit" disabled={pending || sending}>
          {pending ? <Spinner data-icon="inline-start" /> : <CheckCircle2 data-icon="inline-start" />}
          {pending ? "Verifying code…" : "Verify and continue"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending || sending}
          onClick={() => void sendCode(true)}
        >
          {sending ? <Spinner data-icon="inline-start" /> : <RefreshCw data-icon="inline-start" />}
          {sending ? "Sending code…" : "Send a new code"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={pending || sending}
          onClick={() => setMethod(null)}
        >
          <ArrowLeft data-icon="inline-start" />Choose another method
        </Button>
      </FieldGroup>
    </form>
  );
}
