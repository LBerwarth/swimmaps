"use client";

/** Pastille de filtre (bouton bascule), style commun à tous les groupes. */
export function Chip({
  selected,
  onClick,
  ariaLabel,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={`rounded-full px-2.5 py-1 text-xs transition-colors sm:px-3 ${
        selected
          ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 font-semibold text-white shadow-sm dark:from-pink-600 dark:to-fuchsia-700"
          : "bg-white/70 font-medium text-fuchsia-900 hover:bg-fuchsia-100 dark:bg-white/10 dark:text-fuchsia-100 dark:hover:bg-fuchsia-400/20"
      }`}
    >
      {children}
    </button>
  );
}

/** Intitulé d'une ligne de filtres. */
export function ChipLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-16 shrink-0 text-xs font-medium uppercase tracking-wide text-violet-800/70 dark:text-violet-200/85">
      {children}
    </span>
  );
}
