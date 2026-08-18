"use client";

import { useMemo, useState } from "react";
import { Copy, KeyRound, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { PageHeading } from "@/components/dashboard/page-heading";
import {
  DeleteConfirmDialog,
  UpdateConfirmDialog,
} from "@/components/confirm-action-dialog";

type KeySummary = {
  id: string;
  name: string | null;
  start: string | null;
  createdAt: Date;
  enabled: boolean | null;
  metadata: { senderId?: string } | null;
};

type SenderSummary = { id: string; label: string; senderEmail: string };

export function ApiKeyManager({
  organizationId,
  initialKeys,
  senders,
}: {
  organizationId: string;
  initialKeys: KeySummary[];
  senders: SenderSummary[];
}) {
  const [keys, setKeys] = useState<KeySummary[]>(initialKeys);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [copyPending, setCopyPending] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<KeySummary | null>(null);
  const [rotateTarget, setRotateTarget] = useState<KeySummary | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const filteredKeys = useMemo(
    () =>
      keys.filter((key) =>
        `${key.name ?? ""} ${key.start ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [keys, query],
  );
  const pageCount = Math.ceil(filteredKeys.length / pageSize);
  const visibleKeys = filteredKeys.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  async function load() {
    const result = await authClient.apiKey.list({ query: { organizationId } });
    if (result.data) setKeys(result.data.apiKeys as KeySummary[]);
  }

  async function create(formData: FormData) {
    setPendingAction("create");
    try {
      const result = await authClient.apiKey.create({
        name: String(formData.get("name")),
        organizationId,
        metadata: { senderId: String(formData.get("senderId")) },
      });
      if (result.error || !result.data) {
        toast.error(result.error?.message ?? "Could not create API key");
        return;
      }
      setCreateOpen(false);
      setSecret(result.data.key);
      toast.success("API key created. Copy the secret now.");
      await load();
    } catch {
      toast.error("Could not create the API key. Please try again.");
    } finally {
      setPendingAction(null);
    }
  }
  async function remove(id: string) {
    setPendingAction(`remove:${id}`);
    try {
      const result = await authClient.apiKey.delete({ keyId: id });
      if (result.error)
        return toast.error(
          result.error.message ?? "Could not revoke the API key",
        );
      toast.success("API key revoked");
      await load();
    } catch {
      toast.error("Could not revoke the API key. Please try again.");
    } finally {
      setPendingAction(null);
    }
  }
  async function rotate(key: KeySummary) {
    setPendingAction(`rotate:${key.id}`);
    try {
      const result = await authClient.apiKey.create({
        name: `${key.name ?? "API key"} (rotated)`,
        organizationId,
        metadata: key.metadata?.senderId
          ? key.metadata
          : { senderId: senders[0]?.id },
      });
      if (result.error || !result.data)
        return toast.error(result.error?.message ?? "Could not rotate key");
      const revoked = await authClient.apiKey.delete({ keyId: key.id });
      if (revoked.error)
        return toast.error(
          revoked.error.message ?? "Could not revoke the previous API key",
        );
      setSecret(result.data.key);
      toast.success("API key rotated. Copy the new secret now.");
      await load();
    } catch {
      toast.error("Could not rotate the API key. Please try again.");
    } finally {
      setPendingAction(null);
    }
  }
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        eyebrow="Developer access"
        title="API keys"
        description="Create, search, rotate, and revoke the credentials your applications use."
        action={
          <Button
            onClick={() => setCreateOpen(true)}
            disabled={!senders.length}
          >
            <Plus data-icon="inline-start" />
            Create key
          </Button>
        }
      />
      <Dialog
        open={createOpen}
        onOpenChange={(open) => !pendingAction && setCreateOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API key</DialogTitle>
            <DialogDescription>
              The secret is shown once. Store it in your application&apos;s
              secret manager.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void create(new FormData(event.currentTarget));
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="key-name">Key name</FieldLabel>
                <Input
                  id="key-name"
                  name="name"
                  placeholder="Production website"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="key-sender">SMTP sender</FieldLabel>
                <Select name="senderId" required>
                  <SelectTrigger id="key-sender" className="w-full">
                    <SelectValue placeholder="Select an SMTP sender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {senders.map((sender) => (
                        <SelectItem key={sender.id} value={sender.id}>
                          {sender.label} — {sender.senderEmail}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <DialogFooter>
                <Button type="submit" disabled={Boolean(pendingAction)}>
                  {pendingAction === "create" ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <KeyRound data-icon="inline-start" />
                  )}
                  {pendingAction === "create" ? "Creating key…" : "Create key"}
                </Button>
              </DialogFooter>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Workspace keys</CardTitle>
          <CardDescription>
            Search, rotate, or revoke credentials for this workspace.
          </CardDescription>
        </CardHeader>
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
              placeholder="Search API keys…"
              aria-label="Search API keys"
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>{key.name}</TableCell>
                  <TableCell className="font-mono">
                    {key.start ?? "gms_••••••••"}
                  </TableCell>
                  <TableCell>
                    {senders.find(
                      (sender) => sender.id === key.metadata?.senderId,
                    )?.label ?? "Unassigned"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={Boolean(pendingAction) || !senders.length}
                      onClick={() => setRotateTarget(key)}
                    >
                      {pendingAction === `rotate:${key.id}` ? (
                        <Spinner data-icon="inline-start" />
                      ) : (
                        <RefreshCw data-icon="inline-start" />
                      )}
                      {pendingAction === `rotate:${key.id}`
                        ? "Rotating…"
                        : "Rotate"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={Boolean(pendingAction)}
                      onClick={() => setDeleteTarget(key)}
                      aria-label={`Revoke ${key.name}`}
                    >
                      {pendingAction === `remove:${key.id}` ? (
                        <Spinner />
                      ) : (
                        <Trash2 />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!visibleKeys.length && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-28 text-center text-muted-foreground"
                  >
                    No API keys match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            pageCount={pageCount}
            total={filteredKeys.length}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
      <Dialog
        open={Boolean(secret)}
        onOpenChange={(open) => !open && setSecret(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy your API key</DialogTitle>
            <DialogDescription>
              This secret cannot be shown again.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <KeyRound />
            <AlertTitle>New easymail key</AlertTitle>
            <AlertDescription className="break-all font-mono">
              {secret}
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button
              disabled={copyPending}
              aria-busy={copyPending}
              onClick={async () => {
                if (!secret) return;
                setCopyPending(true);
                try {
                  await navigator.clipboard.writeText(secret);
                  toast.success("Copied");
                } catch {
                  toast.error("The API key could not be copied.");
                } finally {
                  setCopyPending(false);
                }
              }}
            >
              {copyPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Copy data-icon="inline-start" />
              )}
              {copyPending ? "Copying key…" : "Copy key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <UpdateConfirmDialog
        open={Boolean(rotateTarget)}
        onOpenChange={(open) => !open && setRotateTarget(null)}
        entityName={rotateTarget?.name ?? "this API key"}
        pending={Boolean(
          rotateTarget && pendingAction === `rotate:${rotateTarget.id}`,
        )}
        onConfirm={async () => {
          if (!rotateTarget) return;
          await rotate(rotateTarget);
          setRotateTarget(null);
        }}
      />
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        entityName={deleteTarget?.name ?? "API key"}
        pending={Boolean(
          deleteTarget && pendingAction === `remove:${deleteTarget.id}`,
        )}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await remove(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
