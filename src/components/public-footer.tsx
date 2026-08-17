import Link from "next/link";

import { Logo } from "@/components/logo";

const groups = [
  {
    title: "Product",
    links: [
      ["How it works", "/#workflow"],
      ["Documentation", "/docs"],
      ["OpenAPI", "/api/openapi"],
      ["Login", "/sign-in"],
    ],
  },
  {
    title: "Developers",
    links: [
      ["Quickstart", "/docs#quickstart"],
      ["Authentication", "/docs#authentication"],
      ["Errors", "/docs#errors"],
      ["Key rotation", "/docs#rotation"],
    ],
  },
  {
    title: "Company",
    links: [
      ["Create account", "/sign-up"],
      ["Security", "/docs#security"],
      ["Service health", "/api/health"],
      ["Contact", "mailto:hello@easymail.dev"],
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="relative overflow-hidden bg-footer text-footer-foreground">
      <div
        aria-hidden="true"
        className="brand-wordmark pointer-events-none absolute inset-x-0 -bottom-[.08em] text-center text-[25vw] font-semibold leading-[.72] text-footer-foreground/[.035]"
      >
        easymail
      </div>
      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-14 border-b border-footer-foreground/15 pb-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-7 max-w-sm text-sm leading-7 text-footer-muted">
              One secure SMTP delivery service for every application your team
              builds.
            </p>
          </div>
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-bold uppercase tracking-[.14em] text-footer-muted">
                {group.title}
              </h2>
              <div className="mt-6 grid gap-4 text-sm">
                {group.links.map(([label, href]) => (
                  <Link href={href} key={label}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 pt-7 text-[11px] font-semibold uppercase tracking-[.1em] text-footer-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 easymail</p>
          <div className="flex gap-5">
            <Link href="/docs#security">Security</Link>
            <Link href="/docs">API documentation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
