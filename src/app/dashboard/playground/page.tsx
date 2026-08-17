import { desc, eq } from "drizzle-orm";
import { Code2, FlaskConical } from "lucide-react";
import { headers } from "next/headers";

import { CopyCodeButton } from "@/components/copy-code-button";
import { PageHeading } from "@/components/dashboard/page-heading";
import { PlaygroundForm } from "@/components/dashboard/playground-form";
import { SyntaxCodeBlock } from "@/components/syntax-code-block";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/db";
import { smtpConfiguration } from "@/db/schema";
import { auth } from "@/lib/auth";

const endpoint = "https://easymail.almareem.com/api/v1/emails";
const samples = {
  curl: `# Convert a file first: base64 < invoice.pdf | tr -d '\\n'
curl --request POST '${endpoint}' \\
  --header "Authorization: Bearer $EASYMAIL_API_KEY" \\
  --header 'Content-Type: application/json' \\
  --header 'Idempotency-Key: unique-request-id' \\
  --data '{"to":"customer@gmail.com","cc":["finance@gmail.com"],"subject":"Hello","text":"Plain-text fallback","html":"<h1>Hello!</h1><p>Sent with HTML.</p>","attachments":[{"filename":"invoice.pdf","content":"BASE64_FILE_CONTENT","contentType":"application/pdf"}]}'`,
  javascript: `import { readFile } from "node:fs/promises";

const fileBuffer = await readFile("invoice.pdf");
const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.EASYMAIL_API_KEY}\`,
    "Content-Type": "application/json",
    "Idempotency-Key": crypto.randomUUID(),
  },
  body: JSON.stringify({
    to: "customer@gmail.com",
    cc: ["finance@gmail.com"],
    subject: "Hello",
    text: "Plain-text fallback",
    html: "<h1>Hello!</h1><p>Sent with HTML.</p>",
    attachments: [{ filename: "invoice.pdf", content: fileBuffer.toString("base64"), contentType: "application/pdf" }],
  }),
});

console.log(await response.json());`,
  python: `import base64, os, uuid, requests

with open("invoice.pdf", "rb") as file:
    content = base64.b64encode(file.read()).decode()

response = requests.post(
    "${endpoint}",
    headers={"Authorization": f"Bearer {os.environ['EASYMAIL_API_KEY']}", "Idempotency-Key": str(uuid.uuid4())},
    json={
        "to": "customer@gmail.com",
        "cc": ["finance@gmail.com"],
        "subject": "Hello",
        "text": "Plain-text fallback",
        "html": "<h1>Hello!</h1><p>Sent with HTML.</p>",
        "attachments": [{"filename": "invoice.pdf", "content": content, "contentType": "application/pdf"}],
    },
    timeout=30,
)
print(response.json())`,
};

export default async function PlaygroundPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const organizationId = session?.session.activeOrganizationId;
  const senders = organizationId ? await db.select({
    id: smtpConfiguration.id,
    label: smtpConfiguration.label,
    senderEmail: smtpConfiguration.senderEmail,
  }).from(smtpConfiguration).where(eq(smtpConfiguration.organizationId, organizationId)).orderBy(desc(smtpConfiguration.isDefault), desc(smtpConfiguration.createdAt)) : [];

  return <div className="flex flex-col gap-8">
    <PageHeading eyebrow="Developer tools" title="Email playground" description="Compose and preview a live email using a saved workspace sender, then copy production-ready API examples." />
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FlaskConical />Send a test email</CardTitle><CardDescription>Choose a saved sender. Its encrypted SMTP credentials never leave the server.</CardDescription></CardHeader>
        <CardContent><PlaygroundForm senders={senders} /></CardContent>
      </Card>
      <Card className="min-w-0">
        <CardHeader><CardTitle className="flex items-center gap-2"><Code2 />Request examples</CardTitle><CardDescription>These examples include CC, HTML, and a base64 attachment. The API key automatically uses its associated sender.</CardDescription></CardHeader>
        <CardContent>
          <Tabs defaultValue="curl">
            <TabsList variant="line"><TabsTrigger value="curl">cURL</TabsTrigger><TabsTrigger value="javascript">JavaScript</TabsTrigger><TabsTrigger value="python">Python</TabsTrigger></TabsList>
            {Object.entries(samples).map(([name, code]) => <TabsContent key={name} value={name} className="animate-in fade-in duration-200"><div className="flex justify-end pt-4"><CopyCodeButton code={code} /></div><SyntaxCodeBlock className="mt-3" code={code} language={name === "curl" ? "bash" : name as "javascript" | "python"} /></TabsContent>)}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </div>;
}
