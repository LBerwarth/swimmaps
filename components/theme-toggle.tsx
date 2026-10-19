"use client";

import { useSyncExternalStore } from "react";
import { THEME_COLOR, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { useDict } from "@/components/locale-provider";
import { MoonIcon, SunIcon } from "@/components/icons";

type Resolved = Exclude<Theme, "system">;


// « storage » ne se déclenche que dans les AUTRES onglets : un événement local
// tient à jour le bouton de l'onglet courant.
const LOCAL_EVENT = "themechange";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(DARK_QUERY);
  window.addEventListener("storage", onChange);
  window.addEventListener(LOCAL_EVENT, onChange);
  media.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LOCAL_EVENT, onChange);
    media.removeEventListener("change", onChange);
  };
}

// Sans choix enregistré, la page suit l'OS : le bouton affiche le thème effectif.
function getSnapshot(): Resolved {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Stockage refusé : on suit l'OS.
  }
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

const getServerSnapshot = (): Resolved => "light";

/** Les balises theme-color du viewport suivent une media query : on les réécrit quand un thème est forcé. */
function syncThemeColor(theme: Resolved): void {
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.content = THEME_COLOR[theme];
  });
}

function apply(theme: Resolved): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Stockage refusé : le choix ne vaut que pour la page.
  }
  syncThemeColor(theme);
  window.dispatchEvent(new Event(LOCAL_EVENT));
}

/** Bascule clair / sombre. */
export function ThemeToggle() {
  const dict = useDict();
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Resolved = theme === "dark" ? "light" : "dark";
  const label = dict.themeSwitch(dict.themeNames[theme], dict.themeNames[next]);

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm leading-none transition-colors hover:bg-white/35"
    >
      {theme === "dark" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
    </button>
  );
}
