"use client";

import { ShieldAlert, Undo2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export function ImpersonationBanner({ email }: { email: string }) {
  const [pending, setPending] = useState(false); const router = useRouter();
  async function stop() { setPending(true); try { const result = await authClient.admin.stopImpersonating(); if (result.error) return toast.error(result.error.message ?? "Could not return to administration."); toast.success("Returned to the superadmin dashboard."); router.replace("/superadmin"); router.refresh(); } finally { setPending(false); } }
  return <div className="flex flex-col items-start justify-between gap-3 border-b border-primary/35 bg-primary/10 px-5 py-3 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><ShieldAlert className="text-primary" /><div><p className="text-sm font-semibold">Managing {email}</p><p className="text-xs text-muted-foreground">All actions use this customer’s permissions and remain auditable.</p></div></div><Button size="sm" variant="outline" disabled={pending} onClick={() => void stop()}>{pending ? <Spinner data-icon="inline-start" /> : <Undo2 data-icon="inline-start" />}{pending ? "Returning…" : "Return to superadmin"}</Button></div>;
}
