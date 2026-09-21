"use client";

import { useEffect } from "react";

// En développement, le SW ressert des pages et chunks périmés : désactivé,
// sauf NEXT_PUBLIC_SW_DEV=1 pour le tester exprès.
const SW_ENABLED =
  process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_SW_DEV === "1";

/** Enregistre le service worker et recharge la page quand une nouvelle version prend le contrôle. */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Retirer, pas seulement s'abstenir : un SW d'une visite précédente
    // continuerait de servir ses vieux fichiers.
    if (!SW_ENABLED) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => Promise.all(regs.map((r) => r.unregister())))
        .then(() => caches.keys())
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .catch(() => {});
      return;
    }

    // Reload seulement sur une vraie mise à jour, et jamais dans l'app
    // installée (le reload au démarrage fige l'écran de lancement).
    const hadController = !!navigator.serviceWorker.controller;
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    let reloading = false;
    const onControllerChange = () => {
      if (reloading || !hadController || standalone) return;
      reloading = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    let registration: ServiceWorkerRegistration | undefined;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((reg) => {
        registration = reg;
      })
      .catch(() => {
        // L'application fonctionne sans le service worker.
      });

    const onVisible = () => {
      if (document.visibilityState === "visible") registration?.update().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return null;
}
