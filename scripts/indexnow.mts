// Annonce les URL du sitemap publié à IndexNow (Bing, Ecosia, Yandex) ; à relancer après un build:data.
const SITE = "https://www.swimmaps.eu";
// Clé publique par conception : IndexNow la vérifie sur /<clé>.txt.
const KEY = "65ff204be8046f07e1c0abfec6df36f1";
const BATCH = 1000;

const locs = async (url: string) =>
  [...(await (await fetch(url)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
// sitemap.xml est un index : une sitemap par langue.
const urls = (await Promise.all((await locs(`${SITE}/sitemap.xml`)).map(locs))).flat();

for (let i = 0; i < urls.length; i += BATCH) {
  const urlList = urls.slice(i, i + BATCH);
  // api.indexnow.org coupe la connexion depuis Node ; Bing relaie aux autres moteurs.
  const res = await fetch("https://www.bing.com/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
  });
  console.log(`${i + urlList.length}/${urls.length} → HTTP ${res.status}`);
  if (!res.ok) process.exitCode = 1;
}
