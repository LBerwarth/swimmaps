import "server-only";

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Page minimale des validations de l'auteure (hors interface, non indexée). */
export function reviewPage(body: string, status = 200): Response {
  return new Response(
    `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>SwimMaps — validation</title><body style="font-family:system-ui;max-width:40rem;margin:2rem auto;padding:0 1rem;line-height:1.5">${body}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

/** Tableau clé/valeur et boutons Valider / Refuser, postés à la même adresse. */
export function reviewForm(title: string, rows: Array<[string, string]>, id: string, token: string, extra = ""): Response {
  const table = rows
    .map(([k, v]) => `<tr><th align="left" style="padding-right:1rem;vertical-align:top">${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join("");
  return reviewPage(`<h1>${esc(title)}</h1><table>${table}</table>${extra}
<form method="post" style="display:flex;gap:.5rem;margin-top:1rem"><input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="token" value="${esc(token)}">
<button name="action" value="approve" style="padding:.5rem 1rem">Valider</button>
<button name="action" value="reject" style="padding:.5rem 1rem">Refuser</button></form>`);
}

export const GONE = "<p>Proposition introuvable ou déjà traitée.</p>";
