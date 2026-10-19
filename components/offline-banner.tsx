"use client";

import { useSyncExternalStore } from "react";
import { useDict } from "@/components/locale-provider";
import { OfflineIcon } from "@/components/icons";

function subscribe(callback: () => void): () => void {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

const getSnapshot = (): "online" | "offline" => (navigator.onLine ? "online" : "offline");
// Serveur et hydratation : état réseau inconnu → bandeau masqué.
const getServerSnapshot = (): "server" => "server";

/** Bandeau hors ligne : les données affichées viennent du cache du service worker. */
export function OfflineBanner() {
  const dict = useDict();
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (state !== "offline") return null;
  return (
    <div
      role="status"
      className="mb-4 flex items-start gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm dark:border-amber-400/40 dark:bg-amber-300/10 dark:text-amber-100"
    >
      <span aria-hidden className="mt-0.5 text-base leading-none">
        <OfflineIcon />
      </span>
      <div>
        <p>{dict.offlineBanner}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 rounded-full border border-amber-400 bg-amber-100 px-4 py-1.5 font-medium text-amber-900 transition hover:bg-amber-200 dark:border-amber-400/50 dark:bg-amber-300/20 dark:text-amber-100 dark:hover:bg-amber-300/30"
        >
          {dict.offlineReload}
        </button>
      </div>
    </div>
  );
}
