"use client";

import { OnboardingProvider, useOnboarding, type OnboardingStep } from "@onboardjs/react";
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

type Guide = { title: string; description: string; steps: Array<{ title: string; description: string }> };
const guides: Record<string, Guide> = {
  overview: { title: "Welcome to your workspace", description: "A quick map of the controls that keep your email service healthy.", steps: [{ title: "Read delivery health at a glance", description: "The overview combines request volume, acceptance rate, sender health, and recent requests so you can spot issues early." }, { title: "Start with a workspace", description: "Create or switch workspaces under the logo. Every sender, API key, and request remains isolated to the active workspace." }] },
  "api-keys": { title: "API keys, without surprises", description: "Keys connect applications to one verified sender.", steps: [{ title: "Assign every key to a sender", description: "This prevents an application from selecting arbitrary From addresses and keeps rotation predictable." }, { title: "Copy secrets immediately", description: "A key is shown once. Store it in a secret manager and rotate it from this page whenever access changes." }] },
  sender: { title: "Connect delivery providers", description: "Saved credentials are encrypted and verified before use.", steps: [{ title: "Use provider-specific settings", description: "Choose Gmail, Outlook, or custom SMTP. The form supplies the matching host, port, and connection security." }, { title: "Verify before saving", description: "A live SMTP connection test confirms the credentials work. A workspace supports up to three senders." }] },
  docs: { title: "Build against the API", description: "Everything required for a production integration lives here.", steps: [{ title: "Use the production endpoint", description: "Examples point to https://easymail.almareem.com/api/v1/emails and cover authentication, idempotency, HTML, CC, and attachments." }, { title: "Follow provider setup guides", description: "The sender section explains how to create app passwords and SMTP credentials for supported providers." }] },
  playground: { title: "Test before integrating", description: "Compose a real request without exposing stored credentials.", steps: [{ title: "Choose a saved sender", description: "Select a sender, preview HTML, add recipients or files, and send through the same delivery service used by the API." }, { title: "Copy working code", description: "Switch among cURL, JavaScript, and Python examples, then copy the syntax-highlighted request into your application." }] },
  profile: { title: "Keep your account secure", description: "Manage identity, passwords, and passkeys from one place.", steps: [{ title: "Review your identity", description: "Your verified Gmail address anchors account recovery and security notifications." }, { title: "Add a passkey", description: "A device passkey provides a phishing-resistant sign-in option alongside the required email security code." }] },
  settings: { title: "Workspace preferences", description: "Tune account and workspace behavior safely.", steps: [{ title: "Understand the active scope", description: "Settings apply to the active workspace shown in the sidebar switcher." }, { title: "Review before changing", description: "Security-sensitive changes use confirmation, loading feedback, and an audit trail." }] },
};

function guideKey(pathname: string) { return pathname === "/dashboard" ? "overview" : pathname.split("/").filter(Boolean).at(-1) ?? "overview"; }

function GuideStep({ title, description }: { title?: string; description?: string }) {
  return <div className="flex flex-col gap-4 py-2"><div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary"><Sparkles /></div><div className="flex flex-col gap-2"><h3 className="text-xl font-semibold">{title}</h3><p className="leading-7 text-muted-foreground">{description}</p></div></div>;
}

function GuidePresenter({ onDone }: { onDone: () => Promise<void> }) {
  const { state, next, previous, renderStep, loading } = useOnboarding();
  const [finishing, setFinishing] = useState(false);
  if (!state?.currentStep) return <div className="flex min-h-48 items-center justify-center"><Spinner /></div>;
  const last = state.currentStepNumber === state.totalSteps;
  async function finish() { setFinishing(true); await onDone(); setFinishing(false); }
  return <>
    <div className="flex items-center justify-between gap-4 text-xs font-medium text-muted-foreground"><span>PAGE GUIDE</span><span>{state.currentStepNumber} / {state.totalSteps}</span></div>
    <div key={state.currentStep.id} className="animate-in fade-in slide-in-from-right-3 duration-300">{renderStep()}</div>
    <DialogFooter className="-mx-6 -mb-6 px-6">
      <Button variant="outline" onClick={() => previous()} disabled={!state.canGoPrevious || loading.isAnyLoading}><ArrowLeft data-icon="inline-start" />Back</Button>
      {last ? <Button onClick={() => void finish()} disabled={finishing}>{finishing ? <Spinner data-icon="inline-start" /> : <CheckCircle2 data-icon="inline-start" />}{finishing ? "Saving…" : "Finish guide"}</Button> : <Button onClick={() => next()} disabled={loading.isAnyLoading}>Next<ArrowRight data-icon="inline-end" /></Button>}
    </DialogFooter>
  </>;
}

export function PageOnboarding({ completedPages }: { completedPages: string[] }) {
  const pathname = usePathname();
  const pageKey = guideKey(pathname);
  const guide = guides[pageKey];
  const [visited, setVisited] = useState(() => new Set(completedPages));
  const open = Boolean(guide && !visited.has(pageKey));
  const steps = useMemo<OnboardingStep[]>(() => guide?.steps.map((step, index) => ({ id: `${pageKey}-${index + 1}`, component: () => <GuideStep {...step} />, nextStep: index === guide.steps.length - 1 ? null : `${pageKey}-${index + 2}` })) ?? [], [guide, pageKey]);
  if (!guide || !open) return null;
  async function complete() { await fetch("/api/onboarding/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pageKey }) }); setVisited((current) => new Set(current).add(pageKey)); }
  return <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) void complete(); }}><DialogContent className="max-w-xl gap-6 p-6"><DialogHeader><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><Compass /></div><div><DialogTitle>{guide.title}</DialogTitle><DialogDescription className="mt-1">{guide.description}</DialogDescription></div></div></DialogHeader><OnboardingProvider flowId={`page-${pageKey}`} flowName={`${guide.title} guide`} flowVersion="1.0.0" steps={steps}><GuidePresenter onDone={complete} /></OnboardingProvider><Button variant="ghost" size="icon-sm" className="absolute right-2 top-2" onClick={() => void complete()} aria-label="Skip this guide"><X /></Button></DialogContent></Dialog>;
}
