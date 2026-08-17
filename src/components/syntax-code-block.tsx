import { codeToHtml } from "shiki";

import { cn } from "@/lib/utils";

type SyntaxCodeBlockProps = {
  code: string;
  language?: "bash" | "javascript" | "json" | "python" | "text";
  className?: string;
};

export async function SyntaxCodeBlock({
  code,
  language = "text",
  className,
}: SyntaxCodeBlockProps) {
  const html = await codeToHtml(code.trim(), {
    lang: language,
    themes: { light: "github-dark-default", dark: "vesper" },
    defaultColor: false,
  });

  return (
    <div
      className={cn("syntax-code mt-6 overflow-hidden rounded-xl border", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
