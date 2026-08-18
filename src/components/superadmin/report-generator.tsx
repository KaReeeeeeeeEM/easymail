"use client";

import { FileDown, FilePlus2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

export function ReportGenerator() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [type, setType] = useState("delivery");
  const [format, setFormat] = useState("pdf");
  async function generate() {
    setPending(true);
    try {
      const response = await fetch("/api/superadmin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, format }),
      });
      const result = await response.json();
      if (!response.ok)
        return toast.error(
          result.error?.message ?? "Report generation failed.",
        );
      const link = document.createElement("a");
      link.href = result.data.downloadUrl;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report generated. Your download has started.");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Report generation failed.");
    } finally {
      setPending(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <FilePlus2 data-icon="inline-start" />
        Generate report
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate platform report</DialogTitle>
          <DialogDescription>
            Select the data and downloadable document format. The immutable
            snapshot remains available in the report register.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="report-type">Report</FieldLabel>
            <Select
              value={type}
              onValueChange={(value) => value && setType(value)}
            >
              <SelectTrigger id="report-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="delivery">
                    Email delivery report
                  </SelectItem>
                  <SelectItem value="users">User adoption report</SelectItem>
                  <SelectItem value="workspaces">
                    Workspace inventory report
                  </SelectItem>
                  <SelectItem value="senders">SMTP sender report</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="report-format">Download format</FieldLabel>
            <Select
              value={format}
              onValueChange={(value) => value && setFormat(value)}
            >
              <SelectTrigger id="report-format" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="pdf">PDF document (.pdf)</SelectItem>
                  <SelectItem value="docx">Word document (.docx)</SelectItem>
                  <SelectItem value="xlsx">Excel workbook (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV data (.csv)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              PDF and Word include branding, report metadata, table structure,
              and page furniture. Excel and CSV are optimized for analysis. Each
              snapshot is capped at 5,000 records.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button onClick={() => void generate()} disabled={pending}>
            {pending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <FileDown data-icon="inline-start" />
            )}
            {pending ? "Generating…" : "Generate and download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
