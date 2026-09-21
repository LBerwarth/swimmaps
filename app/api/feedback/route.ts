import { feedbackText, parseFeedback } from "@/lib/feedback";
import { CONTACT_EMAIL } from "@/lib/site";

export const runtime = "nodejs";

const MAIL_TO = process.env.FEEDBACK_EMAIL_TO ?? CONTACT_EMAIL;
// Expéditeur partagé de Resend : sans domaine vérifié, ne délivre qu'au titulaire du compte.
const MAIL_FROM = process.env.FEEDBACK_EMAIL_FROM ?? "Swimspot <onboarding@resend.dev>";

/**
 * Garde-fou anti-abus en mémoire seulement : rien n'est persisté, une instance
 * recyclée repart de zéro — assez pour couper un envoi en boucle.
 */
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const hits = [...(recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS), now];
  recent.set(ip, hits);
  if (recent.size > 500) {
    for (const [key, times] of recent) {
      if (times.every((t) => now - t >= WINDOW_MS)) recent.delete(key);
    }
  }
  return hits.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (tooMany(ip)) return Response.json({ error: "too_many" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const parsed = parseFeedback(body);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  // Sans clé Resend, le formulaire renvoie l'auteur vers le repli mailto.
  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ error: "unavailable" }, { status: 503 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: MAIL_TO,
      ...(parsed.value.email ? { reply_to: parsed.value.email } : {}),
      subject: `Swimspot — ${parsed.value.kind}`,
      text: feedbackText(parsed.value),
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.error("feedback email:", res ? `Resend HTTP ${res.status}` : "network error");
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
