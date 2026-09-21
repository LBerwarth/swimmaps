"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  const timer = setInterval(onChange, 60_000);
  return () => clearInterval(timer);
}

const getMinute = (): number => Math.floor(Date.now() / 60_000);
const getServerMinute = (): number => 0;

/**
 * Heure courante à la minute, ou null au rendu serveur et à l'hydratation :
 * les badges « ouverte » se calculent dans le navigateur sans décalage
 * d'hydratation, et se rafraîchissent chaque minute.
 */
export function useNow(): Date | null {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  return minute === 0 ? null : new Date(minute * 60_000);
}
