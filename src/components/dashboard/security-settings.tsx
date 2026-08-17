"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Fingerprint, KeyRound, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
  meetsPasswordRequirements,
  PasswordRequirements,
} from "@/components/auth/password-requirements";
import { PasswordInput } from "@/components/password-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

type Passkey = {
  id: string;
  name?: string | null;
  deviceType: string;
  createdAt?: Date | string | null;
};

export function SecuritySettings() {
  const [passwordPending, setPasswordPending] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passkeyPending, setPasskeyPending] = useState<string | null>(null);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  async function loadPasskeys() {
    const result = await authClient.passkey.listUserPasskeys();
    if (result.data) setPasskeys(result.data as Passkey[]);
  }
  useEffect(() => {
    const timer = window.setTimeout(() => void loadPasskeys(), 0);
    return () => window.clearTimeout(timer);
  }, []);
  async function changePassword(formData: FormData) {
    if (!meetsPasswordRequirements(newPassword))
      return toast.error("Please meet every password requirement.");
    if (newPassword !== String(formData.get("confirmation")))
      return toast.error("Passwords do not match.");
    flushSync(() => setPasswordPending(true));
    try {
      const result = await authClient.changePassword({
        currentPassword: String(formData.get("currentPassword")),
        newPassword,
        revokeOtherSessions: true,
      });
      if (result.error)
        return toast.error(
          result.error.message ?? "Could not change password.",
        );
      toast.success("Password changed and other sessions revoked.");
    } catch {
      toast.error("Could not change password. Please try again.");
    } finally {
      setPasswordPending(false);
    }
  }
  async function addPasskey(formData: FormData) {
    flushSync(() => setPasskeyPending("setup"));
    try {
      const result = await authClient.passkey.addPasskey({
        name: String(formData.get("passkeyName")) || "Biometric passkey",
        authenticatorAttachment: "platform",
      });
      if (result?.error)
        return toast.error(
          result.error.message ?? "Could not register biometrics.",
        );
      toast.success("Biometric passkey registered.");
      await loadPasskeys();
    } catch {
      toast.error(
        "Biometric setup was cancelled or is unsupported on this device.",
      );
    } finally {
      setPasskeyPending(null);
    }
  }
  async function removePasskey(id: string) {
    flushSync(() => setPasskeyPending(`remove:${id}`));
    try {
      const result = await authClient.passkey.deletePasskey({ id });
      if (result.error)
        return toast.error(result.error.message ?? "Could not remove passkey.");
      toast.success("Passkey removed.");
      await loadPasskeys();
    } catch {
      toast.error("Could not remove the passkey. Please try again.");
    } finally {
      setPasskeyPending(null);
    }
  }
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound />
            Change password
          </CardTitle>
          <CardDescription>
            Changing your password signs out every other active session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void changePassword(new FormData(event.currentTarget));
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="current-password">
                  Current password
                </FieldLabel>
                <PasswordInput
                  id="current-password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="security-new-password">
                  New password
                </FieldLabel>
                <PasswordInput
                  id="security-new-password"
                  name="newPassword"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                />
                <PasswordRequirements password={newPassword} />
              </Field>
              <Field>
                <FieldLabel htmlFor="security-confirmation">
                  Confirm new password
                </FieldLabel>
                <PasswordInput
                  id="security-confirmation"
                  name="confirmation"
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  required
                />
              </Field>
              <Button type="submit" disabled={passwordPending} aria-busy={passwordPending}>
                {passwordPending ? <Spinner data-icon="inline-start" /> : <KeyRound data-icon="inline-start" />}
                {passwordPending ? "Changing password…" : "Change password"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint />
            Biometrics and passkeys
          </CardTitle>
          <CardDescription>
            Use Face ID, Touch ID, Windows Hello, a device PIN, or a security
            key.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void addPasskey(new FormData(event.currentTarget));
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="passkey-name">Device name</FieldLabel>
                <Input
                  id="passkey-name"
                  name="passkeyName"
                  placeholder="My MacBook Touch ID"
                />
              </Field>
              <Button type="submit" disabled={Boolean(passkeyPending)} aria-busy={passkeyPending === "setup"}>
                {passkeyPending === "setup" ? <Spinner data-icon="inline-start" /> : <Fingerprint data-icon="inline-start" />}
                {passkeyPending === "setup" ? "Waiting for device…" : "Set up biometrics"}
              </Button>
            </FieldGroup>
          </form>
          <div className="flex flex-col gap-2">
            {passkeys.map((passkey) => (
              <div
                key={passkey.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">
                    {passkey.name || "Biometric passkey"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {passkey.deviceType}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Ready</Badge>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={Boolean(passkeyPending)}
                    onClick={() => void removePasskey(passkey.id)}
                    aria-label="Remove passkey"
                    aria-busy={passkeyPending === `remove:${passkey.id}`}
                  >
                    {passkeyPending === `remove:${passkey.id}` ? <Spinner /> : <Trash2 />}
                  </Button>
                </div>
              </div>
            ))}
            {!passkeys.length && (
              <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                No biometric passkeys configured.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
