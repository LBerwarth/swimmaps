"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ABOUT_SEEN_KEY, FAVORITES_KEY } from "@/lib/client-flags";
import { useLocale } from "@/components/locale-provider";

const BOT_UA = /bot|crawl|spider|slurp|preview|lighthouse|headless|inspect/i;

/**
 * Premier passage sur l'accueil : renvoie vers la page « À propos ».
 * Jamais pour un robot (Google exécute le JS avec un stockage vide à chaque visite),
 * ni avec des paramètres d'URL (raccourcis de l'appli), ni pour un habitué déjà équipé.
 */
export function FirstVisit({ markOnly = false }: { markOnly?: boolean }) {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    try {
      if (localStorage.getItem(ABOUT_SEEN_KEY)) return;
      localStorage.setItem(ABOUT_SEEN_KEY, "1");
      if (markOnly || localStorage.getItem("pf:search") || localStorage.getItem(FAVORITES_KEY)) return;
    } catch {
      return;
    }
    if (BOT_UA.test(navigator.userAgent) || window.location.search) return;
    router.replace(`/${locale}/about`);
  }, [markOnly, router, locale]);

  return null;
}
