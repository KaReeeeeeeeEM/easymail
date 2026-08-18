"use client";

import {
  CheckCircle2,
  Info,
  LoaderCircle,
  XCircle,
} from "lucide-react";
import { useEffect } from "react";
import {
  Toaster as HotToaster,
  resolveValue,
  type Toast,
} from "react-hot-toast";
import { cn } from "@/lib/utils";

function feedback(toast: Toast) {
  if (toast.type === "error") return "The action needs your attention.";
  if (toast.type === "loading")
    return "Please wait while this action completes.";
  if (toast.type === "success")
    return "The requested action completed successfully.";
  return "A new platform update is available.";
}

function RichToast({ toast }: { toast: Toast }) {
  useEffect(() => {
    try {
      navigator.vibrate?.(toast.type === "error" ? [40, 30, 40] : 35);
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = toast.type === "error" ? 240 : 520;
      gain.gain.setValueAtTime(0.035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.12);
      oscillator.addEventListener("ended", () => void context.close());
    } catch {
      /* Sound and vibration are optional device capabilities. */
    }
  }, [toast.id, toast.type]);
  const Icon =
    toast.type === "success"
      ? CheckCircle2
      : toast.type === "error"
        ? XCircle
        : toast.type === "loading"
          ? LoaderCircle
          : Info;
  return (
    <div
      className={cn(
        "flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg transition-all",
        toast.visible
          ? "animate-in fade-in slide-in-from-top-2"
          : "animate-out fade-out slide-out-to-right-2",
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary",
          toast.type === "error" && "bg-destructive/10 text-destructive",
        )}
      >
        <Icon className={cn(toast.type === "loading" && "animate-spin")} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-5">
          {resolveValue(toast.message, toast)}
        </p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {feedback(toast)}
        </p>
      </div>
    </div>
  );
}

export function ReactToaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={10}
      toastOptions={{ duration: 4500 }}
    >
      {(toast) => <RichToast toast={toast} />}
    </HotToaster>
  );
}
