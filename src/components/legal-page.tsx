import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { PublicFooter } from "@/components/public-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export type LegalSection = {
  title: string;
  paragraphs: string[];
  items?: string[];
};

export function LegalPage({
  title,
  summary,
  sections,
}: {
  title: string;
  summary: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" render={<Link href="/" />}>
              <ArrowLeft data-icon="inline-start" />
              Back home
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[16rem_minmax(0,48rem)] lg:px-8 lg:py-20">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-medium text-primary">Legal</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Effective and last updated: August 17, 2026
          </p>
        </aside>
        <article className="flex flex-col gap-10">
          <p className="text-xl leading-8 text-muted-foreground">{summary}</p>
          {sections.map((section) => (
            <section
              key={section.title}
              className="flex flex-col gap-4 border-t pt-8"
            >
              <h2 className="text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-7 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ul className="flex list-disc flex-col gap-2 ps-6 text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item} className="leading-7">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </main>
      <PublicFooter />
    </div>
  );
}
