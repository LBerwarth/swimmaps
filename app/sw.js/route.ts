import { SW_SOURCE } from "@/lib/sw-source";

export const dynamic = "force-static";

// Identifiant du build : change à chaque déploiement (SHA du commit sur
// Vercel), ce qui rend le script différent, donc détecté comme mise à jour.
const BUILD_ID = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? String(Date.now());

export function GET() {
  const body = `const SW_BUILD = ${JSON.stringify(BUILD_ID)};\n${SW_SOURCE}`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
