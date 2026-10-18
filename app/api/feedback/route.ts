import { feedbackText, parseFeedback } from "@/lib/feedback";
import { sendMail } from "@/lib/mail";

export const runtime = "nodejs";

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

  const sent = await sendMail(
    `SwimMaps — ${parsed.value.kind}`,
    feedbackText(parsed.value),
    parsed.value.email,
  );
  // Sans clé Resend, le formulaire renvoie l'auteur vers le repli mailto.
  if (sent === "no_key") return Response.json({ error: "unavailable" }, { status: 503 });
  if (sent === "failed") return Response.json({ error: "unavailable" }, { status: 502 });
  return Response.json({ ok: true });
}
