// Corps du service worker, servi par app/sw.js/route.ts avec un identifiant de
// build en préfixe (SW_BUILD) : chaque déploiement produit un script différent,
// donc détecté comme une mise à jour par le navigateur.
export const SW_SOURCE = String.raw`
const CACHE = "swimmaps-" + SW_BUILD;

// CacheStorage peut se bloquer sans fin (profil corrompu) : chaque accès est
// borné, à défaut on fait comme s'il n'y avait pas de cache.
const CACHE_OP_MS = 700;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const bounded = (promise) =>
  Promise.race([promise.catch(() => null), pause(CACHE_OP_MS).then(() => null)]);

const OFFLINE_HTML =
  "<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'>" +
  "<title>Swimmaps</title>" +
  "<div style=\"font-family:system-ui;padding:2rem;text-align:center;color:#6d28d9\">" +
  "<h1>Hors ligne · Offline</h1><p>Ouvrez Swimmaps au moins une fois en ligne pour " +
  "consulter ensuite les dernières données enregistrées.<br>Open Swimmaps online once to browse the last saved data offline.</p>" +
  "<button onclick=\"location.reload()\" style=\"margin-top:1rem;padding:.6rem 1.6rem;" +
  "border:0;border-radius:9999px;background:#6d28d9;color:#fff;font-size:1rem\">" +
  "Réessayer · Retry</button></div>" +
  "<script>addEventListener('online',()=>location.reload())</script>";

const INSTALL_BUDGET_MS = 10000;

self.addEventListener("install", (event) =>
  event.waitUntil(
    (async () => {
      try {
        await Promise.race([
          (async () => {
            const cache = await caches.open(CACHE);
            const res = await fetch("/", { cache: "no-store" });
            if (res && res.ok) await cache.put("/", res);
          })(),
          pause(INSTALL_BUDGET_MS),
        ]);
      } catch {
        // Hors ligne pendant la mise à jour : la reprise d'activation suffira.
      }
      await self.skipWaiting();
    })()
  )
);

const ACTIVATE_COPY_BUDGET_MS = 3000;
const ACTIVATE_BUDGET_MS = 5000;

self.addEventListener("activate", (event) =>
  event.waitUntil(
    Promise.race([
      (async () => {
        const keys = await caches.keys();
        const oldKeys = keys.filter((k) => k !== CACHE);
        // Reprendre pages et données de l'ancien cache avant de le purger : le
        // repli hors-ligne existe ainsi juste après un déploiement. Les
        // ressources hachées (/_next/static/) de l'ancien build meurent avec lui.
        const target = await caches.open(CACHE);
        const deadline = Date.now() + ACTIVATE_COPY_BUDGET_MS;
        try {
          copie: for (const key of oldKeys) {
            const source = await caches.open(key);
            for (const req of await source.keys()) {
              if (Date.now() > deadline) break copie;
              const path = new URL(req.url).pathname;
              if (path.startsWith("/_next/") || path.startsWith("/icon-")) continue;
              if (!(await target.match(req))) {
                const res = await source.match(req);
                if (res) await target.put(req, res);
              }
            }
          }
        } catch {
          // Reprise best-effort : jamais au prix d'une activation bloquée.
        }
        await Promise.all(oldKeys.map((k) => caches.delete(k)));
        await self.clients.claim();
      })(),
      pause(ACTIVATE_BUDGET_MS),
    ]).catch(() => {})
  )
);

// Ouvrir vite prime : passé ce délai, la dernière page en cache est servie et
// le réseau continue en arrière-plan.
const NAV_TIMEOUT_MS = 1200;
const NAV_LAST_RESORT_MS = 5000;

function offlineResponse() {
  return new Response(OFFLINE_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

// Réseau d'abord, borné dans tous les cas : cache, puis page hors-ligne.
async function networkFirst(request, event, timeoutMs) {
  const cacheReady = bounded(caches.open(CACHE));
  const network = fetch(request).then((res) => {
    if (res && res.ok) {
      const copy = res.clone();
      cacheReady.then((cache) => {
        if (cache) cache.put(request, copy).catch(() => {});
      });
    }
    return res;
  });
  const timed = (ms) => Promise.race([network.catch(() => null), pause(ms)]);

  const winner = await timed(timeoutMs);
  if (winner && winner.ok) return winner;
  event.waitUntil(network.catch(() => {}));

  const cache = await cacheReady;
  const cached = cache
    ? (await bounded(cache.match(request))) ||
      (await bounded(cache.match(request, { ignoreSearch: true })))
    : null;
  if (cached) return cached;

  const late = await timed(NAV_LAST_RESORT_MS - timeoutMs);
  return late || (request.mode === "navigate" ? offlineResponse() : Response.error());
}

// Cache d'abord (ressources versionnées, au nom haché : sûres à figer).
async function cacheFirst(request) {
  const cache = await bounded(caches.open(CACHE));
  const cached = cache ? await bounded(cache.match(request)) : null;
  if (cached) return cached;
  const res = await fetch(request);
  if (cache && res && res.ok) cache.put(request, res.clone()).catch(() => {});
  return res;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // tuiles, géocodeurs : réseau direct

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, event, NAV_TIMEOUT_MS));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icon-") ||
    url.pathname.startsWith("/manifest") ||
    url.pathname === "/eau.jpg"
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Jeux de données (plusieurs Mo, revalidés par ETag) : réseau d'abord avec
  // un délai large, dernier fichier connu hors ligne.
  if (url.pathname.startsWith("/data/")) {
    event.respondWith(networkFirst(request, event, 4000));
    return;
  }
});
`;
