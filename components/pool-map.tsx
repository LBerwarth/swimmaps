"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Pool } from "@/lib/types";
import { formatDistance } from "@/lib/geo";
import type { DayState } from "@/lib/pool-state";
import { isIndexable, poolPagePath } from "@/lib/slug";
import { useDict, useLocale } from "@/components/locale-provider";
import { STAR_POINTS } from "@/components/icons";

type MapPool = Pool & { distanceKm?: number };

interface Props {
  center: [number, number];
  /** Rayon du cercle ; absent = vue d'une seule piscine (fiche). */
  radiusKm?: number;
  pools: MapPool[];
  /** Clic sur le point d'une piscine : cible sa fiche dans la liste. */
  onSelect?: (poolId: string) => void;
  isFavorite?: (poolId: string) => boolean;
  stateOf?: (pool: MapPool) => DayState["kind"];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Couleur vive = ouverte maintenant ; claire = état inconnu ; grise = fermée / plus tard / terminé. */
function fillFor(kind: DayState["kind"]): string {
  if (kind === "open") return "#c026d3";
  if (kind === "unknown") return "#e879f9";
  return "#94a3b8";
}

function poolIcon(kind: DayState["kind"], starred: boolean): L.DivIcon {
  const fill = fillFor(kind);
  const size = starred ? 26 : 18;
  const html = starred
    ? `<svg width="${size}" height="${size}" viewBox="-1.2 -1.2 2.4 2.4" style="overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.4))"><polygon points="${STAR_POINTS}" fill="${fill}" stroke="white" stroke-width="0.14"/></svg>`
    : `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${fill};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>`;
  return L.divIcon({ className: "", html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

const USER_ICON = () =>
  L.divIcon({
    className: "",
    html: '<div style="width:16px;height:16px;border-radius:9999px;background:#7c3aed;border:3px solid white;box-shadow:0 0 0 2px #7c3aed"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

export function PoolMap({ center, radiusKm, pools, onSelect, isFavorite, stateOf }: Props) {
  const dict = useDict();
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    if (radiusKm === undefined) {
      map.setView(center, 15);
    } else {
      // Vue définie avant l'ajout des couches : sans vue, Leaflet diffère leur
      // ajout réel et circle.getBounds() planterait.
      map.fitBounds(L.latLng(center).toBounds(radiusKm * 2000), { padding: [16, 16] });
      layer.addLayer(
        L.circle(center, {
          radius: radiusKm * 1000,
          color: "#a21caf",
          weight: 1.5,
          fillColor: "#e879f9",
          fillOpacity: 0.08,
        }),
      );
      layer.addLayer(L.marker(center, { icon: USER_ICON() }));
    }

    for (const pool of pools) {
      const kind = stateOf?.(pool) ?? "unknown";
      const marker = L.marker([pool.lat, pool.lon], {
        icon: poolIcon(kind, isFavorite?.(pool.id) ?? false),
        zIndexOffset: kind === "open" ? 200 : 0,
      });
      const where = [
        escapeHtml(pool.city),
        pool.distanceKm !== undefined ? formatDistance(pool.distanceKm, locale, pool.country) : null,
      ]
        .filter(Boolean)
        .join(" · ");
      marker.bindPopup(
        `<strong>${escapeHtml(pool.name)}</strong><br>${where}<br>` +
          `<a href="${poolPagePath(locale, pool)}"${isIndexable(pool, locale) ? "" : ' rel="nofollow"'} style="color:#a21caf;text-decoration:underline">${escapeHtml(dict.mapPopupDetail)}</a>`,
      );
      if (onSelect) marker.on("click", () => onSelect(pool.id));
      layer.addLayer(marker);
    }
  }, [center, radiusKm, pools, onSelect, isFavorite, stateOf, locale, dict]);

  return (
    <div
      ref={containerRef}
      className="h-72 w-full rounded-2xl border border-fuchsia-200 shadow-sm dark:border-white/10"
      aria-label={dict.mapAria}
    />
  );
}

export default PoolMap;
