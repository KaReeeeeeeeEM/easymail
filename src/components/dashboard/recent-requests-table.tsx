"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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

type RequestRow = {
  id: string;
  subject: string;
  recipients: string[];
  status: "pending" | "sent" | "failed";
  createdAt: string;
};
const PAGE_SIZE = 8;

export function RecentRequestsTable({ requests }: { requests: RequestRow[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(
    () =>
      requests.filter((request) =>
        `${request.subject} ${request.recipients.join(" ")} ${request.status}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, requests],
  );
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <>
      <div className="border-y p-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search requests…"
            aria-label="Search recent requests"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="max-w-64 truncate font-medium">
                {item.subject}
              </TableCell>
              <TableCell>
                {item.recipients[0]}
                {item.recipients.length > 1
                  ? ` +${item.recipients.length - 1}`
                  : ""}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.status === "failed" ? "destructive" : "secondary"
                  }
                >
                  {item.status === "sent" ? "Accepted" : item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {new Date(item.createdAt).toLocaleString("en", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
            </TableRow>
          ))}
          {!rows.length && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-28 text-center text-muted-foreground"
              >
                No requests match your search.
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
    </>
  );
}
