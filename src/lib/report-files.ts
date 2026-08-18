import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  ImageRun,
  Packer,
  PageNumber,
  PageOrientation,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import ExcelJS from "exceljs";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";

import type { ReportFormat, ReportRow } from "@/lib/report-snapshots";

type ReportFileInput = {
  id: string;
  title: string;
  format: ReportFormat;
  rows: ReportRow[];
  generatedBy: string;
  createdAt: Date;
};

const ORANGE = "FF9100";
const INK = "171717";
const MUTED = "666666";

function columns(rows: ReportRow[]) {
  return rows.length ? Object.keys(rows[0]) : ["Result"];
}

function normalizedRows(rows: ReportRow[]) {
  return rows.length ? rows : [{ Result: "No records matched this report." }];
}

function text(value: ReportRow[string]) {
  return value === null ? "Not available" : String(value);
}

function safeName(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function csvCell(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function createCsv(rows: ReportRow[]) {
  const data = normalizedRows(rows);
  const headers = columns(data);
  const lines = [headers.map(csvCell).join(",")];
  for (const row of data)
    lines.push(headers.map((header) => csvCell(text(row[header]))).join(","));
  return Buffer.from(`\uFEFF${lines.join("\r\n")}`, "utf8");
}

async function createXlsx(input: ReportFileInput) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "easymail";
  workbook.created = input.createdAt;
  const sheet = workbook.addWorksheet("Report", {
    views: [{ state: "frozen", ySplit: 4 }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      paperSize: 9,
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.65,
        bottom: 0.65,
        header: 0.25,
        footer: 0.25,
      },
    },
  });
  const data = normalizedRows(input.rows);
  const headers = columns(data);
  sheet.mergeCells(1, 1, 1, Math.max(headers.length, 1));
  const title = sheet.getCell(1, 1);
  title.value = input.title;
  title.font = {
    name: "Aptos Display",
    size: 20,
    bold: true,
    color: { argb: ORANGE },
  };
  title.alignment = { vertical: "middle" };
  sheet.getRow(1).height = 34;
  sheet.mergeCells(2, 1, 2, Math.max(headers.length, 1));
  sheet.getCell(2, 1).value =
    `Generated ${input.createdAt.toISOString()} by ${input.generatedBy}`;
  sheet.getCell(2, 1).font = {
    name: "Aptos",
    size: 10,
    color: { argb: MUTED },
  };
  sheet.addRow([]);
  const headerRow = sheet.addRow(headers);
  headerRow.font = { name: "Aptos", bold: true, color: { argb: "FFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: ORANGE },
  };
  headerRow.alignment = { vertical: "middle", wrapText: true };
  headerRow.height = 26;
  for (const row of data) {
    const excelRow = sheet.addRow(headers.map((header) => row[header]));
    excelRow.font = { name: "Aptos", size: 10, color: { argb: INK } };
    excelRow.alignment = { vertical: "top", wrapText: true };
  }
  headers.forEach((header, index) => {
    const longest = Math.max(
      header.length,
      ...data.map((row) => text(row[header]).length),
    );
    sheet.getColumn(index + 1).width = Math.min(Math.max(longest + 3, 14), 42);
  });
  sheet.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: 4 + data.length, column: headers.length },
  };
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

async function logoBytes() {
  return readFile(path.join(process.cwd(), "public", "easymail-wordmark.png"));
}

function docCell(value: string, header = false) {
  return new TableCell({
    shading: header
      ? { type: ShadingType.CLEAR, color: "auto", fill: ORANGE }
      : undefined,
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: value,
            bold: header,
            color: header ? "FFFFFF" : INK,
            font: "Aptos",
            size: 19,
          }),
        ],
      }),
    ],
  });
}

