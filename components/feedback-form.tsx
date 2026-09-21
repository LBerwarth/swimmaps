"use client";

import { useEffect, useState } from "react";
import { FEEDBACK_KINDS, type FeedbackKind } from "@/lib/i18n";
import { FEEDBACK_ANCHOR, MESSAGE_MAX, feedbackText } from "@/lib/feedback";
import { CONTACT_EMAIL } from "@/lib/site";
import { useDict, useLocale } from "@/components/locale-provider";

// Fond OPAQUE : Chrome peint la liste d'un <select> avec le fond du champ, et
// un fond translucide la rendrait illisible en thème sombre.
const INPUT_CLASS =
  "w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-fuchsia-400 focus:outline-none dark:border-white/15 dark:bg-[#241b32] dark:text-slate-100 dark:placeholder:text-slate-400";

export function FeedbackForm({ poolName }: { poolName?: string }) {
  const dict = useDict();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<FeedbackKind>("hours");
  const [pool, setPool] = useState(poolName ?? "");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState(false);

  // Lien de pied de page (#feedback) : le formulaire s'ouvre de lui-même.
  useEffect(() => {
    const openOnHash = () => {
      if (window.location.hash === `#${FEEDBACK_ANCHOR}`) setOpen(true);
    };
    openOnHash();
    window.addEventListener("hashchange", openOnHash);
    return () => window.removeEventListener("hashchange", openOnHash);
  }, []);

  const payload = {
    kind,
    pool: pool.trim() || null,
    message: message.trim(),
    email: email.trim() || null,
    locale,
    page: typeof window === "undefined" ? null : window.location.pathname,
  };
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(dict.fbSubject)}&body=${encodeURIComponent(
    feedbackText(payload),
  )}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending" || !payload.message) return;
    setStatus("sending");
    setError(false);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError(true);
    }
  }

  return (
    <section
      id={FEEDBACK_ANCHOR}
      className="mt-8 scroll-mt-4 overflow-hidden rounded-2xl bg-card shadow-md shadow-pink-100/50 dark:shadow-none dark:ring-1 dark:ring-white/10"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-violet-800 dark:text-violet-200">{dict.fbTitle}</span>
        <span
          aria-hidden
          className={`shrink-0 text-xs text-violet-500 transition-transform dark:text-violet-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="border-t border-violet-100 px-4 py-4 dark:border-white/10">
          {status === "sent" ? (
            <div className="text-sm text-slate-700 dark:text-slate-200">
              <p className="font-medium text-emerald-700 dark:text-emerald-300">{dict.fbSent}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{dict.fbSentHint}</p>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setMessage("");
                }}
                className="mt-3 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-fuchsia-900 transition-colors hover:bg-fuchsia-100 dark:bg-white/10 dark:text-fuchsia-100 dark:hover:bg-fuchsia-400/20"
              >
                {dict.fbAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-300">{dict.fbIntro}</p>

              <div className="flex flex-wrap gap-1.5">
                {FEEDBACK_KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    aria-pressed={kind === k}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      kind === k
                        ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 font-semibold text-white shadow-sm dark:from-pink-600 dark:to-fuchsia-700"
                        : "bg-white/70 font-medium text-fuchsia-900 hover:bg-fuchsia-100 dark:bg-white/10 dark:text-fuchsia-100 dark:hover:bg-fuchsia-400/20"
                    }`}
                  >
                    {dict.fbKinds[k]}
                  </button>
                ))}
              </div>

              <div>
                <label
                  htmlFor="feedback-pool"
                  className="block text-xs font-medium text-violet-800/70 dark:text-violet-200/85"
                >
                  {dict.fbPool}
                </label>
                <input
                  id="feedback-pool"
                  type="text"
                  value={pool}
                  onChange={(e) => setPool(e.target.value)}
                  maxLength={120}
                  placeholder={dict.fbPoolPlaceholder}
                  className={`mt-1 ${INPUT_CLASS}`}
                />
              </div>

              <div>
                <label
                  htmlFor="feedback-message"
                  className="block text-xs font-medium text-violet-800/70 dark:text-violet-200/85"
                >
                  {dict.fbMessage}
                </label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={MESSAGE_MAX}
                  rows={4}
                  required
                  placeholder={dict.fbMessagePlaceholder}
                  className={`mt-1 resize-y ${INPUT_CLASS}`}
                />
                {message.length > MESSAGE_MAX - 300 && (
                  <p className="mt-1 text-right text-xs text-slate-400 dark:text-slate-300">
                    {message.length}/{MESSAGE_MAX}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="feedback-email"
                  className="block text-xs font-medium text-violet-800/70 dark:text-violet-200/85"
                >
                  {dict.fbEmail} <span className="font-normal">{dict.fbEmailHint}</span>
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className={`mt-1 ${INPUT_CLASS}`}
                />
              </div>

              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-400/10 dark:text-rose-200">
                  {dict.fbErrorDefault}{" "}
                  <a href={mailto} className="underline underline-offset-2">
                    {dict.fbErrorMail}
                  </a>
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={status === "sending" || !payload.message}
                  className="rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity disabled:opacity-50 dark:from-pink-600 dark:to-fuchsia-700"
                >
                  {status === "sending" ? dict.fbSending : dict.fbSend}
                </button>
                <a
                  href={mailto}
                  className="text-xs text-slate-500 underline underline-offset-2 hover:text-fuchsia-700 dark:text-slate-300 dark:hover:text-fuchsia-300"
                >
                  {dict.fbOrEmail}
                </a>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
