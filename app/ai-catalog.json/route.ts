import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Manifeste Agentic Resource Discovery (spec 1.0), découvrable aussi par
// <link rel="ai-catalog"> dans le layout.
export function GET() {
  const catalog = {
    specVersion: "1.0",
    host: {
      displayName: "SwimMaps",
      documentationUrl: `${SITE_URL}/fr/sources`,
    },
    entries: [
      {
        identifier: "urn:air:swimmaps:piscines-publiques-europe",
        displayName: "Piscines publiques d'Europe de l'Ouest",
        type: 'text/markdown; profile="urn:air:agent-skills"',
        url: `${SITE_URL}/agent-skill.md`,
        description:
          "Comment trouver une piscine publique près d'un lieu en France, Allemagne, Royaume-Uni, Irlande, Espagne, Portugal, Italie, Suisse, Autriche, Belgique ou aux Pays-Bas : jeux de données ouverts par pays, fiches par piscine, horaires et tarifs quand ils sont connus, et limites des données.",
        tags: ["piscine", "swimming pool", "Schwimmbad", "natation", "horaires", "open data"],
        representativeQueries: [
          "Quelle piscine publique près de Lyon a un bassin de 50 m ?",
          "Which public swimming pools in Manchester are open on Sunday?",
          "Welches Freibad in Berlin hat ein 50-m-Becken?",
          "Y a-t-il une piscine couverte ouverte ce soir près de moi ?",
        ],
        version: "1",
      },
    ],
  };
  return new Response(`${JSON.stringify(catalog, null, 2)}\n`, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
