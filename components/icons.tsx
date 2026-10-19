import type { ReactNode } from "react";

function Outline({ className, children }: { className: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Étoile à cinq branches (repère des piscines ★), rayon 1 centrée sur (0,0). */
export const STAR_POINTS = Array.from({ length: 10 }, (_, i) => {
  const angle = (Math.PI / 5) * i - Math.PI / 2;
  const r = i % 2 === 0 ? 1 : 0.42;
  return `${(Math.cos(angle) * r).toFixed(3)},${(Math.sin(angle) * r).toFixed(3)}`;
}).join(" ");

// Le glyphe ★ vient d'une police de secours : sa hauteur varie selon l'appareil.
export function StarIcon({ filled, className = "" }: { filled?: boolean; className?: string }) {
  return (
    <svg
      viewBox="-1.1 -1.2 2.2 2.2"
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={0.12}
      className={`inline-block h-[1.25em] w-[1.25em] overflow-hidden align-[-0.275em] ${className}`}
    >
      <polygon points={STAR_POINTS} />
    </svg>
  );
}

export function DoubleChevronIcon({ className = "" }: { className?: string }) {
  return (
    <Outline className={className}>
      <path d="M6 6l6 6-6 6M12.5 6l6 6-6 6" />
    </Outline>
  );
}

export function PencilIcon({ className = "" }: { className?: string }) {
  return (
    <Outline className={className}>
      <path d="M15.5 4.5l4 4L8.5 19.5H4.5v-4z" />
      <path d="M13 7l4 4" />
    </Outline>
  );
}

export function DirectionsIcon({ className = "" }: { className?: string }) {
  return (
    <Outline className={className}>
      <path d="M20.5 3.5 3.5 10.6l7 2.9 2.9 7z" />
    </Outline>
  );
}

export function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <Outline className={className}>
      <path d="M5 3.5h3.3l1.6 4.2-2.2 1.5a11.5 11.5 0 0 0 7.1 7.1l1.5-2.2 4.2 1.6V19a1.5 1.5 0 0 1-1.5 1.5A16.5 16.5 0 0 1 3.5 5 1.5 1.5 0 0 1 5 3.5z" />
    </Outline>
  );
}

export function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <Outline className={className}>
      <path d="M14 3.5h6.5V10M20.5 3.5 11 13" />
      <path d="M18 14v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </Outline>
  );
}

export function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <Outline className={className}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </Outline>
  );
}

const inline = "inline-block h-[1.15em] w-[1.15em] overflow-hidden align-[-0.225em]";

type IconProps = { className?: string };

export function ChatIcon({ className = "" }: IconProps) {
  return (
    <Outline className={`${inline} ${className}`}>
      <path d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v9a1.5 1.5 0 0 1-1.5 1.5h-8.5l-4.5 3.5v-3.5H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5z" />
    </Outline>
  );
}

export function InstallIcon({ className = "" }: IconProps) {
  return (
    <Outline className={`${inline} ${className}`}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M12 7.5v7M9.5 12l2.5 2.5 2.5-2.5M10.5 18.5h3" />
    </Outline>
  );
}

export function CloseIcon({ className = "" }: IconProps) {
  return (
    <Outline className={`${inline} ${className}`}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </Outline>
  );
}

export function OfflineIcon({ className = "" }: IconProps) {
  return (
    <Outline className={`${inline} ${className}`}>
      <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M9 16a4.5 4.5 0 0 1 6 0M12 19.5h.01M4 4l16 16" />
    </Outline>
  );
}

export function BulbIcon({ className = "" }: IconProps) {
  return (
    <Outline className={`${inline} ${className}`}>
      <path d="M9.5 17.5h5M10.5 20.5h3" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2v1.5h5V16c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" />
    </Outline>
  );
}

export function CupIcon({ className = "" }: IconProps) {
  return (
    <Outline className={`${inline} ${className}`}>
      <path d="M4.5 9.5h12V14a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z" />
      <path d="M16.5 11h1.3a2.5 2.5 0 0 1 0 5h-1.3" />
      <path d="M8.5 3q1 1.25 0 2.5t0 2.5M12.5 3q1 1.25 0 2.5t0 2.5" />
    </Outline>
  );
}

export function PinIcon({ className = "" }: IconProps) {
  return (
    <Outline className={`${inline} ${className}`}>
      <path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </Outline>
  );
}

export function SwimmerIcon({ className = "" }: IconProps) {
  return (
    <Outline className={`${inline} ${className}`}>
      <circle cx="17" cy="6.5" r="2" />
      <path d="M3.5 12l5.5-3.5 4.5 4" />
      <path d="M2.5 16q2.4-1.8 4.75 0t4.75 0 4.75 0 4.75 0M2.5 20q2.4-1.8 4.75 0t4.75 0 4.75 0 4.75 0" />
    </Outline>
  );
}

export function SunIcon({ className = "" }: { className?: string }) {
  return (
    <Outline className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </Outline>
  );
}

export function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <Outline className={className}>
      <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" />
    </Outline>
  );
}
