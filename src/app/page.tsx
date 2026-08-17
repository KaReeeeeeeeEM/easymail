import {
  ArrowRight,
  Braces,
  Check,
  KeyRound,
  LockKeyhole,
  MailCheck,
  RefreshCw,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";
import { SyntaxCodeBlock } from "@/components/syntax-code-block";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const benefits = ["One endpoint", "Workspace isolation", "Keys rotate anytime"];
const workflow = [
  {
    number: "01",
    icon: MailCheck,
    title: "Connect any SMTP sender",
    description:
      "Add a Google app password once. easymail encrypts it before it reaches storage.",
  },
  {
    number: "02",
    icon: KeyRound,
    title: "Create a key",
    description:
      "Issue a separate API key for each application or environment in your workspace.",
  },
  {
    number: "03",
    icon: Send,
    title: "Send over HTTPS",
    description:
      "Call one predictable endpoint from Node, Python, PHP, mobile, or your favorite stack.",
  },
];
const capabilities = [
  {
    icon: Users,
    title: "Personal or shared",
    description:
      "Start alone, then invite your organization without rebuilding the integration.",
    className: "md:col-span-2 lg:col-span-1 lg:row-span-2",
  },
  {
    icon: RefreshCw,
    title: "Rotate without hesitation",
    description:
      "Replace exposed or aging credentials from the dashboard in seconds.",
    className: "lg:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Safe by default",
    description:
      "Hashed API keys, encrypted SMTP secrets, bounded requests, and tenant-scoped access.",
    className: "",
  },
  {
    icon: Braces,
    title: "Made for developers",
    description:
      "Stable errors, request IDs, idempotency, OpenAPI, and examples you can paste.",
    className: "",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <PublicHeader />

      <section className="relative isolate border-b" data-reveal>
        <div className="landing-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute -end-40 top-8 -z-10 size-[34rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:py-28">
          <div>
            <Badge variant="secondary">
              <LockKeyhole />
              Reusable SMTP delivery, minus the repeated setup
            </Badge>
            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[.96] tracking-[-.06em] sm:text-6xl lg:text-7xl">
              Your email service,
              <br />
              <span className="text-primary">ready everywhere.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              Turn your Gmail account into one secure, reusable API for every
              product your team builds.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className={cn(buttonVariants({ size: "lg" }), "min-h-11 px-5")}
              >
                Get started free
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "min-h-11 px-5",
                )}
              >
                Login to easymail
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {benefits.map((item) => (
                <span className="flex items-center gap-2" key={item}>
                  <Check className="text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <ApiPreview />
        </div>
      </section>

      <section className="border-b" data-reveal>
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x px-5 sm:grid-cols-4 lg:px-8">
          {[
            ["01", "HTTPS endpoint"],
            ["256 KB", "bounded payloads"],
            ["60/min", "default key limit"],
            ["AES-256", "SMTP encryption"],
          ].map(([value, label]) => (
            <div className="px-4 py-9 text-center" key={label}>
              <strong className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {value}
              </strong>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="workflow"
        className="mx-auto max-w-7xl px-5 py-24 lg:px-8"
        data-reveal
      >
        <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <Badge variant="secondary">A short path to production</Badge>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">
              Connect once.
              <br />
              Send from anywhere.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-muted-foreground lg:justify-self-end">
            The dashboard handles credentials and access. Your applications only
            need a key and a small JSON request.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {workflow.map(({ number, icon: Icon, title, description }) => (
            <Card className="landing-card" key={number}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">
                    {number}
                  </span>
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon />
                  </span>
                </div>
                <CardTitle className="pt-7 text-xl">{title}</CardTitle>
                <CardDescription className="leading-7">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30" data-reveal>
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="bg-background">
              A service that grows with you
            </Badge>
            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-.045em] sm:text-5xl">
              Simple enough for one app.
              <br />
              Structured enough for a team.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(
              ({ icon: Icon, title, description, className }) => (
                <Card
                  className={cn("landing-card min-h-56", className)}
                  key={title}
                >
                  <CardHeader>
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon />
                    </span>
                    <CardTitle className="pt-7 text-xl">{title}</CardTitle>
                    <CardDescription className="max-w-lg leading-7">
                      {description}
                    </CardDescription>
                  </CardHeader>
                  {title === "Personal or shared" && (
                    <CardContent className="mt-auto">
                      <div className="flex flex-col gap-2 rounded-xl border bg-muted/50 p-3">
                        {[
                          "Personal workspace",
                          "Organization members",
                          "Environment-specific keys",
                        ].map((item) => (
                          <div
                            className="flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-xs"
                            key={item}
                          >
                            <Check className="text-primary" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-2 lg:items-center lg:px-8"
        data-reveal
      >
        <div>
          <Badge variant="secondary">A contract you can trust</Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">
            Useful answers, even when sending fails.
          </h2>
          <p className="mt-6 max-w-xl leading-8 text-muted-foreground">
            Every response includes a request ID. Errors use stable codes,
            duplicate requests are safely recognized, and the complete contract
            is available as OpenAPI.
          </p>
          <Link
            href="/docs"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "mt-8",
            )}
          >
            Explore documentation
            <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
        <Card className="overflow-hidden py-0">
          <CardHeader className="border-b bg-muted/40 py-5">
            <div className="flex items-center justify-between">
              <CardDescription>Structured error response</CardDescription>
              <Badge variant="secondary">401</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <SyntaxCodeBlock className="mt-0 rounded-none border-0" language="json" code={`{\n  "error": {\n    "code": "INVALID_API_KEY",\n    "message": "The API key is invalid or expired",\n    "requestId": "req_01J..."\n  }\n}`} />
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <Card className="relative overflow-hidden bg-primary text-primary-foreground">
          <div className="pointer-events-none absolute -end-20 -top-20 size-72 rounded-full bg-primary-foreground/15 blur-3xl" />
          <CardHeader className="relative p-8 lg:p-14">
            <Badge variant="secondary">Your first send is minutes away</Badge>
            <CardTitle className="mt-4 max-w-2xl text-4xl tracking-tight sm:text-5xl">
              Stop rebuilding email delivery for every project.
            </CardTitle>
            <CardDescription className="max-w-2xl text-primary-foreground/75">
              Create an easymail account, connect Gmail, and give every
              application the same clean integration.
            </CardDescription>
          </CardHeader>
          <CardFooter className="relative flex flex-wrap gap-3 px-8 pb-8 lg:px-14 lg:pb-14">
            <Link
              href="/sign-up"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Get started
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
              )}
            >
              Login
            </Link>
          </CardFooter>
        </Card>
      </section>

      <PublicFooter />
    </main>
  );
}

function ApiPreview() {
  return (
    <div className="relative">
      <div className="absolute inset-10 -z-10 rounded-full bg-primary/25 blur-3xl" />
      <Card className="landing-card rotate-[.4deg] overflow-hidden border-border/70 bg-background/95 py-0 shadow-2xl">
        <CardHeader className="border-b bg-muted/40 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-primary" />
            </div>
            <Badge variant="secondary">Live request</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center gap-3 rounded-xl border p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Send />
            </span>
            <div>
              <p className="text-sm font-semibold">POST /api/v1/emails</p>
              <p className="text-xs text-muted-foreground">
                Authorization: Bearer gms_••••••
              </p>
            </div>
          </div>
          <SyntaxCodeBlock className="mt-0 [&_.shiki]:text-xs! [&_.shiki]:leading-6!" language="json" code={`{\n  "to": "customer@example.com",\n  "subject": "Your receipt is ready",\n  "text": "Thanks for your order."\n}`} />
          <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div>
              <p className="text-sm font-semibold">Delivered through Gmail</p>
              <p className="text-xs text-muted-foreground">
                201 Created · idempotent
              </p>
            </div>
            <Badge>
              <Check />
              Sent
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
