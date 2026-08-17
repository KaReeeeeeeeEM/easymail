"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setDefaultSender } from "@/features/email/application/configure-smtp";
import { Spinner } from "@/components/ui/spinner";

export function SetDefaultSenderButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  return <Button variant="outline" size="sm" disabled={pending} onClick={async () => { setPending(true); try { const result = await setDefaultSender(id); if (result.success) toast.success(result.message); else toast.error(result.message); } finally { setPending(false); } }}>{pending && <Spinner data-icon="inline-start" />}{pending ? "Updating…" : "Make default"}</Button>;
}
