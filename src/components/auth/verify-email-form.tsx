"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, RefreshCw } from "lucide-react";

export function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email")?.trim().toLowerCase() ?? "";
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);

  async function verify(formData: FormData) {
    if (!email) return;
    setPending(true);
    const otp = String(formData.get("otp")).replace(/\D/g, "");
    const result = await authClient.emailOtp
      .verifyEmail({ email, otp })
      .finally(() => setPending(false));
    if (result.error) {
      const message =
        result.error.message ?? "The verification code is invalid or expired.";
      toast.error(message);
      return;
    }
    toast.success("Account verified and ready. You can now sign in securely.");
    router.replace("/sign-in");
  }

  async function resend() {
    if (!email) return;
    setResending(true);
    const result = await authClient.emailOtp
      .sendVerificationOtp({ email, type: "email-verification" })
      .finally(() => setResending(false));
    if (result.error) {
      const message =
        result.error.message ?? "A new code could not be sent yet.";
      toast.error(message);
      return;
    }
    toast.success("A new verification code was sent to your Gmail inbox.");
  }

  if (!email)
    return (
      <Field data-invalid>
        <FieldError>
          The verification link is missing an email address.
        </FieldError>
        <FieldDescription>
          <Link
            href="/sign-up"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Return to registration
          </Link>
        </FieldDescription>
      </Field>
    );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void verify(new FormData(event.currentTarget));
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="account-verification-code">
            Verification code
          </FieldLabel>
          <InputOTP
            id="account-verification-code"
            name="otp"
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            disabled={pending || resending}
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
            Enter the six-digit code sent to {email}. It expires in 5 minutes.
          </FieldDescription>
        </Field>
        <Button type="submit" disabled={pending || resending}>
          {pending ? <Spinner data-icon="inline-start" /> : <CheckCircle2 data-icon="inline-start" />}
          {pending ? "Verifying account…" : "Verify and create account"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending || resending}
          onClick={() => void resend()}
        >
          {resending ? <Spinner data-icon="inline-start" /> : <RefreshCw data-icon="inline-start" />}
          {resending ? "Sending new code…" : "Send a new code"}
        </Button>
      </FieldGroup>
    </form>
  );
}
