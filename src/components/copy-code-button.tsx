"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      aria-busy={pending}
      onClick={async () => {
        setPending(true);
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          toast.success("Code copied");
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          toast.error("Code could not be copied.");
        } finally {
          setPending(false);
        }
      }}
    >
      {pending ? (
        <Spinner data-icon="inline-start" />
      ) : copied ? (
        <Check data-icon="inline-start" />
      ) : (
        <Copy data-icon="inline-start" />
      )}
      {pending ? "Copying…" : copied ? "Copied" : "Copy"}
    </Button>
  );
}