async function createDocx(input: ReportFileInput) {
  const data = normalizedRows(input.rows);
  const headers = columns(data);
  const logo = await logoBytes();
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: headers.map((header) => docCell(header, true)),
    }),
    ...data.map(
      (row) =>
        new TableRow({
          children: headers.map((header) => docCell(text(row[header]))),
        }),
    ),
  ];
  const document = new Document({
    creator: "easymail",
    title: input.title,
    description: "A generated easymail management report.",
    styles: {
      default: {
        document: {
          run: { font: "Aptos", size: 22, color: INK },
          paragraph: { spacing: { after: 120, line: 264 } },
        },
      },
      paragraphStyles: [
        {
          id: "ReportTitle",
          name: "Report title",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Aptos Display", size: 36, bold: true, color: INK },
          paragraph: { spacing: { before: 120, after: 100 } },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Aptos Display", size: 28, bold: true, color: ORANGE },
          paragraph: { spacing: { before: 260, after: 120 } },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
              width: 12240,
              height: 15840,
            },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: logo,
                    transformation: { width: 112, height: 32 },
                    type: "png",
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "easymail  |  ",
                    color: MUTED,
                    size: 18,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    color: MUTED,
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            style: "ReportTitle",
            children: [new TextRun(input.title)],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Management research report",
                bold: true,
                color: ORANGE,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated: ${input.createdAt.toISOString()}`,
                color: MUTED,
                size: 20,
              }),
              new TextRun({
                text: `Prepared by: ${input.generatedBy}`,
                break: 1,
                color: MUTED,
                size: 20,
              }),
              new TextRun({
                text: `Report ID: ${input.id}`,
                break: 1,
                color: MUTED,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            style: "Heading1",
            children: [new TextRun("Executive summary")],
          }),
          new Paragraph({
            children: [
              new TextRun(
                `This report contains ${input.rows.length.toLocaleString()} records captured from the platform at generation time. The snapshot is retained for auditability and reproducible management review.`,
              ),
            ],
          }),
          new Paragraph({
            style: "Heading1",
            children: [new TextRun("Report data")],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Table 1. Platform snapshot",
                italics: true,
                color: MUTED,
              }),
            ],
          }),
          new Table({
            width: { size: 12960, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.SINGLE, color: "D4D4D8", size: 4 },
              bottom: { style: BorderStyle.SINGLE, color: "D4D4D8", size: 4 },
              left: { style: BorderStyle.SINGLE, color: "D4D4D8", size: 4 },
              right: { style: BorderStyle.SINGLE, color: "D4D4D8", size: 4 },
              insideHorizontal: {
                style: BorderStyle.SINGLE,
                color: "E4E4E7",
                size: 3,
              },
              insideVertical: {
                style: BorderStyle.SINGLE,
                color: "E4E4E7",
                size: 3,
              },
            },
            rows: tableRows,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Note. Records reflect the stored platform snapshot and may contain provider-reported delivery states. SMTP acceptance does not guarantee inbox placement.",
                italics: true,
                color: MUTED,
                size: 18,
              }),
            ],
            spacing: { before: 120 },
          }),
        ],
      },
    ],
  });
  return Buffer.from(await Packer.toBuffer(document));
}

function wrap(value: string, font: PDFFont, size: number, width: number) {
  const words = value.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  const tokens = words.flatMap((word) => {
    if (font.widthOfTextAtSize(word, size) <= width) return [word];
    const chunks: string[] = [];
    let chunk = "";
    for (const character of word) {
      if (font.widthOfTextAtSize(chunk + character, size) <= width) {
        chunk += character;
      } else {
        if (chunk) chunks.push(chunk);
        chunk = character;
      }
    }
    if (chunk) chunks.push(chunk);
    return chunks;
  });
  for (const word of tokens) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width) line = candidate;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

async function createPdf(input: ReportFileInput) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(input.title);
  pdf.setAuthor("easymail");
  pdf.setSubject("Platform management report");
  pdf.setCreationDate(input.createdAt);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const logo = await pdf.embedPng(await logoBytes());
  const pageSize: [number, number] = [841.89, 595.28];
  const margin = 54;
  const orange = rgb(1, 0.5686, 0);
  const ink = rgb(0.09, 0.09, 0.1);
  const muted = rgb(0.38, 0.38, 0.41);
  const rule = rgb(0.86, 0.86, 0.88);
  const data = normalizedRows(input.rows);
  const headers = columns(data);
  const tableWidth = pageSize[0] - margin * 2;
  const colWidth = tableWidth / headers.length;
  let page!: PDFPage;
  let y = 0;

  function addPage(continuation = false) {
    page = pdf.addPage(pageSize);
    const scaled = logo.scaleToFit(112, 32);
    page.drawImage(logo, {
      x: margin,
      y: pageSize[1] - margin + 8,
      width: scaled.width,
      height: scaled.height,
    });
    page.drawText(continuation ? `${input.title} - continued` : input.title, {
      x: margin,
      y: pageSize[1] - 105,
      font: bold,
      size: continuation ? 15 : 24,
      color: ink,
    });
    if (!continuation) {
      page.drawText("MANAGEMENT RESEARCH REPORT", {
        x: margin,
        y: pageSize[1] - 78,
        font: bold,
        size: 9,
        color: orange,
      });
      page.drawText(
        `Generated ${input.createdAt.toISOString()}  |  Prepared by ${input.generatedBy}  |  ${input.id}`,
        {
          x: margin,
          y: pageSize[1] - 124,
          font: regular,
          size: 8,
          color: muted,
        },
      );
      page.drawText(`Executive summary`, {
        x: margin,
        y: pageSize[1] - 160,
        font: bold,
        size: 13,
        color: orange,
      });
      page.drawText(
        `This immutable snapshot contains ${input.rows.length.toLocaleString()} platform records for management review and audit.`,
        {
          x: margin,
          y: pageSize[1] - 180,
          font: regular,
          size: 10,
          color: ink,
        },
      );
      page.drawText("Table 1", {
        x: margin,
        y: pageSize[1] - 218,
        font: bold,
        size: 10,
        color: ink,
      });
      page.drawText("Platform snapshot", {
        x: margin,
        y: pageSize[1] - 233,
        font: italic,
        size: 10,
        color: ink,
      });
      y = pageSize[1] - 255;
    } else y = pageSize[1] - 126;
  }

  function drawHeader() {
    const height = 34;
    headers.forEach((header, index) => {
      const x = margin + index * colWidth;
      page.drawRectangle({
        x,
        y: y - height,
        width: colWidth,
        height,
        color: orange,
      });
      const lines = wrap(header, bold, 7.5, colWidth - 12).slice(0, 2);
      lines.forEach((line, lineIndex) =>
        page.drawText(line, {
          x: x + 6,
          y: y - 13 - lineIndex * 9,
          font: bold,
          size: 7.5,
          color: rgb(1, 1, 1),
        }),
      );
    });
    y -= height;
  }

  addPage();
  drawHeader();
  data.forEach((row, rowIndex) => {
    const cells = headers.map((header) =>
      wrap(text(row[header]), regular, 7.5, colWidth - 12).slice(0, 4),
    );
    const height = Math.max(
      25,
      Math.max(...cells.map((cell) => cell.length)) * 9 + 10,
    );
    if (y - height < 58) {
      addPage(true);
      drawHeader();
    }
    cells.forEach((lines, index) => {
      const x = margin + index * colWidth;
      if (rowIndex % 2 === 1)
        page.drawRectangle({
          x,
          y: y - height,
          width: colWidth,
          height,
          color: rgb(0.975, 0.975, 0.98),
        });
      page.drawLine({
        start: { x, y: y - height },
        end: { x: x + colWidth, y: y - height },
        thickness: 0.5,
        color: rule,
      });
      lines.forEach((line, lineIndex) =>
        page.drawText(line, {
          x: x + 6,
          y: y - 13 - lineIndex * 9,
          font: regular,
          size: 7.5,
          color: ink,
        }),
      );
    });
    y -= height;
  });
  page.drawText(
    "Note. Records reflect the stored snapshot. SMTP acceptance does not guarantee inbox placement.",
    { x: margin, y: Math.max(y - 22, 46), font: italic, size: 8, color: muted },
  );
  const pages = pdf.getPages();
  pages.forEach((current, index) => {
    current.drawLine({
      start: { x: margin, y: 34 },
      end: { x: pageSize[0] - margin, y: 34 },
      thickness: 0.5,
      color: rule,
    });
    current.drawText(`easymail  |  Confidential management report`, {
      x: margin,
      y: 20,
      font: regular,
      size: 7.5,
      color: muted,
    });
    const label = `Page ${index + 1} of ${pages.length}`;
    current.drawText(label, {
      x: pageSize[0] - margin - regular.widthOfTextAtSize(label, 7.5),
      y: 20,
      font: regular,
      size: 7.5,
      color: muted,
    });
  });
  return Buffer.from(await pdf.save());
}

export async function createReportFile(input: ReportFileInput) {
  const handlers = {
    csv: () => Promise.resolve(createCsv(input.rows)),
    xlsx: () => createXlsx(input),
    docx: () => createDocx(input),
    pdf: () => createPdf(input),
  } satisfies Record<ReportFormat, () => Promise<Buffer>>;
  const mime = {
    csv: "text/csv; charset=utf-8",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pdf: "application/pdf",
  } satisfies Record<ReportFormat, string>;
  return {
    buffer: await handlers[input.format](),
    mime: mime[input.format],
    filename: `${safeName(input.title)}-${input.id.slice(0, 8)}.${input.format}`,
  };
}
