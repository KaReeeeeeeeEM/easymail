"use client";

import { Eye } from "lucide-react";
import { DetailTable } from "@/components/detail-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Sender = {
  label: string;
  host: string;
  port: number;
  secure: boolean;
  senderName: string;
  senderEmail: string;
  isDefault: boolean;
  lastVerifiedAt: string | null;
};

export function SenderDetailsDialog({ sender }: { sender: Sender }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Eye data-icon="inline-start" />
        View
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{sender.label}</DialogTitle>
          <DialogDescription>
            Verified sender configuration and connection details.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="overview">
          <TabsList variant="line" className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
          </TabsList>
          <TabsContent
            value="overview"
            className="animate-in fade-in duration-200"
          >
            <DetailTable
              rows={[
                {
                  label: "Sender",
                  value: `${sender.senderName} <${sender.senderEmail}>`,
                },
                {
                  label: "Status",
                  value: sender.isDefault ? "Default sender" : "Active sender",
                },
                {
                  label: "Last verified",
                  value: sender.lastVerifiedAt
                    ? new Date(sender.lastVerifiedAt).toLocaleString("en", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Not recorded",
                },
              ]}
            />
          </TabsContent>
          <TabsContent
            value="connection"
            className="animate-in fade-in duration-200"
          >
            <DetailTable
              rows={[
                { label: "Host", value: sender.host },
                { label: "Port", value: String(sender.port) },
                {
                  label: "Security",
                  value: sender.secure ? "SSL/TLS" : "STARTTLS",
                },
              ]}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
