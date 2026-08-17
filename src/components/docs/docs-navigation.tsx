"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const chapters = [
  ["overview", "Overview"], ["quickstart", "Quickstart"], ["authentication", "Authentication"],
  ["send-email", "Send email"], ["fields", "Request fields"], ["idempotency", "Idempotency"],
  ["responses", "Responses"], ["errors", "Errors"], ["limits", "Limits"],
  ["rotation", "Key rotation"], ["security", "Security"], ["troubleshooting", "Troubleshooting"],
] as const;

export function DocsNavigation() {
  const [active, setActive] = useState("overview");
  useEffect(() => {
    const sections = chapters.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-18% 0px -65%", threshold: [0, 0.15, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <nav className="sticky top-24 flex flex-col gap-1 text-sm" aria-label="Documentation chapters">
    {chapters.map(([id, label]) => <Link key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} className={cn("rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground", active === id && "bg-primary/10 font-medium text-primary")}>{label}</Link>)}
    <Link href="/api/openapi" className="mt-3 rounded-lg px-3 py-2 font-medium text-primary">OpenAPI JSON ↗</Link>
  </nav>;
}
