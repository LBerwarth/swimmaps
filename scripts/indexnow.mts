// Annonce les URL du sitemap publié à IndexNow (Bing, Ecosia, Yandex) ; à relancer après un build:data.
const SITE = "https://www.swimmaps.eu";
// Clé publique par conception : IndexNow la vérifie sur /<clé>.txt.
const KEY = "65ff204be8046f07e1c0abfec6df36f1";
const BATCH = 10000;

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

for (let i = 0; i < urls.length; i += BATCH) {
  const urlList = urls.slice(i, i + BATCH);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
  });
  console.log(`${i + urlList.length}/${urls.length} → HTTP ${res.status}`);
  if (!res.ok) process.exitCode = 1;
}
