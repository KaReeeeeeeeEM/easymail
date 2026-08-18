"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki/bundle/web";

import { cn } from "@/lib/utils";

export function LiveSyntaxCodeBlock({
  code,
  language,
  className,
}: {
  code: string;
  language: "bash" | "javascript" | "python";
  className?: string;
}) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(() => {
      void codeToHtml(code.trim(), {
        lang: language,
        themes: { light: "github-dark-default", dark: "vesper" },
        defaultColor: false,
      }).then((highlighted) => {
        if (active) setHtml(highlighted);
      });
    }, 100);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [code, language]);

  return (
    <div
      className={cn(
        "syntax-code min-h-48 overflow-hidden rounded-xl border",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
