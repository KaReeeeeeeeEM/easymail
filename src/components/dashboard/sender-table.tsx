"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SetDefaultSenderButton } from "@/components/dashboard/sender-actions";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Sender = { id: string; label: string; host: string; port: number; secure: boolean; senderName: string; senderEmail: string; isDefault: boolean; lastVerifiedAt: string | null };
const PAGE_SIZE = 8;

export function SenderTable({ senders }: { senders: Sender[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => senders.filter((sender) => `${sender.label} ${sender.senderName} ${sender.senderEmail} ${sender.host}`.toLowerCase().includes(query.toLowerCase())), [query, senders]);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return <div className="overflow-hidden rounded-xl border bg-card">
    <div className="border-b p-4"><div className="relative max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search senders…" aria-label="Search SMTP senders" /></div></div>
    <Table><TableHeader><TableRow><TableHead>Sender</TableHead><TableHead>Connection</TableHead><TableHead>Status</TableHead><TableHead>Verified</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>
      {rows.map((sender) => <TableRow key={sender.id}><TableCell><p className="font-medium">{sender.label}</p><p className="text-xs text-muted-foreground">{sender.senderName} &lt;{sender.senderEmail}&gt;</p></TableCell><TableCell>{sender.host}:{sender.port} · {sender.secure ? "TLS" : "STARTTLS"}</TableCell><TableCell><Badge variant={sender.isDefault ? "default" : "secondary"}>{sender.isDefault ? "Default" : "Active"}</Badge></TableCell><TableCell className="text-muted-foreground">{sender.lastVerifiedAt ? new Date(sender.lastVerifiedAt).toLocaleDateString("en", { dateStyle: "medium" }) : "—"}</TableCell><TableCell className="text-right">{!sender.isDefault && <SetDefaultSenderButton id={sender.id} />}</TableCell></TableRow>)}
      {!rows.length && <TableRow><TableCell colSpan={5} className="h-28 text-center text-muted-foreground">No SMTP senders match your search.</TableCell></TableRow>}
    </TableBody></Table>
    <TablePagination page={page} pageCount={pageCount} total={filtered.length} onPageChange={setPage} />
  </div>;
}
