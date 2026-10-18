"use client";

import { useSyncExternalStore } from "react";
import type { ContribMap, ContribInput, Contribution } from "@/lib/contrib";

/** Compléments des visiteurs, chargés une fois par page et partagés entre composants. */
const EMPTY: ContribMap = {};
let map: ContribMap = EMPTY;
let started = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!started) {
    started = true;
    fetch("/api/contrib")
      .then((res) => (res.ok ? res.json() : EMPTY))
      .then((data: ContribMap) => {
        map = { ...data, ...map };
        emit();
      })
      .catch(() => {
        // Hors ligne ou base indisponible : les fiches restent celles des sources.
      });
  }
  return () => listeners.delete(listener);
}

export function useContributions(): ContribMap {
  return useSyncExternalStore(subscribe, () => map, () => EMPTY);
}

export type SubmitResult = "ok" | "known" | "too_many" | "error";

export async function submitContribution(input: ContribInput): Promise<SubmitResult> {
  const res = await fetch("/api/contrib", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).catch(() => null);
  if (!res) return "error";
  if (res.status === 409) return "known";
  if (res.status === 429) return "too_many";
  if (!res.ok) return "error";
  const { contribution } = (await res.json()) as { contribution: Contribution };
  map = { ...map, [input.id]: contribution };
  emit();
  return "ok";
}
