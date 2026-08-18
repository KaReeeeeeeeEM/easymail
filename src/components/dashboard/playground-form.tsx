"use client";

import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { Eye, FileUp, Send } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type Sender = { id: string; label: string; senderEmail: string };
type EncodedAttachment = { filename: string; content: string; contentType?: string };
export type PlaygroundValues = {
  to: string;
  cc: string;
  subject: string;
  mode: "text" | "html";
  text: string;
  html: string;
  files: File[];
};

async function encodeFiles(files: FileList | null) {
  if (!files) return [];
  return Promise.all(Array.from(files).map(async (file): Promise<EncodedAttachment> => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
    return { filename: file.name, contentType: file.type || undefined, content: btoa(binary) };
  }));
}

export function PlaygroundForm({
  senders,
  values,
  onValuesChange,
}: {
  senders: Sender[];
  values: PlaygroundValues;
  onValuesChange: (values: PlaygroundValues) => void;
}) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [senderId, setSenderId] = useState(senders[0]?.id ?? "");
  const [previewOpen, setPreviewOpen] = useState(false);
  const update = (patch: Partial<PlaygroundValues>) => onValuesChange({ ...values, ...patch });
  const preview = useMemo(() => values.html || "<p>No HTML content yet.</p>", [values.html]);

  async function submit(form: HTMLFormElement) {
    flushSync(() => { setPending(true); setResult(null); });
    try {
      const attachments = await encodeFiles(form.querySelector<HTMLInputElement>("#playground-attachments")?.files ?? null);
      const cc = values.cc.split(",").map((item) => item.trim()).filter(Boolean);
      const response = await fetch("/api/dashboard/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId,
          to: values.to,
          cc: cc.length ? cc : undefined,
          subject: values.subject,
          text: values.mode === "text" ? values.text : undefined,
          html: values.mode === "html" ? values.html : undefined,
          attachments: attachments.length ? attachments : undefined,
        }),
      });
      const payload = await response.json();
      setResult(JSON.stringify(payload, null, 2));
      if (!response.ok) return toast.error(payload.error?.message ?? "The test request failed.");
      toast.success("Test email accepted by the SMTP provider.");
    } catch {
      toast.error("The test email could not be completed.");
    } finally {
      setPending(false);
    }
  }

  if (!senders.length) return <p className="text-sm text-muted-foreground">Add an SMTP sender to this workspace before using the playground.</p>;

  return (
    <>
      <form onSubmit={(event) => { event.preventDefault(); void submit(event.currentTarget); }}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="playground-sender">Sender</FieldLabel>
            <Select value={senderId} onValueChange={(value) => setSenderId(value ?? "")} required>
              <SelectTrigger id="playground-sender" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{senders.map((sender) => <SelectItem key={sender.id} value={sender.id}>{sender.label} · {sender.senderEmail}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
            <FieldDescription>Uses the encrypted credentials already saved for this sender.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="playground-to">Recipient</FieldLabel>
            <Input id="playground-to" type="email" value={values.to} onChange={(event) => update({ to: event.target.value })} placeholder="customer@gmail.com" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="playground-cc">CC</FieldLabel>
            <Input id="playground-cc" value={values.cc} onChange={(event) => update({ cc: event.target.value })} placeholder="finance@gmail.com, owner@gmail.com" />
            <FieldDescription>Optional. Separate multiple addresses with commas.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="playground-subject">Subject</FieldLabel>
            <Input id="playground-subject" value={values.subject} onChange={(event) => update({ subject: event.target.value })} placeholder="Test email" maxLength={200} required />
          </Field>
          <Tabs value={values.mode} onValueChange={(value) => update({ mode: value as PlaygroundValues["mode"] })}>
            <TabsList variant="line">
              <TabsTrigger value="text">Text email</TabsTrigger>
              <TabsTrigger value="html">HTML email</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="pt-4">
              <Field>
                <FieldLabel htmlFor="playground-text">Email message</FieldLabel>
                <Textarea id="playground-text" value={values.text} onChange={(event) => update({ text: event.target.value })} placeholder="Write your plain-text email." className="min-h-48" required={values.mode === "text"} />
              </Field>
            </TabsContent>
            <TabsContent value="html" className="pt-4">
              <Field>
                <FieldLabel htmlFor="playground-html">HTML template</FieldLabel>
                <Textarea id="playground-html" value={values.html} onChange={(event) => update({ html: event.target.value })} placeholder="<h1>Your email template</h1>" className="min-h-48 font-mono text-xs" required={values.mode === "html"} />
              </Field>
            </TabsContent>
          </Tabs>
          <Field>
            <FieldLabel htmlFor="playground-attachments">Attachments</FieldLabel>
            <Input id="playground-attachments" type="file" multiple onChange={(event) => update({ files: Array.from(event.target.files ?? []) })} />
            <FieldDescription>Optional. Up to 3 files; the complete request must remain below 4.5 MB.</FieldDescription>
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}><Eye data-icon="inline-start" />Preview email</Button>
            <Button type="submit" disabled={pending} aria-busy={pending}>
              {pending ? <Spinner data-icon="inline-start" className="text-primary-foreground" /> : <Send data-icon="inline-start" />}
              {pending ? "Sending email…" : "Send test email"}
            </Button>
          </div>
          {result && <div className="rounded-xl border bg-muted/40 p-4"><p className="mb-2 flex items-center gap-2 text-sm font-medium"><FileUp />API response</p><pre className="overflow-x-auto whitespace-pre-wrap text-xs">{result}</pre></div>}
        </FieldGroup>
      </form>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Email preview</DialogTitle>
            <DialogDescription>Previewing the current {values.mode === "html" ? "HTML" : "text"} message before sending.</DialogDescription>
          </DialogHeader>
          {values.mode === "html" ? <div className="overflow-hidden rounded-xl border bg-white"><iframe title="Email HTML preview" sandbox="" srcDoc={preview} className="h-[60vh] w-full" /></div> : <pre className="max-h-[60vh] min-h-72 overflow-auto whitespace-pre-wrap rounded-xl border bg-muted/40 p-5 text-sm">{values.text || "No text content yet."}</pre>}
        </DialogContent>
      </Dialog>
    </>
  );
}
