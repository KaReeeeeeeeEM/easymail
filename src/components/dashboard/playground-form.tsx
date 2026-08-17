"use client";

import { useState } from "react";
import { KeyRound, Send } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

export function PlaygroundForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setPending(true);
    setResult(null);
    try {
      const response = await fetch("/api/v1/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${String(formData.get("apiKey")).trim()}`,
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          to: String(formData.get("to")),
          subject: String(formData.get("subject")),
          text: String(formData.get("text")),
        }),
      });
      const payload = await response.json();
      setResult(JSON.stringify(payload, null, 2));
      if (!response.ok)
        return toast.error(
          payload.error?.message ?? "The test request failed.",
        );
      toast.success("Test email accepted by the SMTP provider.");
    } catch {
      toast.error("The test request could not be completed.");
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
          <FieldLabel htmlFor="playground-key">API key</FieldLabel>
          <Input
            id="playground-key"
            name="apiKey"
            type="password"
            autoComplete="off"
            placeholder="gms_your_secret_key"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="playground-to">Recipient</FieldLabel>
          <Input
            id="playground-to"
            name="to"
            type="email"
            placeholder="recipient@example.com"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="playground-subject">Subject</FieldLabel>
          <Input
            id="playground-subject"
            name="subject"
            placeholder="Test email from easymail"
            maxLength={200}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="playground-text">Message</FieldLabel>
          <Textarea
            id="playground-text"
            name="text"
            placeholder="Your test message…"
            required
          />
        </Field>
        <Button disabled={pending}>
          {pending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Send data-icon="inline-start" />
          )}
          {pending ? "Sending test…" : "Send test email"}
        </Button>
        {result && (
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-medium">
              <KeyRound />
              API response
            </p>
            <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
              {result}
            </pre>
          </div>
        )}
      </FieldGroup>
    </form>
  );
}
