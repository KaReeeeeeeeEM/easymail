import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { createReportFile } from "../src/lib/report-files";

const outputDirectory = path.join(process.cwd(), "tmp", "report-verification");
await mkdir(outputDirectory, { recursive: true });

const rows = [
  {
    Status: "sent",
    Recipients: "customer@example.com",
    Subject: "Your order receipt is ready",
    Accepted: "customer@example.com",
    Rejected: "None",
    "Provider message ID": "provider-message-001",
    Created: "2026-08-18T05:15:00.000Z",
    Sent: "2026-08-18T05:15:01.000Z",
  },
  {
    Status: "failed",
    Recipients: "operations@example.com",
    Subject: "Daily delivery exception summary",
    Accepted: "None",
    Rejected: "operations@example.com",
    "Provider message ID": "Not available",
    Created: "2026-08-18T05:20:00.000Z",
    Sent: "Not recorded",
  },
];

for (const format of ["pdf", "docx", "xlsx", "csv"] as const) {
  const file = await createReportFile({
    id: "42f99bc3-1f99-46b2-90b2-0cfeb2517448",
    title: "Email delivery report",
    format,
    rows,
    generatedBy: "administrator@easymail.almareem.com",
    createdAt: new Date("2026-08-18T05:30:00.000Z"),
  });
  await writeFile(path.join(outputDirectory, file.filename), file.buffer);
}

console.log(outputDirectory);
