"use client";

import { useSyncExternalStore } from "react";
import { THEME_COLOR, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { useDict } from "@/components/locale-provider";

const CYCLE: Theme[] = ["system", "light", "dark"];
const ICONS: Record<Theme, string> = { system: "🌗", light: "☀️", dark: "🌙" };

// « storage » ne se déclenche que dans les AUTRES onglets : un événement local
// tient à jour le bouton de l'onglet courant.
const LOCAL_EVENT = "themechange";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(LOCAL_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LOCAL_EVENT, onChange);
  };
}

function getSnapshot(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

const getServerSnapshot = (): Theme => "system";

/** Les balises theme-color du viewport suivent une media query : on les réécrit quand un thème est forcé. */
function syncThemeColor(theme: Theme): void {
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    const own = (meta.getAttribute("media") ?? "").includes("dark")
      ? THEME_COLOR.dark
      : THEME_COLOR.light;
    meta.content = theme === "system" ? own : THEME_COLOR[theme];
  });
}

function apply(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.dataset.theme = theme;
  try {
    if (theme === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Stockage refusé : le choix ne vaut que pour la page.
  }
  syncThemeColor(theme);
  window.dispatchEvent(new Event(LOCAL_EVENT));
}

/** Bascule clair / sombre / automatique. */
export function ThemeToggle() {
  const dict = useDict();
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length];
  const label = dict.themeSwitch(dict.themeNames[theme], dict.themeNames[next]);

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm leading-none transition-colors hover:bg-white/35"
    >
      <span aria-hidden>{ICONS[theme]}</span>
    </button>
  );
}
