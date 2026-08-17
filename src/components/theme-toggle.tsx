"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";

const subscribe = () => () => {};
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const dark = mounted && resolvedTheme === "dark";

  function changeTheme(event: React.MouseEvent<HTMLButtonElement>) {
    const next = dark ? "light" : "dark";
    const documentWithTransition = document as ViewTransitionDocument;
    if (
      !documentWithTransition.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(next);
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    document.documentElement.style.setProperty("--theme-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-y", `${y}px`);
    document.documentElement.style.setProperty("--theme-radius", `${radius}px`);
    documentWithTransition.startViewTransition(() =>
      flushSync(() => setTheme(next)),
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={dark ? "Use light theme" : "Use dark theme"}
      onClick={changeTheme}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
