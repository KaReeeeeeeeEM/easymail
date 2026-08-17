"use client";

import { Clipboard, EllipsisVertical, Eye } from "lucide-react";
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

export type DetailField = { label: string; value: React.ReactNode };
export function RowActionMenu({
  id,
  title,
  description,
  fields,
}: {
  id: string;
  title: string;
  description: string;
  fields: DetailField[];
}) {
  const [open, setOpen] = useState(false);
  async function copyId() {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("ID copied to clipboard.");
    } catch {
      toast.error("Could not copy the ID.");
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
              aria-label={`Actions for ${title}`}
            />
          }
        >
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Eye />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void copyId()}>
            <Clipboard />
            Copy ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <dl className="grid gap-3 border-t pt-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.label}
                className="rounded-lg border bg-muted/30 p-4"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {field.label}
                </dt>
                <dd className="mt-1 break-words font-medium">{field.value}</dd>
              </div>
            ))}
          </dl>
        </DialogContent>
      </Dialog>
    </>
  );
}
