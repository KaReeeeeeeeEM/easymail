import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { ScrollProgress } from "@/components/scroll-progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  return (
    <><header className="fixed inset-x-0 top-0 z-50 border-b bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-5 lg:px-8">
        <Logo />
        <nav
          className="flex items-center gap-1"
          aria-label="Primary navigation"
        >
          <Link
            href="/docs"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            Docs
          </Link>
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden min-[390px]:inline-flex",
            )}
          >
            Login
          </Link>
          <Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
            Get started
            <ArrowRight data-icon="inline-end" />
          </Link>
          <ThemeToggle />
        </nav>
      </div>
      <ScrollProgress />
    </header><div className="h-16" aria-hidden /></>
  );
}
