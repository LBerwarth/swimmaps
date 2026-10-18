"use client";

import { useEffect, useState } from "react";
import { INSTALL_DISMISS_KEY } from "@/lib/client-flags";
import { useDict } from "@/components/locale-provider";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Installation sur Android et Chrome de bureau : propose le dialogue du
 * navigateur, que Chrome ne montre plus de lui-même pendant des mois après un refus.
 */
export function InstallBanner() {
  const dict = useDict();
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(INSTALL_DISMISS_KEY) === "1") return;
    } catch {}
    const onPrompt = (e: Event) => {
      // Remplace la mini-barre de Chrome : une seule invitation à la fois.
      e.preventDefault();
      setPrompt(e as InstallPromptEvent);
    };
    const onInstalled = () => setPrompt(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!prompt) return null;

  const install = async () => {
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  };

  const dismiss = () => {
    setPrompt(null);
    try {
      localStorage.setItem(INSTALL_DISMISS_KEY, "1");
    } catch {}
  };

  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-md shadow-pink-100/50 dark:shadow-none dark:ring-1 dark:ring-white/10">
      <span aria-hidden className="text-xl">
        📲
      </span>
      <p className="min-w-0 flex-1 text-sm text-slate-700 dark:text-slate-200">{dict.installLead}</p>
      <button
        type="button"
        onClick={install}
        className="shrink-0 rounded-full bg-fuchsia-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-fuchsia-700"
      >
        {dict.installButton}
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label={dict.iosDismiss}
        className="shrink-0 rounded-full p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
      >
        ✕
      </button>
    </div>
  );
}
