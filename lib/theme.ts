export type Theme = "system" | "light" | "dark";

/** Teinte de la barre d'adresse, par thème résolu. */
export const THEME_COLOR = { light: "#6D28D9", dark: "#2E1065" } as const;

export const THEME_STORAGE_KEY = "pf:theme";

// Exécuté pendant l'analyse du HTML, avant la première peinture : sans lui, un
// thème forcé clignoterait. Absence de data-theme = suivre l'OS.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
