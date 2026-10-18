# SwimMaps

Trouvez les piscines publiques autour de vous — France, Royaume-Uni,
Irlande, Allemagne, Espagne, Portugal, Italie, Suisse, Autriche, Belgique et Pays-Bas : choisissez un rayon (1 à 50 km),
voyez les bassins, les horaires et tarifs quand ils sont connus, sur carte, en
frise horaire et en liste. Interface en français, anglais, allemand, espagnol, italien, néerlandais et portugais
(`/fr`, `/en`, `/de`, `/es`, `/it`, `/nl`, `/pt`, redirection selon la langue du navigateur via `proxy.ts`).

Application sœur de [Piscines de Toulouse](https://piscines-toulouse.fr),
étendue à l'Europe. (Dossier/repo encore nommé `piscines-france` — renommer au
moment de la mise en ligne, et fixer `NEXT_PUBLIC_SITE_URL`.)

## Fonctionnalités

- **Recherche** par adresse (Base Adresse Nationale + Photon), géolocalisation,
  adresses enregistrées, rayon ; puis recherche par nom ou commune dans le rayon.
- **Filtres** combinables : type (couvert / plein air), longueur de bassin
  (25 m / 50 m), ouverture (cette semaine / aujourd'hui / maintenant), ★ Favoris.
  Recliquer une pastille active la relâche ; « ★ Favoris » remet les autres
  filtres à « Toutes », et se désactive si plus aucune favorite ne passerait.
  Préréglages par l'URL : `?open=now&type=outdoor&length=50&fav=1&radius=10`
  (aussi raccourcis du lanceur dans le manifeste PWA).
- **Trois blocs repliables** (état mémorisé) : frise « horaires par jour »
  (7 jours à partir d'aujourd'hui, ligne « maintenant »), carte Leaflet
  (★ = favorite, couleur vive = ouverte en ce moment), liste des fiches
  (favorites en tête, puis distance).
- **Fiches** : badge d'état (ouverte · jusqu'à…, ouvre à…, terminé, fermée,
  fermeture saisonnière), horaires interprétés depuis OSM `opening_hours`
  (semaine type, vacances scolaires, périodes particulières), tarif, boutons
  itinéraire / appel / site officiel, lien vers la **page dédiée**
  `/<lang>/piscine/<slug>` (horaires de la semaine, infos pratiques, plan,
  piscines voisines, JSON-LD `PublicSwimmingPool`).
- **Statut live Toulouse** : 28 piscines de Toulouse **et de son
  agglomération** (Blagnac, Colomiers, Balma, Muret, Ramonville…) reçoivent
  leur statut du jour depuis l'API `/api/status` de Piscines de Toulouse — il
  prime sur les horaires OSM (badge, filtres, frise). Correspondances
  `lib/toulouse-live.ts`, vérifiées par la distance entre les deux jeux de
  coordonnées.
- **PWA** : service worker (page et données du dernier chargement hors ligne),
  manifeste, icônes, guide d'installation iOS ; thème clair / sombre /
  automatique ; bandeau hors-ligne.
- **SEO / agents** : canoniques et `hreflang` par page, `sitemap.xml`
  (~30 000 URL), `robots.txt`, `/llms.txt`, `/agent-skill.md`,
  `/ai-catalog.json`.
- **Compléments des visiteurs** : sur une fiche sans type ou sans longueur,
  le visiteur répond (couverte / plein air / mixte, 25 m, 50 m ou autre) ;
  `/api/contrib` enregistre dans Upstash Redis (hash `contrib`, 20 envois/h
  par IP), affiche aussitôt (« complété par un nageur ») et prévient
  l'auteure par e-mail. Premier arrivé ; jamais par-dessus la source.
  Retirer une saisie : `HDEL contrib <id>` dans la console Upstash.
- **Pages** Sources et Confidentialité (trois langues), formulaire de
  signalement (`/api/feedback` → Resend, repli `mailto:` sans clé),
  mesure d'audience Vercel (agrégée, sans cookie).

## Données

Un fichier statique par pays (`public/data/piscines-<cc>.json` + `index.json`)
est généré par `npm run build:data` (orchestrateur multi-pays, un module par
source dans `scripts/sources/`). Le client charge l'index puis les fichiers
des pays couvrant la position choisie ; le serveur (fiches, sitemap, llms.txt)
les lit une fois depuis `public/data` (`lib/pools-server.ts`).

