"use client";

import { useMemo, useState } from "react";
import { Code2, FlaskConical } from "lucide-react";

import { CopyCodeButton } from "@/components/copy-code-button";
import { PlaygroundForm, type PlaygroundValues } from "@/components/dashboard/playground-form";
import { LiveSyntaxCodeBlock } from "@/components/live-syntax-code-block";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Sender = { id: string; label: string; senderEmail: string };
type Language = "curl" | "javascript" | "python";
const endpoint = "https://easymail.almareem.com/api/v1/emails";

function requestBody(values: PlaygroundValues) {
  const cc = values.cc.split(",").map((item) => item.trim()).filter(Boolean);
  return {
    to: values.to || "customer@gmail.com",
    ...(cc.length ? { cc } : {}),
    subject: values.subject || "Test email",
    ...(values.mode === "html"
      ? { html: values.html || "<h1>Hello!</h1><p>Your HTML email.</p>" }
      : { text: values.text || "Your plain-text email." }),
  };
}

function buildSamples(values: PlaygroundValues): Record<Language, string> {
  const body = requestBody(values);
  const fileNames = values.files.map((file) => file.name);
  const attachmentData = values.files.map((file) => ({
    filename: file.name,
    content: "BASE64_ENCODED_CONTENT",
    contentType: file.type || "application/octet-stream",
  }));
  const curlJson = JSON.stringify(
    values.files.length ? { ...body, attachments: attachmentData } : body,
  );
  const jsSetup = values.files.length
    ? `import { readFile } from "node:fs/promises";\n\nconst attachments = await Promise.all(${JSON.stringify(fileNames)}.map(async (filename) => ({\n  filename,\n  content: (await readFile(filename)).toString("base64"),\n})));\n\n`
    : "";
  const jsBody = JSON.stringify(values.files.length ? { ...body, attachments: "__attachments__" } : body, null, 2).replace('"__attachments__"', "attachments");
  const pythonSetup = values.files.length
    ? `import base64\n\ndef attachment(filename):\n    with open(filename, "rb") as file:\n        return {"filename": filename, "content": base64.b64encode(file.read()).decode()}\n\nattachments = [attachment(filename) for filename in ${JSON.stringify(fileNames)}]\n\n`
    : "";
  const pythonBody = JSON.stringify(values.files.length ? { ...body, attachments: "__attachments__" } : body, null, 4).replace('"__attachments__"', "attachments");

  return {
    curl: `curl --request POST '${endpoint}' \\
  --header "Authorization: Bearer $EASYMAIL_API_KEY" \\
  --header 'Content-Type: application/json' \\
  --data-raw '${curlJson}'`,
    javascript: `${jsSetup}const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.EASYMAIL_API_KEY}\`,
    "Content-Type": "application/json",
    "Idempotency-Key": crypto.randomUUID(),
  },
  body: JSON.stringify(${jsBody}),
});

console.log(await response.json());`,
    python: `${pythonSetup}import os
import uuid
import requests

payload = ${pythonBody}

response = requests.post(
    "${endpoint}",
    headers={
        "Authorization": f"Bearer {os.environ['EASYMAIL_API_KEY']}",
        "Idempotency-Key": str(uuid.uuid4()),
    },
    json=payload,
    timeout=30,
)
print(response.json())`,
  };
}

export function PlaygroundExperience({ senders }: { senders: Sender[] }) {
  const [values, setValues] = useState<PlaygroundValues>({
    to: "",
    cc: "",
    subject: "",
    mode: "text",
    text: "",
    html: "<h1>Hello!</h1>\n<p>This email was sent from the dashboard playground.</p>",
    files: [],
  });
  const samples = useMemo(() => buildSamples(values), [values]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FlaskConical />Send a test email</CardTitle>
          <CardDescription>Choose a saved sender. Its encrypted SMTP credentials never leave the server.</CardDescription>
        </CardHeader>
        <CardContent><PlaygroundForm senders={senders} values={values} onValuesChange={setValues} /></CardContent>
      </Card>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Code2 />Request examples</CardTitle>
          <CardDescription>These samples update as you type and can run unchanged in terminals, Postman, and other HTTP clients. Add a concrete idempotency key only when your application retries requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="curl">
            <TabsList variant="line"><TabsTrigger value="curl">cURL</TabsTrigger><TabsTrigger value="javascript">JavaScript</TabsTrigger><TabsTrigger value="python">Python</TabsTrigger></TabsList>
            {(Object.keys(samples) as Language[]).map((language) => (
              <TabsContent key={language} value={language} className="animate-in fade-in duration-200">
                <div className="flex justify-end pt-4">
                  <CopyCodeButton code={samples[language]} />
                </div>
                <LiveSyntaxCodeBlock className="mt-3" code={samples[language]} language={language === "curl" ? "bash" : language} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
