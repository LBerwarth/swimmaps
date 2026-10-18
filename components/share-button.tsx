"use client";

import { useState } from "react";
import { useDict } from "@/components/locale-provider";

/** Partage de la page en cours : feuille de partage du système (WhatsApp…), sinon copie du lien. */
export function ShareButton() {
  const dict = useDict();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
      } catch {
        // Partage annulé par l'utilisateur : rien à faire.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers refusé : le lien reste dans la barre d'adresse.
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label={dict.shareLabel}
      title={copied ? dict.shareCopied : dict.shareLabel}
      className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/35"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11A2.99 2.99 0 1 0 15 5c0 .24.04.47.09.7L8.04 9.81a3 3 0 1 0 0 4.38l7.12 4.16c-.05.21-.08.43-.08.65A2.92 2.92 0 1 0 18 16.08z" />
      </svg>
      {copied && (
        <span role="status" className="absolute top-9 right-0 whitespace-nowrap rounded-lg bg-white px-2 py-1 text-xs font-medium text-fuchsia-700 shadow">
          {dict.shareCopied}
        </span>
      )}
    </button>
  );
}
