"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Info,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { configureSmtp } from "@/features/email/application/configure-smtp";
import { PasswordInput } from "@/components/password-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

type ProviderId = "gmail" | "yahoo" | "zoho" | "zoho-org" | "ses" | "custom";

const providerProfiles: Record<
  ProviderId,
  {
    name: string;
    host: string;
    port: string;
    secure: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    help: string;
    credentialUrl?: string;
    credentialLabel?: string;
  }
> = {
  gmail: {
    name: "Gmail / Google Workspace mailbox",
    host: "smtp.gmail.com",
    port: "465",
    secure: "true",
    usernameLabel: "Google account email",
    usernamePlaceholder: "you@gmail.com",
    passwordLabel: "Google App Password",
    passwordPlaceholder: "16-character App Password",
    help: "Enable 2-Step Verification, then create a 16-character App Password. Never use your normal Google password.",
    credentialUrl: "https://myaccount.google.com/apppasswords",
    credentialLabel: "Create Google App Password",
  },
  yahoo: {
    name: "Yahoo Mail",
    host: "smtp.mail.yahoo.com",
    port: "465",
    secure: "true",
    usernameLabel: "Yahoo email address",
    usernamePlaceholder: "you@yahoo.com",
    passwordLabel: "Yahoo app password",
    passwordPlaceholder: "Generated third-party app password",
    help: "Yahoo requires a generated third-party app password for SMTP clients; your normal account password is not accepted.",
    credentialUrl: "https://login.yahoo.com/account/security",
    credentialLabel: "Open Yahoo Account Security",
  },
  zoho: {
    name: "Zoho Mail — personal or free organization",
    host: "smtp.zoho.com",
    port: "465",
    secure: "true",
    usernameLabel: "Full Zoho email address",
    usernamePlaceholder: "you@zohomail.com",
    passwordLabel: "Zoho SMTP password",
    passwordPlaceholder: "App password when TFA is enabled",
    help: "Use your account password when TFA is off, or a Zoho application-specific password when TFA is enabled.",
    credentialUrl: "https://accounts.zoho.com/home#security/security_app_password",
    credentialLabel: "Manage Zoho app passwords",
  },
  "zoho-org": {
    name: "Zoho Mail — paid organization",
    host: "smtppro.zoho.com",
    port: "465",
    secure: "true",
    usernameLabel: "Full organization email address",
    usernamePlaceholder: "you@company.com",
    passwordLabel: "Zoho SMTP password",
    passwordPlaceholder: "App password when TFA is enabled",
    help: "Paid Zoho organization mailboxes use smtppro.zoho.com. Use an application-specific password when TFA or SAML is enabled.",
    credentialUrl: "https://accounts.zoho.com/home#security/security_app_password",
    credentialLabel: "Manage Zoho app passwords",
  },
  ses: {
    name: "Amazon SES SMTP",
    host: "email-smtp.us-east-1.amazonaws.com",
    port: "465",
    secure: "true",
    usernameLabel: "SES SMTP username",
    usernamePlaceholder: "Region-specific SMTP username",
    passwordLabel: "SES SMTP password",
    passwordPlaceholder: "Region-specific SMTP password",
    help: "Create SES SMTP credentials for the same AWS Region selected below. Do not paste an AWS access key or secret access key.",
    credentialUrl: "https://console.aws.amazon.com/ses/home#/smtp",
    credentialLabel: "Create SES SMTP credentials",
  },
  custom: {
    name: "Other authenticated SMTP server",
    host: "",
    port: "587",
    secure: "false",
    usernameLabel: "SMTP username",
    usernamePlaceholder: "Your provider-issued username",
    passwordLabel: "SMTP password",
    passwordPlaceholder: "Your provider-issued SMTP credential",
    help: "Enter the authenticated SMTP settings supplied by your provider. EasyMail does not connect to anonymous or IP-allowlisted relays.",
  },
};

