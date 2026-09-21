"use client";

import { useState, useSyncExternalStore } from "react";

function readStored(key: string): boolean | null {
  try {
    const v = window.localStorage.getItem(key);
    return v === null ? null : v === "1";
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/**
 * Bloc repliable dont l'état survit d'une visite à l'autre (localStorage).
 * Rendu serveur : ouvert, l'état mémorisé s'applique à l'hydratation.
 */
export function CollapsibleSection({
  title,
  storageKey,
  variant = "card",
  openSignal = null,
  children,
}: {
  title: string;
  storageKey: string;
  /** « card » : carte arrondie ; « plain » : sans fond. */
  variant?: "card" | "plain";
  /** Rouvre le bloc à chaque nouvelle valeur non nulle (clic sur la carte). */
  openSignal?: string | number | null;
  children: React.ReactNode;
}) {
  const stored = useSyncExternalStore(
    subscribe,
    () => readStored(storageKey),
    () => null,
  );
  // Choix de la session (clic ou signal) ; à défaut, l'état mémorisé ; sinon ouvert.
  const [override, setOverride] = useState<boolean | null>(null);
  const [seenSignal, setSeenSignal] = useState(openSignal);
  if (openSignal !== seenSignal) {
    setSeenSignal(openSignal);
    if (openSignal !== null) setOverride(true);
  }
  const open = override ?? stored ?? true;

  // Seul un clic mémorise le choix — l'ouverture par signal reste passagère.
  function toggle() {
    const next = !open;
    setOverride(next);
    try {
      window.localStorage.setItem(storageKey, next ? "1" : "0");
    } catch {}
  }

  const contentId = `${storageKey}-content`;

  return (
    <section
      className={
        variant === "card"
          ? "overflow-hidden rounded-3xl bg-card shadow-lg shadow-pink-100/60 dark:shadow-none dark:ring-1 dark:ring-white/10"
          : ""
      }
    >
      <h2>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={contentId}
          className={
            variant === "card"
              ? "flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5"
              : "flex items-center gap-2 py-2 text-left"
          }
        >
          <span className="text-sm font-semibold uppercase tracking-wide text-violet-800 dark:text-violet-200">
            {title}
          </span>
          <span
            aria-hidden
            className={`shrink-0 text-xs text-violet-500 transition-transform dark:text-violet-300 ${
              open ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>
      </h2>

      {open && (
        <div id={contentId} className={variant === "card" ? "px-4 pb-4 sm:px-5 sm:pb-5" : ""}>
          {children}
        </div>
      )}
    </section>
  );
}
