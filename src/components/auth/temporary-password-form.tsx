"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { PasswordRequirements, meetsPasswordRequirements } from "@/components/auth/password-requirements";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

export function TemporaryPasswordForm() {
  const router = useRouter(); const [pending, setPending] = useState(false); const [password, setPassword] = useState("");
  async function submit(formData: FormData) {
    const currentPassword = String(formData.get("currentPassword")); const newPassword = String(formData.get("newPassword")); const confirmation = String(formData.get("confirmation"));
    if (!meetsPasswordRequirements(newPassword)) return toast.error("Please meet every password requirement.");
    if (newPassword !== confirmation) return toast.error("New passwords do not match.");
    setPending(true);
    try { const response = await fetch("/api/account/temporary-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) }); const result = await response.json(); if (!response.ok) return toast.error(result.error?.message ?? "Password could not be changed."); toast.success("Your permanent password is ready. Welcome to Easymail."); router.replace("/dashboard"); router.refresh(); } finally { setPending(false); }
  }
  return <form onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }}><FieldGroup><Field><FieldLabel htmlFor="temporary-password">Temporary password</FieldLabel><PasswordInput id="temporary-password" name="currentPassword" autoComplete="current-password" placeholder="Enter the password from your email" required /></Field><Field><FieldLabel htmlFor="permanent-password">New password</FieldLabel><PasswordInput id="permanent-password" name="newPassword" autoComplete="new-password" placeholder="Create your permanent password" minLength={10} maxLength={128} onChange={(event) => setPassword(event.target.value)} required /><PasswordRequirements password={password} /></Field><Field><FieldLabel htmlFor="permanent-password-confirmation">Confirm new password</FieldLabel><PasswordInput id="permanent-password-confirmation" name="confirmation" autoComplete="new-password" placeholder="Repeat your permanent password" minLength={10} maxLength={128} required /><FieldDescription>This replaces the temporary credential and revokes your other sessions.</FieldDescription></Field><Button type="submit" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : <Save data-icon="inline-start" />}{pending ? "Securing account…" : "Save permanent password"}</Button></FieldGroup></form>;
}
