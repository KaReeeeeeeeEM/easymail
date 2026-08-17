"use client";

import { FileDown, FilePlus2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

export function ReportGenerator() {
  const router = useRouter(); const [open, setOpen] = useState(false); const [pending, setPending] = useState(false); const [type, setType] = useState("delivery");
  async function generate() { setPending(true); try { const response = await fetch("/api/superadmin/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type }) }); const result = await response.json(); if (!response.ok) return toast.error(result.error?.message ?? "Report generation failed."); toast.success("Report generated and added to the register."); setOpen(false); router.refresh(); } finally { setPending(false); } }
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button />}><FilePlus2 data-icon="inline-start" />Generate report</DialogTrigger><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Generate platform report</DialogTitle><DialogDescription>Select a report definition. The generated snapshot is recorded with its author, row count, and timestamp.</DialogDescription></DialogHeader><Field><FieldLabel htmlFor="report-type">Report</FieldLabel><Select value={type} onValueChange={(value) => value && setType(value)}><SelectTrigger id="report-type" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="delivery">Email delivery report</SelectItem><SelectItem value="users">User adoption report</SelectItem><SelectItem value="workspaces">Workspace inventory report</SelectItem><SelectItem value="senders">SMTP sender report</SelectItem></SelectGroup></SelectContent></Select><FieldDescription>Reports use a bounded, current platform snapshot and are recorded for auditability.</FieldDescription></Field><DialogFooter><Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>Cancel</Button><Button onClick={() => void generate()} disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : <FileDown data-icon="inline-start" />}{pending ? "Generating…" : "Generate report"}</Button></DialogFooter></DialogContent></Dialog>;
}