const sesRegions = [
  ["af-south-1", "Africa (Cape Town)"],
  ["us-east-1", "US East (N. Virginia)"],
  ["us-east-2", "US East (Ohio)"],
  ["us-west-2", "US West (Oregon)"],
  ["ca-central-1", "Canada (Central)"],
  ["eu-west-1", "Europe (Ireland)"],
  ["eu-west-2", "Europe (London)"],
  ["eu-west-3", "Europe (Paris)"],
  ["eu-central-1", "Europe (Frankfurt)"],
  ["eu-north-1", "Europe (Stockholm)"],
  ["ap-south-1", "Asia Pacific (Mumbai)"],
  ["ap-southeast-1", "Asia Pacific (Singapore)"],
  ["ap-southeast-2", "Asia Pacific (Sydney)"],
  ["ap-northeast-1", "Asia Pacific (Tokyo)"],
  ["ap-northeast-2", "Asia Pacific (Seoul)"],
  ["sa-east-1", "South America (São Paulo)"],
] as const;

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
  const [provider, setProvider] = useState<ProviderId>("gmail");
  const [sesRegion, setSesRegion] = useState("us-east-1");
  const [port, setPort] = useState("465");
  const [secure, setSecure] = useState("true");
  const profile = providerProfiles[provider];
  const presetHost = provider === "ses"
    ? `email-smtp.${sesRegion}.amazonaws.com`
    : profile.host;

  function selectProvider(value: string | null) {
    if (!value || !(value in providerProfiles)) return;
    const nextProvider = value as ProviderId;
    const nextProfile = providerProfiles[nextProvider];
    setProvider(nextProvider);
    setPort(nextProfile.port);
    setSecure(nextProfile.secure);
  }
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
                <FieldDescription>
                  The name recipients see in their inbox, such as Acme Support.
                </FieldDescription>
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
                <FieldLabel htmlFor="provider">Email provider</FieldLabel>
                <Select
                  value={provider}
                  onValueChange={selectProvider}
                  required
                >
                  <SelectTrigger id="provider" className="w-full">
                    <SelectValue placeholder="Select an email provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="gmail">
                        Gmail / Google Workspace mailbox
                      </SelectItem>
                      <SelectItem value="yahoo">Yahoo Mail</SelectItem>
                      <SelectItem value="zoho">
                        Zoho — personal or free organization
                      </SelectItem>
                      <SelectItem value="zoho-org">
                        Zoho — paid organization
                      </SelectItem>
                      <SelectItem value="ses">Amazon SES SMTP</SelectItem>
                      <SelectItem value="microsoft" disabled>
                        Microsoft 365 — OAuth 2.0 required
                      </SelectItem>
                      <SelectItem value="custom">
                        Other authenticated SMTP server
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input type="hidden" name="provider" value={provider} />
                {provider === "custom" ? (
                  <Input
                    name="host"
                    placeholder="smtp.your-provider.com"
                    aria-label="Custom SMTP host"
                    required
                  />
                ) : (
                  <input type="hidden" name="host" value={presetHost} />
                )}
              </Field>
              {provider === "ses" ? (
                <Field>
                  <FieldLabel htmlFor="ses-region">AWS Region</FieldLabel>
                  <Select value={sesRegion} onValueChange={(value) => value && setSesRegion(value)}>
                    <SelectTrigger id="ses-region" className="w-full">
                      <SelectValue placeholder="Select the SES region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {sesRegions.map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Your SMTP credentials and verified identity must belong to this region.
                  </FieldDescription>
                </Field>
              ) : null}
              <Field>
                <FieldLabel htmlFor="port">SMTP port</FieldLabel>
                <Select
                  name="port"
                  value={port}
                  onValueChange={(value) => {
                    if (!value) return;
                    setPort(value);
                    setSecure(value === "465" ? "true" : "false");
                  }}
                  required
                >
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
                <Select name="secure" value={secure} onValueChange={(value) => value && setSecure(value)} required>
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
              <Alert>
                <Info />
                <AlertTitle>{profile.name}</AlertTitle>
                <AlertDescription>{profile.help}</AlertDescription>
              </Alert>
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
                <FieldLabel htmlFor="username">{profile.usernameLabel}</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  placeholder={profile.usernamePlaceholder}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">{profile.passwordLabel}</FieldLabel>
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder={profile.passwordPlaceholder}
                  required
                />
                {profile.credentialUrl ? (
                  <FieldDescription>
                    {profile.help}{" "}
                    <a
                      href={profile.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-primary underline underline-offset-4"
                    >
                      {profile.credentialLabel}
                      <ExternalLink className="ml-1 inline size-3" aria-hidden="true" />
                    </a>
                    .
                  </FieldDescription>
                ) : (
                  <FieldDescription>
                    {profile.help}
                  </FieldDescription>
                )}
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
