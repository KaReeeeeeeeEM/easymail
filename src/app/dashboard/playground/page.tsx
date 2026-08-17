import { Code2, FlaskConical } from "lucide-react";
import { CopyCodeButton } from "@/components/copy-code-button";
import { PageHeading } from "@/components/dashboard/page-heading";
import { PlaygroundForm } from "@/components/dashboard/playground-form";
import { SyntaxCodeBlock } from "@/components/syntax-code-block";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const endpoint = "https://easymail.almareem.com/api/v1/emails";
const samples = {
  curl: `curl --request POST '${endpoint}' \\\n  --header 'Authorization: Bearer YOUR_API_KEY' \\\n  --header 'Content-Type: application/json' \\\n  --header 'Idempotency-Key: unique-request-id' \\\n  --data '{"to":"recipient@example.com","subject":"Hello","text":"Sent with easymail"}'`,
  javascript: `const response = await fetch("${endpoint}", {\n  method: "POST",\n  headers: {\n    Authorization: \`Bearer \${process.env.EASYMAIL_API_KEY}\`,\n    "Content-Type": "application/json",\n    "Idempotency-Key": crypto.randomUUID(),\n  },\n  body: JSON.stringify({\n    to: "recipient@example.com",\n    subject: "Hello",\n    text: "Sent with easymail",\n  }),\n});\n\nconsole.log(await response.json());`,
  python: `import os, uuid, requests\n\nresponse = requests.post(\n    "${endpoint}",\n    headers={\n        "Authorization": f"Bearer {os.environ['EASYMAIL_API_KEY']}",\n        "Idempotency-Key": str(uuid.uuid4()),\n    },\n    json={\n        "to": "recipient@example.com",\n        "subject": "Hello",\n        "text": "Sent with easymail",\n    },\n    timeout=30,\n)\nprint(response.json())`,
};

export default function PlaygroundPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        eyebrow="Developer tools"
        title="API playground"
        description="Send a live test request, inspect the response, and copy production-ready examples for another application."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical />
              Try your API key
            </CardTitle>
            <CardDescription>
              The secret stays in this browser request and is never saved by the
              playground.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlaygroundForm />
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 />
              Request examples
            </CardTitle>
            <CardDescription>
              Choose a client, copy the highlighted sample, and replace the
              placeholder key securely.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl">
              <TabsList variant="line">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              {Object.entries(samples).map(([name, code]) => (
                <TabsContent
                  key={name}
                  value={name}
                  className="animate-in fade-in duration-200"
                >
                  <div className="flex justify-end pt-4">
                    <CopyCodeButton code={code} />
                  </div>
                  <SyntaxCodeBlock
                    className="mt-3"
                    code={code}
                    language={
                      name === "curl"
                        ? "bash"
                        : (name as "javascript" | "python")
                    }
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
