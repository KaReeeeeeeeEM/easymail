"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PageRevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section, [data-reveal]"),
    );
    sections.forEach((section) => (section.dataset.reveal = "true"));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((section) => (section.dataset.visible = "true"));
      return;
    }
    document.documentElement.dataset.motionReady = "true";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.1 },
    );
    sections.forEach((section) => {
      const bounds = section.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.92 && bounds.bottom > 0) section.dataset.visible = "true";
      else observer.observe(section);
    });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
