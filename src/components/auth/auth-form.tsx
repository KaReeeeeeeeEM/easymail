"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const isSignUp = mode === "sign-up";

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    if (isSignUp && password !== String(formData.get("confirmPassword"))) {
      setPending(false);
      setError("Passwords do not match");
      return;
    }
    if (!/^[^\s@]+@gmail\.com$/i.test(email.trim())) {
      setPending(false);
      setError("Use a valid Gmail address ending in @gmail.com.");
      return;
    }
    const result = isSignUp
      ? await authClient.signUp.email({
          email,
          password,
          name: String(formData.get("name")),
        })
      : await authClient.signIn.email({ email, password });
    setPending(false);
    if (result.error)
      return setError(result.error.message ?? "Unable to continue");
    if (isSignUp) {
      toast.success("Account created. Check your email to verify it before signing in.");
      router.push("/sign-in");
      return;
    }
    if (result.data && "twoFactorRedirect" in result.data && result.data.twoFactorRedirect) {
      router.push("/two-factor");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form action={submit}>
      <FieldGroup>
        {isSignUp && (
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Amina Mushi"
              required
            />
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@gmail.com"
            pattern="[A-Za-z0-9._%+-]+@gmail[.]com"
            title="Use a Gmail address ending in @gmail.com"
            required
          />
        </Field>
        {isSignUp && <FieldDescription>Only Gmail addresses ending in @gmail.com can register.</FieldDescription>}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            id="password"
            name="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="Enter your password"
            minLength={10}
            maxLength={128}
            required
          />
          <FieldDescription>Use between 10 and 128 characters.</FieldDescription>
        </Field>
        {isSignUp && <Field>
          <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
          <PasswordInput id="confirm-password" name="confirmPassword" autoComplete="new-password" placeholder="Repeat your password" minLength={10} maxLength={128} required />
        </Field>}
        {error && (
          <Field data-invalid>
            <FieldError>{error}</FieldError>
          </Field>
        )}
        <Button type="submit" disabled={pending}>
          {pending && (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          )}
          {isSignUp ? "Create account" : "Sign in"}
        </Button>
        {!isSignUp && <FieldDescription className="text-center"><Link className="font-medium text-primary underline-offset-4 hover:underline" href="/forgot-password">Forgot your password?</Link></FieldDescription>}
        <FieldDescription className="text-center">
          {isSignUp ? "Already registered?" : "New here?"}{" "}
          <Link
            className="text-foreground underline"
            href={isSignUp ? "/sign-in" : "/sign-up"}
          >
            {isSignUp ? "Sign in" : "Create an account"}
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
