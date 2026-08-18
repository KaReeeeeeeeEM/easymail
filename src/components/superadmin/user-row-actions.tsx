"use client";

import { EllipsisVertical, Eye, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";

export function UserRowActions({
  item,
}: {
  item: {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    createdAt: Date;
  };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const isAdmin = item.role === "SUPER_ADMIN";
  async function manage() {
    setPending(true);
    try {
      const result = await authClient.admin.impersonateUser({
        userId: item.id,
      });
      if (result.error)
        return toast.error(
          result.error.message ?? "Could not open this account.",
        );
      toast.success(
        "You are now managing this account. Changes remain audited.",
      );
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Could not open this account.");
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${item.name}`}
            />
          }
        >
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Eye />
            View user
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isAdmin || pending}
            onClick={() => void manage()}
          >
            {pending ? <Spinner /> : <LogIn />}
            {pending ? "Opening…" : "Manage as user"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-primary">
              {item.name}
            </DialogTitle>
            <DialogDescription>
              Account identity and access information.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="overview">
            <TabsList variant="line">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Email", item.email],
                  ["Role", item.role],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border bg-muted/30 p-4"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-1 font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>
            <TabsContent value="security">
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Email status", item.emailVerified ? "Verified" : "Pending"],
                  ["Joined", item.createdAt.toLocaleString()],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border bg-muted/30 p-4"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-1 font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
