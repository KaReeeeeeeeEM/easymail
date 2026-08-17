"use client";

import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const requirements = [
  { label: "10–128 characters", test: (value: string) => value.length >= 10 && value.length <= 128 },
  { label: "One uppercase and one lowercase letter", test: (value: string) => /[A-Z]/.test(value) && /[a-z]/.test(value) },
  { label: "One number", test: (value: string) => /\d/.test(value) },
  { label: "One special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const;

export function meetsPasswordRequirements(password: string) {
  return requirements.every(({ test }) => test(password));
}

export function PasswordRequirements({ password }: { password: string }) {
  return <ul className="grid gap-1.5 text-xs" aria-label="Password requirements" aria-live="polite">
    {requirements.map(({ label, test }) => {
      const complete = test(password);
      const Icon = complete ? Check : Circle;
      return <li key={label} className={cn("flex items-center gap-2 text-muted-foreground", complete && "text-primary")}><Icon className="size-3.5" aria-hidden="true" /><span>{label}</span><span className="sr-only">{complete ? "met" : "not met"}</span></li>;
    })}
  </ul>;
}
