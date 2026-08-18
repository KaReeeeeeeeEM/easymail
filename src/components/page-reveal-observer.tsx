"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PageRevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const reducedMotion = matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const registered = new WeakSet<HTMLElement>();
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

    function register(section: HTMLElement) {
      if (registered.has(section)) return;
      registered.add(section);
      section.dataset.reveal = "true";
      if (reducedMotion) {
        section.dataset.visible = "true";
        return;
      }
      window.requestAnimationFrame(() => {
        if (!section.isConnected) return;
        const bounds = section.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 0.96 && bounds.bottom > 0)
          section.dataset.visible = "true";
        else observer.observe(section);
      });
    }

    function registerWithin(root: ParentNode) {
      if (root instanceof HTMLElement && root.matches("section, [data-reveal]"))
        register(root);
      root
        .querySelectorAll<HTMLElement>("section, [data-reveal]")
        .forEach(register);
    }

    registerWithin(document);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) registerWithin(node);
        });
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, [pathname]);
  return null;
}
