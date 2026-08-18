"use client";

import { OnboardingProvider, useOnboarding, type OnboardingStep } from "@onboardjs/react";
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type GuideStep = { title: string; description: string; target: string };
type Guide = { title: string; description: string; steps: GuideStep[] };

const guides: Record<string, Guide> = {
  overview: { title: "Welcome to your workspace", description: "Let us point out the controls that keep your email service healthy.", steps: [{ title: "Your delivery command center", description: "Overview brings request volume, acceptance, sender health, and recent requests into one operational view.", target: "nav-overview" }, { title: "Keep work isolated", description: "Use the workspace switcher below the logo to create or move between isolated senders, keys, and requests.", target: "workspace-switcher" }] },
  "api-keys": { title: "API keys, without surprises", description: "Connect applications to one verified sender at a time.", steps: [{ title: "Manage keys here", description: "Search, rotate, and revoke credentials from the API keys page without exposing stored secrets.", target: "nav-api-keys" }, { title: "Test before shipping", description: "Use Playground to verify a key and copy working syntax-highlighted requests before integrating.", target: "nav-playground" }] },
  sender: { title: "Connect delivery providers", description: "Saved credentials are encrypted and verified before use.", steps: [{ title: "Configure SMTP senders", description: "Choose Gmail, Outlook, or custom SMTP and verify the live connection before saving.", target: "nav-smtp-senders" }, { title: "Read the provider guides", description: "Documentation explains app passwords and secure SMTP setup for every supported provider.", target: "nav-documentation" }] },
  docs: { title: "Build against the API", description: "Everything needed for a production integration lives here.", steps: [{ title: "Use the dashboard documentation", description: "Follow the production endpoint, authentication, idempotency, HTML, CC, and attachment examples.", target: "nav-documentation" }, { title: "Validate requests live", description: "Move to Playground whenever you want to test a sender and copy working code.", target: "nav-playground" }] },
  playground: { title: "Test before integrating", description: "Compose a real request without re-entering stored SMTP credentials.", steps: [{ title: "Open the testing workspace", description: "Choose a sender, preview HTML, add recipients or files, and send through the production delivery path.", target: "nav-playground" }, { title: "Keep keys scoped", description: "Return to API keys to rotate access or bind a different verified sender.", target: "nav-api-keys" }] },
  profile: { title: "Keep your account secure", description: "Manage identity, passwords, and passkeys from one place.", steps: [{ title: "Review profile security", description: "Your verified Gmail address anchors account recovery and security notifications.", target: "nav-profile" }, { title: "Review workspace preferences", description: "Settings controls apply to the workspace currently selected in the sidebar.", target: "nav-settings" }] },
  settings: { title: "Workspace preferences", description: "Tune account and workspace behavior safely.", steps: [{ title: "Understand the active scope", description: "Settings belong to the workspace selected under the logo.", target: "nav-settings" }, { title: "Switch safely", description: "Move between isolated workspaces without mixing senders, keys, or request history.", target: "workspace-switcher" }] },
};

function guideKey(pathname: string) { return pathname === "/dashboard" ? "overview" : pathname.split("/").filter(Boolean).at(-1) ?? "overview"; }

