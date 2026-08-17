"use client";

import { useState } from "react";
import { Copy, KeyRound, LoaderCircle, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type KeySummary = { id: string; name: string | null; start: string | null; createdAt: Date; enabled: boolean | null };

export function ApiKeyManager({ organizationId, initialKeys }: { organizationId: string; initialKeys: KeySummary[] }) {
  const [keys, setKeys] = useState<KeySummary[]>(initialKeys); const [pending, setPending] = useState(false); const [secret, setSecret] = useState<string | null>(null);
  async function load() { const result = await authClient.apiKey.list({ query: { organizationId } }); if (result.data) setKeys(result.data.apiKeys as KeySummary[]); }

  async function create(formData: FormData) {
    setPending(true); const result = await authClient.apiKey.create({ name: String(formData.get("name")), organizationId }); setPending(false);
    if (result.error || !result.data) { toast.error(result.error?.message ?? "Could not create API key"); return; }
    setSecret(result.data.key); await load();
  }
  async function remove(id: string) { const result = await authClient.apiKey.delete({ keyId: id }); if (result.error) return toast.error(result.error.message); toast.success("API key revoked"); await load(); }
  async function rotate(key: KeySummary) {
    setPending(true); const result = await authClient.apiKey.create({ name: `${key.name ?? "API key"} (rotated)`, organizationId });
    if (result.error || !result.data) { setPending(false); return toast.error(result.error?.message ?? "Could not rotate key"); }
    await authClient.apiKey.delete({ keyId: key.id }); setSecret(result.data.key); setPending(false); await load();
  }
  return <div className="flex flex-col gap-6"><Card><CardHeader><CardTitle>Create API key</CardTitle><CardDescription>The secret is shown once. Store it in your application&apos;s secret manager.</CardDescription></CardHeader><CardContent><form action={create}><FieldGroup><Field><FieldLabel htmlFor="key-name">Key name</FieldLabel><Input id="key-name" name="name" placeholder="Production website" required /></Field><Button disabled={pending}>{pending && <LoaderCircle data-icon="inline-start" className="animate-spin" />}Create key</Button></FieldGroup></form></CardContent></Card><Card><CardHeader><CardTitle>Workspace keys</CardTitle><CardDescription>Rotate a key immediately if it may have been exposed.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Key</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{keys.map((key) => <TableRow key={key.id}><TableCell>{key.name}</TableCell><TableCell className="font-mono">{key.start ?? "gms_••••••••"}</TableCell><TableCell><Badge variant="secondary">Active</Badge></TableCell><TableCell className="flex justify-end gap-2"><Button variant="outline" size="sm" onClick={() => rotate(key)}><RefreshCw data-icon="inline-start" />Rotate</Button><Button variant="destructive" size="sm" onClick={() => remove(key.id)} aria-label={`Revoke ${key.name}`}><Trash2 /></Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card><Dialog open={Boolean(secret)} onOpenChange={(open) => !open && setSecret(null)}><DialogContent><DialogHeader><DialogTitle>Copy your API key</DialogTitle><DialogDescription>This secret cannot be shown again.</DialogDescription></DialogHeader><Alert><KeyRound /><AlertTitle>New easymail key</AlertTitle><AlertDescription className="break-all font-mono">{secret}</AlertDescription></Alert><DialogFooter><Button onClick={() => { if (secret) void navigator.clipboard.writeText(secret); toast.success("Copied"); }}><Copy data-icon="inline-start" />Copy key</Button></DialogFooter></DialogContent></Dialog></div>;
}