- **France** — Data ES + OSM (détails ci-dessous) : ~3 300 piscines.
- **Angleterre** — [Active Places](https://www.activeplacespower.com)
  (Sport England, licence OGL v3, API ArcGIS publique) : ~1 700 piscines
  réellement ouvertes au public (« Pay and Play » et clubs communautaires ;
  spas d'hôtels et clubs à adhésion écartés), avec longueurs de bassins et
  sites web. Enrichissement OSM identique à la France.
- **Allemagne** — [Bäderleben](https://baederleben.de) (Bundesinstitut für
  Sportwissenschaft) : ~4 850 bäder publics avec **tarifs d'entrée (83 %)**,
  longueurs, sites web et téléphones. Attribution obligatoire (affichée dans
  le pied de page) : © BISp, coordonnées © GeoBasis-DE / BKG 2021.
- **Irlande du Nord** — [Active Places NI](https://admin.opendatani.gov.uk/dataset/active-places-ni-sports-facilities-database)
  (Sport NI, OGL v3, extrait 2017) : piscines des conseils de district, plus les
  piscines OSM absentes de l'extrait.
- **Espagne, Portugal, Italie, Suisse, Autriche, Belgique, Pays-Bas, Irlande, Écosse,
  pays de Galles** — OpenStreetMap seul
  (`scripts/sources/osm.mts`) : centres et parcs aquatiques nommés, hôtels et
  campings écartés d'après le nom, éléments à moins de 200 m fusionnés en un
  site ; commune = `addr:city`, sinon localité OSM la plus proche. Les bases
  nationales (DSA Mulier Instituut, Sport Vlaanderen, Sport e Salute, CNID)
  pourront remplacer OSM comme base quand elles seront exploitables.

L'enrichissement « horaires du centre » (`npm run scrape:hours`) lit les
données structurées schema.org des sites officiels connus et complète les
piscines sans horaires (marquées `hoursFrom: "web"`).

Sources France :

- **[Data ES](https://equipements.sports.gouv.fr)** (ministère des Sports,
  licence ouverte) — recensement officiel des équipements sportifs. Base de
  référence : ~3 300 piscines, avec nom, adresse, commune, coordonnées GPS et
  types de bassins. Les installations réservées (établissements scolaires,
  militaires, médicaux, hébergements touristiques…) sont écartées d'après leur
  nom — le drapeau « ouvert au public » de Data ES est trop peu fiable.
- **[OpenStreetMap](https://www.openstreetmap.org/copyright)** (ODbL) —
  enrichissement par correspondance géographique (< 300 m) : horaires
  (`opening_hours`), tarif (`charge`/`fee`), site web, téléphone.

Couverture réelle de l'enrichissement (juillet 2026) : horaires ~12 % des
piscines, tarifs ~2 %, site web ~20 %. C'est l'état de l'open data français —
l'interface l'assume en affichant « non renseigné » et un lien vers le site
officiel plutôt qu'une information inventée.

**Superposition live Toulouse** : en dev, pointez
`NEXT_PUBLIC_TOULOUSE_STATUS_URL` vers `http://localhost:31000/api/status`.

## Développement

```bash
npm install
npm run dev          # http://localhost:3002
npm test             # parseur d'horaires, recherche, filtres, états du jour, slugs, schema.org
npm run lint
npm run build:data   # régénère public/data (sources en ligne)
```

`build:data` accepte des fichiers locaux pour éviter de retélécharger :
`npm run build:data -- --dataes bassins.json --osm osm.json`.

Le service worker est désactivé en développement (`NEXT_PUBLIC_SW_DEV=1` pour
le tester).

## Variables d'environnement

| Variable | Rôle | Défaut |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Domaine canonique (métadonnées, sitemap, JSON-LD). | URL de production Vercel, sinon `http://localhost:3002` |
| `NEXT_PUBLIC_TOULOUSE_STATUS_URL` | API statut du jour de Piscines de Toulouse. | `https://toulouse-piscines.vercel.app/api/status` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Adresse de contact (confidentialité, repli mailto). | adresse de l'auteure |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Upstash Redis des compléments (posées par l'intégration Vercel). Absentes = compléments désactivés. | — |
| `RESEND_API_KEY` | Envoi des signalements par e-mail. Absente = repli `mailto:` seul. | — |
| `FEEDBACK_EMAIL_TO` / `FEEDBACK_EMAIL_FROM` | Destinataire / expéditeur des signalements. | contact / `SwimMaps <onboarding@resend.dev>` |

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Leaflet ·
géocodage par [api-adresse.data.gouv.fr](https://adresse.data.gouv.fr/api-doc/adresse)
et [Photon](https://photon.komoot.io/) · Vercel Analytics.
Distances à vol d'oiseau partout (les distances routières OSRM, essayées puis
retirées, se sont révélées peu intuitives face au cercle de la carte).
