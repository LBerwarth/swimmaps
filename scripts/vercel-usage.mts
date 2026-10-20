// Consommation Vercel du cycle en cours ; échoue au-delà du seuil pour que GitHub prévienne par mail.
const TEAM = "team_6xViKzdFtoN7UZstJr2VH8ek";
// Cycle de facturation Pro du 20 au 20 ; 20 $ de crédit inclus, budget à la demande de 1 $.
const CYCLE_DAY = 20;
const ALERT_USD = Number(process.env.ALERT_USD ?? 10);

const token = process.env.VERCEL_TOKEN;
if (!token) throw new Error("VERCEL_TOKEN manquant");

const now = new Date();
const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), CYCLE_DAY));
if (from > now) from.setUTCMonth(from.getUTCMonth() - 1);
if (process.env.FROM) from.setTime(Date.parse(process.env.FROM));
const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

const url = `https://api.vercel.com/v1/billing/charges?teamId=${TEAM}&from=${from.toISOString()}&to=${to.toISOString()}`;
const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
if (!res.ok) throw new Error(`API Vercel : HTTP ${res.status} ${await res.text()}`);

const byProject = new Map<string, number>();
const byService = new Map<string, number>();
let total = 0;
for (const line of (await res.text()).split("\n")) {
  if (!line.trim()) continue;
  const c = JSON.parse(line);
  if (c.ChargeCategory !== "Usage") continue;
  const cost = Number(c.EffectiveCost) || 0;
  total += cost;
  const project = c.Tags?.ProjectName ?? "(équipe)";
  byProject.set(project, (byProject.get(project) ?? 0) + cost);
  byService.set(c.ServiceName, (byService.get(c.ServiceName) ?? 0) + cost);
}

const top = (m: Map<string, number>) =>
  [...m].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `  ${v.toFixed(2).padStart(7)} $  ${k}`).join("\n");
console.log(`Cycle depuis ${from.toISOString().slice(0, 10)} : ${total.toFixed(2)} $ (seuil ${ALERT_USD} $, crédit 20 $)`);
console.log(`Par projet :\n${top(byProject)}\nPar service :\n${top(byService)}`);

if (total >= ALERT_USD) {
  console.error(`::error::Consommation Vercel ${total.toFixed(2)} $ ≥ ${ALERT_USD} $ — au-delà de 21 $, TOUS les projets sont mis en pause.`);
  process.exitCode = 1;
}
