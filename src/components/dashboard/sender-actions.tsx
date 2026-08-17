"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { setDefaultSender } from "@/features/email/application/configure-smtp";
import { Spinner } from "@/components/ui/spinner";

export function SetDefaultSenderButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  return <Button variant="outline" size="sm" disabled={pending} onClick={async () => { setPending(true); try { const result = await setDefaultSender(id); if (result.success) toast.success(result.message); else toast.error(result.message); } catch { toast.error("Could not update the default sender. Please try again."); } finally { setPending(false); } }}>{pending ? <Spinner data-icon="inline-start" /> : <Star data-icon="inline-start" />}{pending ? "Updating…" : "Make default"}</Button>;
}
