"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { configureSmtp } from "@/features/email/application/configure-smtp";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SmtpConfigurationForm({
  label = "Add sender",
  variant = "default",
  disabled = false,
}: {
  label?: string;
  variant?: "default" | "outline";
  disabled?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [pending, setPending] = useState(false);
  const [hostChoice, setHostChoice] = useState("smtp.gmail.com");
  async function submit(formData: FormData) {
    setPending(true);
    try {
      const result = await configureSmtp(formData);
      if (!result.success) return toast.error(result.message);
      toast.success(result.message);
      setOpen(false);
      setStep(1);
      router.refresh();
    } catch {
      toast.error(
        "Could not verify the sender. Please check the connection and try again.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!pending) {
          setOpen(next);
          if (!next) setStep(1);
        }
      }}
    >
      <DialogTrigger render={<Button variant={variant} disabled={disabled} />}>
        <Plus data-icon="inline-start" />
        {label}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add an SMTP sender</DialogTitle>
          <DialogDescription>
            Complete three short steps. The connection is verified before
            encrypted credentials are stored.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={String(step)}>
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="1">Identity</TabsTrigger>
            <TabsTrigger value="2">Connection</TabsTrigger>
            <TabsTrigger value="3">Credentials</TabsTrigger>
          </TabsList>
        </Tabs>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit(new FormData(event.currentTarget));
          }}
        >
          <div
            className={
              step === 1
                ? "animate-in fade-in slide-in-from-right-2 duration-300"
                : "hidden"
            }
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="label">Configuration name</FieldLabel>
                <Input
                  id="label"
                  name="label"
                  placeholder="Production SMTP"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="senderName">Sender name</FieldLabel>
                <Input
                  id="senderName"
                  name="senderName"
                  placeholder="Acme Support"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="senderEmail">From email</FieldLabel>
                <Input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  placeholder="support@acme.com"
                  required
                />
              </Field>
            </FieldGroup>
          </div>
          <div
            className={
              step === 2
                ? "animate-in fade-in slide-in-from-right-2 duration-300"
                : "hidden"
            }
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="host">SMTP host</FieldLabel>
                <Select
                  name={hostChoice === "custom" ? undefined : "host"}
                  value={hostChoice}
                  onValueChange={(value) => value && setHostChoice(value)}
                  required
                >
                  <SelectTrigger id="host" className="w-full">
                    <SelectValue placeholder="Select an SMTP host" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="smtp.gmail.com">
                        Gmail — smtp.gmail.com
                      </SelectItem>
                      <SelectItem value="smtp.office365.com">
                        Microsoft 365 — smtp.office365.com
                      </SelectItem>
                      <SelectItem value="smtp.mail.yahoo.com">
                        Yahoo — smtp.mail.yahoo.com
                      </SelectItem>
                      <SelectItem value="smtp.zoho.com">
                        Zoho — smtp.zoho.com
                      </SelectItem>
                      <SelectItem value="email-smtp.us-east-1.amazonaws.com">
                        Amazon SES — US East
                      </SelectItem>
                      <SelectItem value="custom">Custom SMTP host</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {hostChoice === "custom" && (
                  <Input
                    name="host"
                    placeholder="smtp.your-provider.com"
                    aria-label="Custom SMTP host"
                    required
                  />
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="port">SMTP port</FieldLabel>
                <Select name="port" defaultValue="465" required>
                  <SelectTrigger id="port" className="w-full">
                    <SelectValue placeholder="Select an SMTP port" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="465">465 — SSL/TLS</SelectItem>
                      <SelectItem value="587">587 — STARTTLS</SelectItem>
                      <SelectItem value="2525">
                        2525 — Alternative STARTTLS
                      </SelectItem>
                      <SelectItem value="25">25 — Standard SMTP</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="secure">Connection security</FieldLabel>
                <Select name="secure" defaultValue="true" required>
                  <SelectTrigger id="secure" className="w-full">
                    <SelectValue placeholder="Select connection security" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="true">
                        SSL/TLS (usually port 465)
                      </SelectItem>
                      <SelectItem value="false">
                        STARTTLS (usually port 587)
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </div>
          <div
            className={
              step === 3
                ? "animate-in fade-in slide-in-from-right-2 duration-300"
                : "hidden"
            }
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">SMTP username</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  placeholder="support@acme.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">SMTP password</FieldLabel>
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="App password or SMTP password"
                  required
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isDefault"
                  className="accent-primary"
                />{" "}
                Use as the default sender
              </label>
              <FieldDescription>
                Credentials are verified before the encrypted password is
                stored.
              </FieldDescription>
            </FieldGroup>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={step === 1 || pending}
              onClick={() => setStep((value) => value - 1)}
            >
              <ArrowLeft data-icon="inline-start" />
              Back
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                onClick={() => setStep((value) => value + 1)}
              >
                Continue
                <ArrowRight data-icon="inline-end" />
              </Button>
            ) : (
              <Button type="submit" disabled={pending}>
                {pending ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <ShieldCheck data-icon="inline-start" />
                )}
                {pending ? "Verifying sender…" : "Verify and save sender"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
