import {
  AlertTriangle,
  CheckCircle2,
  Info,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";
import { SyntaxCodeBlock } from "@/components/syntax-code-block";
import { DocsNavigation } from "@/components/docs/docs-navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const examples = {
  curl: `curl https://your-domain.com/api/v1/emails \\
  -H "Authorization: Bearer $EASYMAIL_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: receipt-order-9382" \\
  -d '{
    "to": "customer@example.com",
    "subject": "Your receipt",
    "text": "Thanks for your order."
  }'`,
  javascript: `const response = await fetch("https://your-domain.com/api/v1/emails", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.EASYMAIL_API_KEY}\`,
    "Content-Type": "application/json",
    "Idempotency-Key": "receipt-order-9382",
  },
  body: JSON.stringify({
    to: "customer@example.com",
    subject: "Your receipt",
    text: "Thanks for your order.",
  }),
});

const result = await response.json();
if (!response.ok) throw new Error(result.error.code);`,
  python: `import os
import requests

response = requests.post(
    "https://your-domain.com/api/v1/emails",
    headers={
        "Authorization": f"Bearer {os.environ['EASYMAIL_API_KEY']}",
        "Idempotency-Key": "receipt-order-9382",
    },
    json={
        "to": "customer@example.com",
        "subject": "Your receipt",
        "text": "Thanks for your order.",
    },
    timeout=30,
)
response.raise_for_status()`,
};

