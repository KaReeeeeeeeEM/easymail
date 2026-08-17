"use client";

import { LogIn } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export function ImpersonateUserButton({ userId, disabled = false }: { userId: string; disabled?: boolean }) {
  const [pending, setPending] = useState(false); const router = useRouter();
  async function manage() { setPending(true); try { const result = await authClient.admin.impersonateUser({ userId }); if (result.error) return toast.error(result.error.message ?? "Could not open this user account."); toast.success("You are now managing this account. Changes remain audited."); router.push("/dashboard"); router.refresh(); } catch { toast.error("Could not open this user account."); } finally { setPending(false); } }
  return <Button size="sm" variant="outline" disabled={disabled || pending} onClick={() => void manage()}>{pending ? <Spinner data-icon="inline-start" /> : <LogIn data-icon="inline-start" />}{pending ? "Opening…" : "Manage as user"}</Button>;
}
