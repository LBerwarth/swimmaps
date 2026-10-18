"use client";

import { useSyncExternalStore } from "react";
import type { ContribMap, ContribInput, Contribution } from "@/lib/contrib";
import type { NewPoolInput } from "@/lib/newpool";
import type { Pool } from "@/lib/types";

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

/** Piscines ajoutées par des visiteurs et validées, chargées une fois par page. */
const NO_POOLS: Pool[] = [];
let userPools: Pool[] = NO_POOLS;
let poolsStarted = false;
const poolListeners = new Set<() => void>();

function subscribePools(listener: () => void): () => void {
  poolListeners.add(listener);
  if (!poolsStarted) {
    poolsStarted = true;
    fetch("/api/newpool")
      .then((res) => (res.ok ? res.json() : NO_POOLS))
      .then((data: Pool[]) => {
        userPools = data;
        for (const l of poolListeners) l();
      })
      .catch(() => {
        // Base indisponible : seules les piscines des jeux de données s'affichent.
      });
  }
  return () => poolListeners.delete(listener);
}

export function useUserPools(): Pool[] {
  return useSyncExternalStore(subscribePools, () => userPools, () => NO_POOLS);
}

export type NewPoolResult = "ok" | "exists" | "too_many" | "error";

export async function submitNewPool(input: NewPoolInput): Promise<{ result: NewPoolResult; slug?: string }> {
  const res = await fetch("/api/newpool", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).catch(() => null);
  if (!res) return { result: "error" };
  if (res.status === 409) return { result: "exists", slug: ((await res.json()) as { slug?: string }).slug };
  if (res.status === 429) return { result: "too_many" };
  return { result: res.ok ? "ok" : "error" };
}

export async function submitCorrection(input: ContribInput): Promise<SubmitResult> {
  const res = await fetch("/api/correction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).catch(() => null);
  if (!res) return "error";
  if (res.status === 429) return "too_many";
  return res.ok ? "ok" : "error";
}