const requestFields = [
  ["senderId", "UUID", "Optional", "Confirm the sender assigned to the API key. The key's sender is always used when omitted."],
  [
    "to",
    "string | string[]",
    "Required",
    "One address or an array of up to 50 valid email addresses.",
  ],
  [
    "subject",
    "string",
    "Required",
    "Message subject between 1 and 200 characters.",
  ],
  [
    "text",
    "string",
    "Conditional",
    "Plain-text body. Either text or html must be present.",
  ],
  [
    "html",
    "string",
    "Conditional",
    "HTML body. Either html or text must be present.",
  ],
  ["cc", "string[]", "Optional", "Up to 20 carbon-copy recipients."],
  ["bcc", "string[]", "Optional", "Up to 20 blind-carbon-copy recipients."],
  ["replyTo", "string", "Optional", "Address that receives replies."],
];
const errors = [
  ["400", "INVALID_JSON", "The request body is not valid JSON."],
  ["401", "API_KEY_REQUIRED", "No API key was supplied."],
  ["401", "INVALID_API_KEY", "The key is invalid, revoked, or expired."],
  [
    "409",
    "SMTP_NOT_CONFIGURED",
    "The workspace has no matching SMTP sender.",
  ],
  ["413", "PAYLOAD_TOO_LARGE", "The request exceeds 256 KB."],
  ["415", "UNSUPPORTED_MEDIA_TYPE", "Content-Type is not application/json."],
  ["422", "VALIDATION_ERROR", "One or more request fields are invalid."],
  ["502", "DELIVERY_FAILED", "The SMTP provider did not accept the message."],
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicHeader />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-12 lg:grid-cols-[230px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <DocsNavigation />
        </aside>
        <article className="docs-article min-w-0 max-w-4xl text-foreground">
          <section id="overview" data-reveal>
            <Badge variant="secondary">REST API · v1</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">
              API documentation
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              Connect one or more SMTP senders, then send transactional email
              from any application through a stable HTTPS contract. This guide covers
              setup, authentication, requests, errors, rotation, and operational
              safety.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <SummaryCard label="Base URL" value="https://your-domain.com" />
              <SummaryCard label="Endpoint" value="POST /api/v1/emails" />
              <SummaryCard label="Authentication" value="Bearer API key" />
            </div>
          </section>
          <DocSeparator />
          <section id="quickstart" data-reveal>
            <SectionHeading
              kicker="Start here"
              title="Quickstart"
              description="Complete these steps in order. The full setup normally takes only a few minutes."
            />
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                [
                  "01",
                  "Create a workspace",
                  "Register, name your personal or organization workspace, and keep it active.",
                ],
                [
                  "02",
                  "Connect an SMTP sender",
                  "Add Gmail, Workspace, Outlook, or custom SMTP credentials and verify the connection.",
                ],
                [
                  "03",
                  "Create an API key and assign its SMTP sender",
                  "Copy the secret immediately and store it outside your source code.",
                ],
              ].map(([number, title, description]) => (
                <Card key={number}>
                  <CardHeader>
                    <span className="text-xs font-semibold text-primary">
                      {number}
                    </span>
                    <CardTitle className="pt-5 text-lg">{title}</CardTitle>
                    <CardDescription className="leading-7">
                      {description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <Alert className="mt-6">
              <Info />
              <AlertTitle>Google app passwords</AlertTitle>
              <AlertDescription>
                Your Google account must have two-step verification enabled
                before Google exposes app passwords. Never enter your normal
                Google password into easymail.
              </AlertDescription>
            </Alert>
          </section>
          <DocSeparator />
          <section id="authentication" data-reveal>
            <SectionHeading
              kicker="Identity"
              title="Authentication"
              description="Every email request requires an organization-owned API key associated with one SMTP sender. Dashboard session cookies are never accepted by the public email endpoint."
            />
            <SyntaxCodeBlock code={`Authorization: Bearer gms_your_secret_key`} language="text" />
            <p className="mt-5 leading-7 text-muted-foreground">
              You may alternatively send the same secret in the{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">x-api-key</code>{" "}
              header. Bearer authentication is recommended because it works
              consistently with proxies and standard HTTP clients.
            </p>
            <Alert className="mt-6">
              <KeyRound />
              <AlertTitle>Keys are shown once</AlertTitle>
              <AlertDescription>
                easymail stores a hash, not the original secret. If a key is
                lost, create or rotate it instead of trying to recover it.
              </AlertDescription>
            </Alert>
          </section>
          <DocSeparator />
          <section id="send-email" data-reveal>
            <SectionHeading
              kicker="Endpoint"
              title="Send an email"
              description="Send JSON to POST /api/v1/emails. The configured workspace sender controls the From address."
            />
            <Tabs defaultValue="curl" className="mt-7">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              {Object.entries(examples).map(([language, code]) => (
                <TabsContent value={language} key={language}>
                  <SyntaxCodeBlock code={code} language={language === "curl" ? "bash" : language as "javascript" | "python"} />
                </TabsContent>
              ))}
            </Tabs>
            <Alert className="mt-6">
              <CheckCircle2 />
              <AlertTitle>Successful SMTP acceptance</AlertTitle>
              <AlertDescription>
                A new send returns 201 Created. Replaying the same idempotency
                key returns the original record with 200 OK and{" "}
                <code>duplicate: true</code>.
              </AlertDescription>
            </Alert>
          </section>
          <DocSeparator />
          <section id="fields" data-reveal>
            <SectionHeading
              kicker="Schema"
              title="Request fields"
              description="Unknown fields are rejected, preventing accidental From-address spoofing or unsupported Nodemailer options."
            />
            <Card className="mt-7 overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requirement</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestFields.map(
                      ([field, type, requirement, description]) => (
                        <TableRow key={field}>
                          <TableCell className="font-mono">{field}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {type}
                          </TableCell>
                          <TableCell>{requirement}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {description}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
          <DocSeparator />
          <section id="idempotency" data-reveal>
            <SectionHeading
              kicker="Safe retries"
              title="Idempotency"
              description="Use a stable Idempotency-Key whenever your application might retry a send after a timeout or temporary network failure."
            />
            <SyntaxCodeBlock code={`Idempotency-Key: order-9382-receipt`} language="text" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Good keys</CardTitle>
                  <CardDescription>
                    Use a business event identifier such as{" "}
                    <code>password-reset-user-42-attempt-1</code>.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Scope</CardTitle>
                  <CardDescription>
                    Keys are unique within a workspace and may contain up to 200
                    characters.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>
          <DocSeparator />
          <section id="responses" data-reveal>
            <SectionHeading
              kicker="Contract"
              title="Success responses"
              description="Responses include the delivery record and a request ID for tracing."
            />
            <SyntaxCodeBlock language="json" code={`{
  "data": {
    "id": "44df90ce-...",
    "status": "sent",
    "messageId": "<provider-message-id@gmail.com>",
    "accepted": ["customer@example.com"],
    "rejected": [],
    "duplicate": false
  },
  "requestId": "12d4139c-..."
}`} />
            <p className="mt-5 leading-7 text-muted-foreground">
              The same request ID is also returned in the{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">
                x-request-id
              </code>{" "}
              response header.
            </p>
            <h3 className="mt-8 text-lg font-semibold">Check request status</h3>
            <p className="mt-2 leading-7 text-muted-foreground">Call <code>GET /api/v1/emails/{"{id}"}</code> with the same API-key header. A status of <code>accepted</code> means the SMTP provider accepted at least one recipient; it does not guarantee inbox placement or that the recipient opened the message.</p>
            <SyntaxCodeBlock language="bash" code={`curl https://your-domain.com/api/v1/emails/44df90ce-... \\
  -H "Authorization: Bearer $EASYMAIL_API_KEY"`} />
          </section>
          <DocSeparator />
          <section id="errors" data-reveal>
            <SectionHeading
              kicker="Recovery"
              title="Errors"
              description="Error codes are stable and safe to use in application logic. Human messages may become clearer over time."
            />
            <Card className="mt-7 overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Meaning</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {errors.map(([status, code, meaning]) => (
                      <TableRow key={code}>
                        <TableCell>{status}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {code}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {meaning}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <SyntaxCodeBlock language="json" code={`{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The API key is invalid or expired",
    "requestId": "12d4139c-..."
  }
}`} />
          </section>
          <DocSeparator />
          <section id="limits" data-reveal>
            <SectionHeading
              kicker="Boundaries"
              title="Limits and timeouts"
              description="These defaults keep delivery predictable and protect every workspace from accidental overload."
            />
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard label="Request body" value="256 KB" />
              <SummaryCard label="To recipients" value="50" />
              <SummaryCard label="CC / BCC" value="20 each" />
              <SummaryCard label="Default rate" value="60 / minute" />
            </div>
            <p className="mt-5 leading-7 text-muted-foreground">
              The endpoint has a 30-second execution budget. Treat 502 responses
              and client-side timeouts as retryable only when you also supplied
              an idempotency key.
            </p>
          </section>
          <DocSeparator />
          <section id="rotation" data-reveal>
            <SectionHeading
              kicker="Credential lifecycle"
              title="Rotate an API key"
              description="Rotation creates a replacement and revokes the selected key. Plan the change so applications do not lose access."
            />
            <ol className="mt-7 grid gap-4">
              <Step
                number="1"
                text="Open Dashboard → API keys and identify the key used by your application."
              />
              <Step
                number="2"
                text="Select Rotate, then immediately copy the replacement secret."
              />
              <Step
                number="3"
                text="Update the secret in your deployment platform or secret manager."
              />
              <Step
                number="4"
                text="Redeploy or restart the application and verify a test email."
              />
            </ol>
            <Alert variant="destructive" className="mt-6">
              <AlertTriangle />
              <AlertTitle>The old key stops working</AlertTitle>
              <AlertDescription>
                Current rotation revokes the previous key immediately. For
                zero-downtime changes, create a second key manually, deploy it,
                verify it, and then revoke the old key.
              </AlertDescription>
            </Alert>
          </section>
          <DocSeparator />
          <section id="security" data-reveal>
            <SectionHeading
              kicker="Operations"
              title="Security guidance"
              description="easymail protects credentials at the platform boundary, while your application must protect its API key."
            />
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {[
                "Keep API keys in a managed secret store, never source control.",
                "Use separate keys for development, staging, and production.",
                "Rotate immediately after suspected exposure or staff changes.",
                "Never log Authorization, x-api-key, or SMTP passwords.",
                "Use idempotency keys for user-visible or financial messages.",
                "Review provider activity and rotate unused SMTP credentials.",
              ].map((item) => (
                <Card key={item}>
                  <CardHeader className="flex-row items-start gap-3">
                    <ShieldCheck className="text-primary" />
                    <CardDescription className="leading-6 text-foreground">
                      {item}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
          <DocSeparator />
          <section id="troubleshooting" data-reveal>
            <SectionHeading
              kicker="Help"
              title="Troubleshooting"
              description="Start with the response code and request ID, then work through the matching check."
            />
            <div className="mt-7 flex flex-col gap-3">
              {[
                [
                  "SMTP_NOT_CONFIGURED",
                  "Connect a verified SMTP sender and create or rotate a key associated with it.",
                ],
                [
                  "DELIVERY_FAILED",
                  "Confirm the SMTP host, port, security mode, username, and password are current.",
                ],
                [
                  "INVALID_API_KEY",
                  "Confirm the complete secret is deployed without whitespace and has not been rotated.",
                ],
                [
                  "Duplicate response",
                  "Your Idempotency-Key was already used. Generate a new key only for a genuinely new email event.",
                ],
                [
                  "Client timeout",
                  "Retry with the same Idempotency-Key, then use the returned request ID for investigation.",
                ],
              ].map(([title, description]) => (
                <Card key={title}>
                  <CardHeader>
                    <CardTitle className="font-mono text-sm">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
        </article>
      </div>
      <PublicFooter />
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="break-words text-base">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">
        {kicker}
      </p>
      <h2 className="mt-3 scroll-mt-24 text-3xl font-semibold tracking-[-.035em]">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
function Step({ number, text }: { number: string; text: string }) {
  return (
    <li className="flex gap-4 rounded-xl border p-4">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {number}
      </span>
      <p className="self-center text-sm leading-6">{text}</p>
    </li>
  );
}
function DocSeparator() {
  return <Separator className="my-12" />;
}
