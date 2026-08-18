"use client";

import { Clipboard, Download, EllipsisVertical, Eye } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { DetailTable } from "@/components/detail-table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type DetailField = { label: string; value: React.ReactNode };
export function RowActionMenu({
  id,
  title,
  description,
  fields,
  downloadUrl,
}: {
  id: string;
  title: string;
  description: string;
  fields: DetailField[];
  downloadUrl?: string;
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
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Eye />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void copyId()}>
              <Clipboard />
              Copy ID
            </DropdownMenuItem>
            {downloadUrl ? (
              <DropdownMenuItem render={<a href={downloadUrl} download />}>
                <Download />
                Download
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-primary">
              {title}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="overview">
            <TabsList variant="line">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <DetailTable
                rows={fields.slice(0, Math.ceil(fields.length / 2))}
              />
            </TabsContent>
            <TabsContent value="metadata">
              <DetailTable rows={fields.slice(Math.ceil(fields.length / 2))} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
