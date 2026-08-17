"use client";

import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { Eye, FileUp, Send } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type Sender = { id: string; label: string; senderEmail: string };
type EncodedAttachment = { filename: string; content: string; contentType?: string };

async function encodeFiles(files: FileList | null) {
  if (!files) return [];
  return Promise.all(Array.from(files).map(async (file): Promise<EncodedAttachment> => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
    return { filename: file.name, contentType: file.type || undefined, content: btoa(binary) };
  }));
}

export function PlaygroundForm({ senders }: { senders: Sender[] }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [html, setHtml] = useState("<h1>Hello!</h1>\n<p>This email was sent from the dashboard playground.</p>");
  const preview = useMemo(() => html || "<p>No HTML preview yet.</p>", [html]);

  async function submit(form: HTMLFormElement) {
    flushSync(() => {
      setPending(true);
      setResult(null);
    });
    try {
      const formData = new FormData(form);
      const attachments = await encodeFiles(form.querySelector<HTMLInputElement>("#playground-attachments")?.files ?? null);
      const cc = String(formData.get("cc") ?? "").split(",").map((item) => item.trim()).filter(Boolean);
      const response = await fetch("/api/dashboard/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: String(formData.get("senderId")),
          to: String(formData.get("to")),
          cc: cc.length ? cc : undefined,
          subject: String(formData.get("subject")),
          text: String(formData.get("text")) || undefined,
          html: html || undefined,
          attachments: attachments.length ? attachments : undefined,
        }),
      });
      const payload = await response.json();
      setResult(JSON.stringify(payload, null, 2));
      if (!response.ok) return toast.error(payload.error?.message ?? "The test request failed.");
      toast.success("Test email accepted by the SMTP provider.");
      form.querySelector<HTMLInputElement>("#playground-attachments")!.value = "";
    } catch {
      toast.error("The test email could not be completed.");
    } finally {
      setPending(false);
    }
  }

  if (!senders.length) {
    return <p className="text-sm text-muted-foreground">Add an SMTP sender to this workspace before using the playground.</p>;
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); void submit(event.currentTarget); }}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="playground-sender">Sender</FieldLabel>
          <Select name="senderId" defaultValue={senders[0].id} required>
            <SelectTrigger id="playground-sender" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent><SelectGroup>{senders.map((sender) => <SelectItem key={sender.id} value={sender.id}>{sender.label} · {sender.senderEmail}</SelectItem>)}</SelectGroup></SelectContent>
          </Select>
          <FieldDescription>Uses the encrypted credentials already saved for this sender.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="playground-to">Recipient</FieldLabel>
          <Input id="playground-to" name="to" type="email" placeholder="recipient@example.com" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="playground-cc">CC</FieldLabel>
          <Input id="playground-cc" name="cc" type="text" placeholder="finance@example.com, owner@example.com" />
          <FieldDescription>Optional. Separate multiple addresses with commas.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="playground-subject">Subject</FieldLabel>
          <Input id="playground-subject" name="subject" placeholder="Test email" maxLength={200} required />
        </Field>
        <Tabs defaultValue="compose">
          <TabsList variant="line">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="preview"><Eye data-icon="inline-start" />Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="compose" className="flex flex-col gap-5 pt-4">
            <Field>
              <FieldLabel htmlFor="playground-text">Plain-text fallback</FieldLabel>
              <Textarea id="playground-text" name="text" placeholder="A readable fallback for email clients that disable HTML." />
            </Field>
            <Field>
              <FieldLabel htmlFor="playground-html">HTML template</FieldLabel>
              <Textarea id="playground-html" value={html} onChange={(event) => setHtml(event.target.value)} placeholder="<h1>Your email template</h1>" className="min-h-48 font-mono text-xs" />
            </Field>
          </TabsContent>
          <TabsContent value="preview" className="pt-4">
            <div className="overflow-hidden rounded-xl border bg-white">
              <iframe title="Email HTML preview" sandbox="" srcDoc={preview} className="h-80 w-full" />
            </div>
          </TabsContent>
        </Tabs>
        <Field>
          <FieldLabel htmlFor="playground-attachments">Attachments</FieldLabel>
          <Input id="playground-attachments" name="attachments" type="file" multiple />
          <FieldDescription>Optional. Up to 3 files; the complete request must remain below 4.5 MB.</FieldDescription>
        </Field>
        <Button type="submit" disabled={pending} aria-busy={pending}>
          {pending ? <Spinner data-icon="inline-start" className="text-primary-foreground" /> : <Send data-icon="inline-start" />}
          {pending ? "Sending email…" : "Send test email"}
        </Button>
        {result && <div className="rounded-xl border bg-muted/40 p-4"><p className="mb-2 flex items-center gap-2 text-sm font-medium"><FileUp />API response</p><pre className="overflow-x-auto whitespace-pre-wrap text-xs">{result}</pre></div>}
      </FieldGroup>
    </form>
  );
}
