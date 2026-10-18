import "server-only";
import { CONTACT_EMAIL } from "./site";

const MAIL_TO = process.env.FEEDBACK_EMAIL_TO ?? CONTACT_EMAIL;
// Expéditeur partagé de Resend : sans domaine vérifié, ne délivre qu'au titulaire du compte.
const MAIL_FROM = process.env.FEEDBACK_EMAIL_FROM ?? "SwimMaps <onboarding@resend.dev>";

export type MailResult = "sent" | "no_key" | "failed";

/** E-mail à l'auteure via Resend. */
export async function sendMail(subject: string, text: string, replyTo?: string | null): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "no_key";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: MAIL_TO,
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      text,
    }),
  }).catch(() => null);
  if (!res || !res.ok) {
    console.error("mail:", res ? `Resend HTTP ${res.status}` : "network error");
    return "failed";
  }
  return "sent";
}
