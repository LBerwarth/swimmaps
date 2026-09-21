import { FEEDBACK_KINDS, type FeedbackKind } from "./i18n";

/** Ancre du formulaire, partagée par le pied de page (serveur) et le formulaire (client). */
export const FEEDBACK_ANCHOR = "feedback";

export const MESSAGE_MAX = 1500;
export const EMAIL_MAX = 200;
export const POOL_MAX = 120;

export type FeedbackError = "invalid" | "empty" | "too_long" | "bad_email";

export interface Feedback {
  kind: FeedbackKind;
  /** Nom saisi librement (10 000 piscines : pas de liste déroulante). */
  pool: string | null;
  message: string;
  email: string | null;
  /** Langue de l'interface au moment de l'envoi, pour répondre dans la bonne. */
  locale: string;
  /** Page d'où le message est parti (fiche d'une piscine, accueil…). */
  page: string | null;
}

function isKind(value: unknown): value is FeedbackKind {
  return typeof value === "string" && (FEEDBACK_KINDS as string[]).includes(value);
}

/** Valide la charge utile ; le texte d'erreur est une clé, traduite côté client. */
export function parseFeedback(
  body: unknown,
): { ok: true; value: Feedback } | { ok: false; error: FeedbackError } {
  if (typeof body !== "object" || body === null) return { ok: false, error: "invalid" };
  const { kind, pool, message, email, locale, page } = body as Record<string, unknown>;

  const text = typeof message === "string" ? message.trim() : "";
  if (!text) return { ok: false, error: "empty" };
  if (text.length > MESSAGE_MAX) return { ok: false, error: "too_long" };

  const mail = typeof email === "string" ? email.trim() : "";
  if (mail && (mail.length > EMAIL_MAX || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail))) {
    return { ok: false, error: "bad_email" };
  }

  return {
    ok: true,
    value: {
      kind: isKind(kind) ? kind : "other",
      pool: typeof pool === "string" && pool.trim() ? pool.trim().slice(0, POOL_MAX) : null,
      message: text,
      email: mail || null,
      locale: typeof locale === "string" ? locale.slice(0, 5) : "fr",
      page: typeof page === "string" && page.startsWith("/") ? page.slice(0, 300) : null,
    },
  };
}

/** Corps de l'e-mail (et du repli mailto côté navigateur). */
export function feedbackText(fb: Feedback): string {
  return [
    `Type : ${fb.kind}`,
    `Piscine : ${fb.pool ?? "non précisée"}`,
    `Page : ${fb.page ?? "—"}`,
    `Langue : ${fb.locale}`,
    `Réponse : ${fb.email ?? "pas d'adresse laissée"}`,
    "",
    fb.message,
  ].join("\n");
}
