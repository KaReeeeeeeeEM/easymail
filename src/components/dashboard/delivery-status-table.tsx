"use client";

import { useMemo, useState } from "react";
import { Eye, Inbox, MailCheck, Paperclip, Search } from "lucide-react";

import { TablePagination } from "@/components/dashboard/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Delivery = {
  id: string;
  subject: string;
  recipients: string[];
  ccRecipients: string[];
  status: "pending" | "sent" | "failed";
  acceptedRecipients: string[];
  rejectedRecipients: string[];
  providerMessageId: string | null;
  providerResponse: string | null;
  errorCode: string | null;
  textBody: string | null;
  htmlBody: string | null;
  attachmentNames: string[];
  senderLabel: string | null;
  senderEmail: string | null;
  createdAt: string;
  sentAt: string | null;
};

function statusLabel(status: Delivery["status"]) {
  if (status === "sent") return "SMTP accepted";
  if (status === "failed") return "Failed";
  return "Pending";
}

function StatusBadge({ status }: { status: Delivery["status"] }) {
  return (
    <Badge variant={status === "failed" ? "destructive" : status === "sent" ? "secondary" : "outline"}>
      {statusLabel(status)}
    </Badge>
  );
}

function DetailRows({ delivery }: { delivery: Delivery }) {
  const rows = [
    ["Status", statusLabel(delivery.status)],
    ["Sender", delivery.senderEmail ? `${delivery.senderLabel ?? "Sender"} · ${delivery.senderEmail}` : "Sender removed"],
    ["To", delivery.recipients.join(", ")],
    ["CC", delivery.ccRecipients.join(", ") || "None"],
    ["Accepted", delivery.acceptedRecipients.join(", ") || "None"],
    ["Rejected", delivery.rejectedRecipients.join(", ") || "None"],
    ["Submitted", new Date(delivery.createdAt).toLocaleString()],
    ["Accepted at", delivery.sentAt ? new Date(delivery.sentAt).toLocaleString() : "Not accepted"],
    ["Provider message ID", delivery.providerMessageId ?? "Not available"],
    ["Provider response", delivery.providerResponse ?? "Not available"],
    ["Error code", delivery.errorCode ?? "None"],
    ["Attachments", delivery.attachmentNames.join(", ") || "None"],
  ];
  return (
    <Table>
      <TableBody>
        {rows.map(([label, value]) => (
          <TableRow key={label}>
            <TableCell className="w-48 font-medium text-muted-foreground">{label}</TableCell>
            <TableCell className="break-all">{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function DeliveryStatusTable({ deliveries }: { deliveries: Delivery[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Delivery | null>(null);
  const pageSize = 10;
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return deliveries;
    return deliveries.filter((delivery) =>
      [delivery.subject, delivery.senderEmail ?? "", ...delivery.recipients, ...delivery.acceptedRecipients, statusLabel(delivery.status)]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [deliveries, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Sent email requests</CardTitle>
          <CardDescription>
            SMTP accepted means the provider accepted the recipient. It does not prove inbox placement or an email open.
          </CardDescription>
        </CardHeader>
        <div className="border-y p-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              placeholder="Search subject, recipient, or status…"
              aria-label="Search deliveries"
            />
          </div>
        </div>
        <CardContent className="p-0">
          {visible.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="max-w-64 truncate font-medium">{delivery.subject}</TableCell>
                    <TableCell className="max-w-60 truncate">{delivery.recipients.join(", ")}</TableCell>
                    <TableCell>{delivery.senderLabel ?? "Removed sender"}</TableCell>
                    <TableCell><StatusBadge status={delivery.status} /></TableCell>
                    <TableCell>{new Date(delivery.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => setSelected(delivery)}><Eye data-icon="inline-start" />View details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Empty className="min-h-96">
              <EmptyHeader>
                <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
                <EmptyTitle>{deliveries.length ? "No matching deliveries" : "No email requests yet"}</EmptyTitle>
                <EmptyDescription>{deliveries.length ? "Try a different subject, recipient, or status." : "Send an email through the API or playground to see its status here."}</EmptyDescription>
              </EmptyHeader>
              <EmptyContent />
            </Empty>
          )}
          <TablePagination page={page} pageCount={pageCount} total={filtered.length} onPageChange={setPage} />
        </CardContent>
      </Card>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-4xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject}</DialogTitle>
                <DialogDescription>Review the submitted message and the SMTP provider response.</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="status">
                <TabsList variant="line">
                  <TabsTrigger value="status"><MailCheck data-icon="inline-start" />Status details</TabsTrigger>
                  <TabsTrigger value="preview"><Eye data-icon="inline-start" />Email preview</TabsTrigger>
                </TabsList>
                <TabsContent value="status" className="pt-4"><DetailRows delivery={selected} /></TabsContent>
                <TabsContent value="preview" className="pt-4">
                  {selected.htmlBody ? (
                    <div className="overflow-hidden rounded-xl border bg-white">
                      <iframe title={`Preview of ${selected.subject}`} sandbox="" srcDoc={selected.htmlBody} className="h-[55vh] w-full" />
                    </div>
                  ) : selected.textBody ? (
                    <pre className="max-h-[55vh] min-h-72 overflow-auto whitespace-pre-wrap rounded-xl border bg-muted/40 p-5 text-sm">{selected.textBody}</pre>
                  ) : (
                    <Empty className="min-h-72 border">
                      <EmptyHeader><EmptyMedia variant="icon">{selected.attachmentNames.length ? <Paperclip /> : <Eye />}</EmptyMedia><EmptyTitle>Preview unavailable</EmptyTitle><EmptyDescription>This request was recorded before message previews were enabled.</EmptyDescription></EmptyHeader>
                    </Empty>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
