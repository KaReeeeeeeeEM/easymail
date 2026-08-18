"use client";

import { Bell, BellRing, CheckCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

type Notification = {
  id: string;
  title: string;
  description: string;
  type: string;
  readAt: Date | null;
  createdAt: Date;
};

export function NotificationList({
  initialNotifications,
}: {
  initialNotifications: Notification[];
}) {
  const [items, setItems] = useState(initialNotifications);
  const [pending, setPending] = useState<string | null>(null);
  const [clearOpen, setClearOpen] = useState(false);
  async function action(
    input:
      | { action: "mark-read"; id: string }
      | { action: "mark-all-read" }
      | { action: "clear-all" },
  ) {
    setPending(input.action === "mark-read" ? input.id : input.action);
    try {
      const response = await fetch("/api/superadmin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok)
        return toast.error(
          result.error?.message ?? "Notification action failed.",
        );
      if (input.action === "mark-read")
        setItems((current) =>
          current.map((item) =>
            item.id === input.id ? { ...item, readAt: new Date() } : item,
          ),
        );
      if (input.action === "mark-all-read")
        setItems((current) =>
          current.map((item) => ({
            ...item,
            readAt: item.readAt ?? new Date(),
          })),
        );
      if (input.action === "clear-all") {
        setItems([]);
        setClearOpen(false);
      }
      toast.success(
        input.action === "clear-all"
          ? "All notifications cleared."
          : "Notifications marked as read.",
      );
    } catch {
      toast.error("Could not update notifications.");
    } finally {
      setPending(null);
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          variant="outline"
          disabled={!items.some((item) => !item.readAt) || pending !== null}
          onClick={() => void action({ action: "mark-all-read" })}
        >
          {pending === "mark-all-read" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <CheckCheck data-icon="inline-start" />
          )}
          Mark all as read
        </Button>
        <Button
          variant="destructive"
          disabled={!items.length || pending !== null}
          onClick={() => setClearOpen(true)}
        >
          <Trash2 data-icon="inline-start" />
          Clear all
        </Button>
      </div>
      {items.length ? (
        <div className="overflow-hidden rounded-xl border bg-card">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 border-b p-5 last:border-b-0 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  {item.readAt ? <Bell /> : <BellRing />}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{item.title}</h2>
                    {!item.readAt && <Badge>New</Badge>}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                  <time className="mt-2 block text-xs text-muted-foreground">
                    {item.createdAt.toLocaleString()}
                  </time>
                </div>
              </div>
              {!item.readAt && (
                <Button
                  size="sm"
                  disabled={pending === item.id}
                  onClick={() =>
                    void action({ action: "mark-read", id: item.id })
                  }
                >
                  {pending === item.id ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <CheckCheck data-icon="inline-start" />
                  )}
                  Mark as read
                </Button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <Empty className="min-h-80 rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bell />
            </EmptyMedia>
            <EmptyTitle>No notifications</EmptyTitle>
            <EmptyDescription>
              New security, reporting, and platform events will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle className="font-bold text-primary">
              Clear all notifications?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes every notification in your list. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pending !== null}
              onClick={() => void action({ action: "clear-all" })}
            >
              {pending === "clear-all" ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Trash2 data-icon="inline-start" />
              )}
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
