"use client";

import { useState } from "react";
import { IosInstallSteps, ShareIcon } from "./ios-install-steps";
import { IOS_DISMISS_KEY, clearFlag } from "@/lib/client-flags";
import { useDict } from "@/components/locale-provider";
import { CloseIcon, InstallIcon } from "@/components/icons";

/**
 * Guide d'installation pour iPhone/iPad en navigateur : iOS n'a pas de prompt
 * d'installation PWA. Toujours rendu ; le script du <head> décide de
 * l'afficher avant la première peinture (cf. lib/client-flags.ts).
 */
export function IosBanner() {
  const dict = useDict();
  const [open, setOpen] = useState(false);

  const dismiss = () => {
    clearFlag("install");
    try {
      localStorage.setItem(IOS_DISMISS_KEY, "1");
    } catch {}
  };

  return (
    <div
      data-slot="banner-ios"
      className="mb-4 rounded-2xl bg-card px-4 py-3 shadow-md shadow-pink-100/50 dark:shadow-none dark:ring-1 dark:ring-white/10"
    >
      <div className="flex items-center gap-3">
        <span aria-hidden className="text-xl text-fuchsia-600 dark:text-fuchsia-300">
          <InstallIcon />
        </span>
        <p className="min-w-0 flex-1 text-sm text-slate-700 dark:text-slate-200">
          {dict.iosInstallLead} <ShareIcon label={dict.iosShare} /> {dict.iosInstallTail}{" "}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="font-medium text-violet-800 underline decoration-fuchsia-300 underline-offset-2 dark:text-violet-200"
          >
            {open ? dict.iosHideSteps : dict.iosHow}
          </button>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label={dict.iosDismiss}
          className="shrink-0 rounded-full p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          <CloseIcon />
        </button>
      </div>
      {open && <IosInstallSteps />}
    </div>
  );
}