function TourCard({ guide, onDone }: { guide: Guide; onDone: () => Promise<void> }) {
  const { state, next, previous, loading } = useOnboarding();
  const [finishing, setFinishing] = useState(false);
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [direction, setDirection] = useState(1);
  const index = Math.max(0, (state?.currentStepNumber ?? 1) - 1);
  const content = guide.steps[index] ?? guide.steps[0];
  useEffect(() => {
    if (!content) return;
    let frame = 0;
    let scrolled = false;
    const sync = () => {
      const target = Array.from(document.querySelectorAll<HTMLElement>(`[data-onboarding="${content.target}"]`)).find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      if (!target) { setTargetRect(null); frame = requestAnimationFrame(sync); return; }
      const rect = target.getBoundingClientRect();
      if (!scrolled && (rect.bottom < 72 || rect.top > innerHeight - 40)) { scrolled = true; target.scrollIntoView({ behavior: "smooth", block: "center" }); }
      setTargetRect(rect);
      frame = requestAnimationFrame(sync);
    };
    sync();
    return () => cancelAnimationFrame(frame);
  }, [content]);

  if (!mounted || !state?.currentStep || !content) return null;
  const last = state.currentStepNumber === state.totalSteps;
  const width = Math.min(420, window.innerWidth - 32);
  const cardStyle = targetRect && window.innerWidth >= 768
    ? { width, left: Math.min(window.innerWidth - width - 20, Math.max(20, targetRect.right + 20)), top: Math.min(window.innerHeight - 350, Math.max(20, targetRect.top)) }
    : { left: 16, right: 16, bottom: 16 };

  async function finish() { setFinishing(true); await onDone(); setFinishing(false); }
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      <div className="pointer-events-auto absolute inset-0" />
      {targetRect ? <div className="absolute rounded-xl border-2 border-primary shadow-[0_0_0_9999px_rgb(0_0_0/0.48),0_0_0_7px_color-mix(in_oklab,var(--primary)_18%,transparent)] transition-all duration-300" style={{ left: targetRect.left - 6, top: targetRect.top - 6, width: targetRect.width + 12, height: targetRect.height + 12 }} /> : <div className="absolute inset-0 bg-foreground/45 backdrop-blur-sm" />}
      <section className="pointer-events-auto fixed max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border bg-card p-7 shadow-2xl transition-all duration-300" style={cardStyle}>
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary"><Compass /></span>
          <Button variant="ghost" size="icon-sm" aria-label="Skip onboarding" onClick={() => void finish()}><X /></Button>
        </div>
        <div key={state.currentStep.id} className={direction > 0 ? "animate-in fade-in slide-in-from-right-3 duration-300" : "animate-in fade-in slide-in-from-left-3 duration-300"}>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[.16em] text-primary">Getting started · {index + 1} of {guide.steps.length}</p>
          <h2 className="mt-2 text-2xl font-semibold">{content.title}</h2>
          <p className="mt-3 leading-7 text-muted-foreground">{content.description}</p>
          <div className="mt-6 grid gap-2" style={{ gridTemplateColumns: `repeat(${guide.steps.length}, minmax(0, 1fr))` }}>{guide.steps.map((step, stepIndex) => <span key={step.title} className={stepIndex <= index ? "h-1.5 rounded-full bg-primary transition-colors" : "h-1.5 rounded-full bg-muted transition-colors"} />)}</div>
        </div>
        <div className="mt-7 flex justify-between gap-3">
          <Button variant="outline" onClick={() => { setDirection(-1); previous(); }} disabled={!state.canGoPrevious || loading.isAnyLoading}><ArrowLeft data-icon="inline-start" />Back</Button>
          {last ? <Button onClick={() => void finish()} disabled={finishing}>{finishing ? <Spinner data-icon="inline-start" /> : <CheckCircle2 data-icon="inline-start" />}{finishing ? "Saving…" : "Finish"}</Button> : <Button onClick={() => { setDirection(1); next(); }} disabled={loading.isAnyLoading}>Continue<ArrowRight data-icon="inline-end" /></Button>}
        </div>
      </section>
    </div>,
    document.body,
  );
}

export function PageOnboarding({ completedPages }: { completedPages: string[] }) {
  const pathname = usePathname();
  const pageKey = guideKey(pathname);
  const guide = guides[pageKey];
  const [visited, setVisited] = useState(() => new Set(completedPages));
  const steps = useMemo<OnboardingStep[]>(() => guide?.steps.map((_, index) => ({ id: `${pageKey}-${index + 1}`, component: () => null, nextStep: index === guide.steps.length - 1 ? null : `${pageKey}-${index + 2}`, previousStep: index === 0 ? undefined : `${pageKey}-${index}` })) ?? [], [guide, pageKey]);
  if (!guide || visited.has(pageKey)) return null;
  async function complete() { await fetch("/api/onboarding/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pageKey }) }); setVisited((current) => new Set(current).add(pageKey)); }
  return <OnboardingProvider flowId={`page-${pageKey}`} flowName={`${guide.title} guide`} flowVersion="2.0.0" steps={steps}><TourCard guide={guide} onDone={complete} /></OnboardingProvider>;
}
