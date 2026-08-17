"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { MailPlus, Search, SearchX } from "lucide-react";
import { SetDefaultSenderButton } from "@/components/dashboard/sender-actions";
import { SenderDetailsDialog } from "@/components/dashboard/sender-details-dialog";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type Sender = {
  id: string;
  label: string;
  host: string;
  port: number;
  secure: boolean;
  senderName: string;
  senderEmail: string;
  isDefault: boolean;
  lastVerifiedAt: string | null;
};
const PAGE_SIZE = 8;

export function SenderTable({
  senders,
  emptyAction,
}: {
  senders: Sender[];
  emptyAction?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(
    () =>
      senders.filter((sender) =>
        `${sender.label} ${sender.senderName} ${sender.senderEmail} ${sender.host}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, senders],
  );
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b p-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search senders…"
            aria-label="Search SMTP senders"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sender</TableHead>
            <TableHead>Connection</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((sender) => (
            <TableRow key={sender.id}>
              <TableCell>
                <p className="font-medium">{sender.label}</p>
                <p className="text-xs text-muted-foreground">
                  {sender.senderName} &lt;{sender.senderEmail}&gt;
                </p>
              </TableCell>
              <TableCell>
                {sender.host}:{sender.port} ·{" "}
                {sender.secure ? "TLS" : "STARTTLS"}
              </TableCell>
              <TableCell>
                <Badge variant={sender.isDefault ? "default" : "secondary"}>
                  {sender.isDefault ? "Default" : "Active"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {sender.lastVerifiedAt
                  ? new Date(sender.lastVerifiedAt).toLocaleDateString("en", {
                      dateStyle: "medium",
                    })
                  : "—"}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <SenderDetailsDialog sender={sender} />
                  {!sender.isDefault && (
                    <SetDefaultSenderButton id={sender.id} />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!rows.length && (
            <TableRow>
              <TableCell colSpan={5}>
                <Empty className="min-h-64">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      {senders.length ? <SearchX /> : <MailPlus />}
                    </EmptyMedia>
                    <EmptyTitle>
                      {senders.length
                        ? "No matching senders"
                        : "No SMTP senders"}
                    </EmptyTitle>
                    <EmptyDescription>
                      {senders.length
                        ? "Try another search term."
                        : "Add a verified SMTP sender before sending email through the API."}
                    </EmptyDescription>
                  </EmptyHeader>
                  {!senders.length && emptyAction && (
                    <EmptyContent>{emptyAction}</EmptyContent>
                  )}
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        page={page}
        pageCount={pageCount}
        total={filtered.length}
        onPageChange={setPage}
      />
    </div>
  );
}
