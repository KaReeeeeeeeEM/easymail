"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setDefaultSender } from "@/features/email/application/configure-smtp";

export function SetDefaultSenderButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  return <Button variant="outline" size="sm" disabled={pending} onClick={async () => { setPending(true); const result = await setDefaultSender(id); setPending(false); if (result.success) toast.success(result.message); else toast.error(result.message); }}>{pending ? "Updating…" : "Make default"}</Button>;
}
