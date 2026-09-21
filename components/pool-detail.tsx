"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Pool } from "@/lib/types";
import { fetchToulouseLive, type LivePoolStatus } from "@/lib/toulouse-live";
import { PoolCard } from "@/components/pool-card";

const PoolMap = dynamic(() => import("@/components/pool-map"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full animate-pulse rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-400/10" />
  ),
});

/** Fiche seule (page dédiée) : carte de la piscine + plan centré, statut live si Toulouse. */
export function PoolDetail({ pool }: { pool: Pool }) {
  const [live, setLive] = useState<LivePoolStatus | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchToulouseLive(controller.signal)
      .then((map) => setLive(map.get(pool.id) ?? null))
      .catch(() => {
        // Service indisponible : on reste sur les horaires OSM.
      });
    return () => controller.abort();
  }, [pool.id]);

  return (
    <div className="space-y-4">
      <PoolCard pool={pool} live={live} showDetails={false} />
      <PoolMap center={[pool.lat, pool.lon]} pools={[pool]} />
    </div>
  );
}
