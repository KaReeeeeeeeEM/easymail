"use client";

import { EllipsisVertical, Eye, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { DetailTable } from "@/components/detail-table";
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
  DropdownMenuGroup,
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
          <DropdownMenuGroup>
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
          </DropdownMenuGroup>
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
              <DetailTable
                rows={[
                  { label: "Email", value: item.email },
                  { label: "Role", value: item.role },
                ]}
              />
            </TabsContent>
            <TabsContent value="security">
              <DetailTable
                rows={[
                  {
                    label: "Email status",
                    value: item.emailVerified ? "Verified" : "Pending",
                  },
                  { label: "Joined", value: item.createdAt.toLocaleString() },
                ]}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
