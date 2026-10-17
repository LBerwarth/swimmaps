/**
 * Internationalisation de Swimmaps : français, anglais, allemand — une langue
 * par pays couvert. Dictionnaires plats, quelques entrées fonctions pour les
 * chaînes paramétrées.
 */

export type Locale = "fr" | "en" | "de";
export const LOCALES: Locale[] = ["fr", "en", "de"];
export const DEFAULT_LOCALE: Locale = "fr";

export type FeedbackKind = "hours" | "info" | "missing" | "suggestion" | "other";
export const FEEDBACK_KINDS: FeedbackKind[] = ["hours", "info", "missing", "suggestion", "other"];

export interface LinkItem {
  label: string;
  detail?: string;
  url: string;
}

export interface Dict {
  intlLocale: string;
  metaTitle: string;
  metaDescription: string;
  subtitle: string;

  langAria: string;
  navSources: string;
  navPrivacy: string;
  navFeedback: string;
  backHome: string;
  dataDate: (date: string) => string;
  dataInfoAria: string;
  dataInfo: string;
  themeNames: { system: string; light: string; dark: string };
  themeSwitch: (current: string, next: string) => string;

  iosInstallLead: string;
  iosInstallTail: string;
  iosHow: string;
  iosHideSteps: string;
  iosDismiss: string;
  iosShare: string;
  iosStep1: string;
  iosStep2a: string;
  iosStep2b: string;
  iosCopy: string;
  iosBookmark: string;
  iosAddHome: string;
  iosCancel: string;
  iosAdd: string;
  iosStep3a: string;
  iosStep3b: string;

  offlineBanner: string;
  offlineReload: string;

  searchPlaceholder: string;
  searchAria: string;
  locateButton: string;
  locating: string;
  errNoGeolocation: string;
  errGeoDenied: string;
  errSearchDown: string;

  savedAddressesAria: string;
  saveAddress: string;
  removeAddress: (label: string) => string;

  poolSearchPlaceholder: string;
  poolSearchAria: string;
  poolSearchClear: string;
  searchCount: (n: number, total: number) => string;
  searchNone: (query: string) => string;

  radiusLabel: string;
  radiusAria: string;
  typeLabel: string;
  typeAria: string;
  typeAll: string;
  typeIndoor: string;
  typeOutdoor: string;
  openLabel: string;
  openAria: string;
  openTitle: string;
  openAll: string;
  openWeek: string;
  openWeekShort: string;
  openNow: string;
  openNowShort: string;
  openToday: string;
  openTodayShort: string;
  favLabel: string;
  favAria: string;
  favAll: string;
  favOnly: string;
  favTip: string;
  favTipOk: string;
  lenLabel: string;
  lenAria: string;
  lenAll: string;

  sectionTimeline: string;
  sectionMap: string;
  sectionList: (n: number) => string;

  dayShort: string[];
  todaySuffix: string;
  legendOpenNow: string;
  legendSlot: string;
  legendNow: string;
  timelineUnknown: (n: number) => string;
  timelineMore: (n: number) => string;
  timelineSeasonal: string;
  timelineClosed: string;
  timelineHolidayNote: string;
  timelineGoto: (name: string) => string;

  loadError: string;
  emptyTitle: string;
  emptyHint: string;
  referenced: (n: string) => string;
  loadingPools: string;
  noneInRadius: string;
  noneInRadiusNear: (km: string) => string;
  noneFavorite: string;
  noneFilters: string;
  countLine: (n: number, radiusKm: number, label: string) => string;
  showMore: (n: number) => string;
  mapAria: string;
  mapOpenCount: (n: number) => string;
  mapHint: string;
  mapPopupDetail: string;

  distanceTitle: string;
  favAdd: (name: string) => string;
  favRemove: (name: string) => string;
  envLabels: Record<string, string>;
  basinLabels: Record<string, string>;
  basinFallback: (label: string) => string;

  seasonalClosed: string;
  badgeOpenNow: string;
  badgeOpenUntil: (time: string) => string;
  badgeOpensAt: (time: string) => string;
  badgeDone: string;
  badgeClosedNow: string;
  badgeClosedToday: string;
  todayLabel: string;
  liveSource: string;
  schoolTerm: string;
  schoolHolidays: string;
  specialPeriods: string;
  hoursLabel: string;
  centreHoursNote: string;
  noHours: string;
  priceLabel: string;
  paidEntry: string;
  freeEntry: string;
  directions: string;
  directionsAria: (name: string) => string;
  directionsTitle: string;
  phoneAria: (name: string, phone: string) => string;
  phoneTitle: (phone: string) => string;
  website: string;
  websiteAria: (name: string) => string;
  websiteTitle: string;
  searchWebsite: string;
  searchWebsiteTitle: string;
  detailLink: string;
  detailLinkTitle: string;

  detailMetaTitle: (name: string, city: string) => string;
  detailMetaDescription: (name: string, city: string) => string;
  detailSubtitle: (city: string) => string;
  detailHoursTitle: string;
  detailHoursNote: string;
  detailHoursUnknown: string;
  detailRawHours: string;
  detailInfoTitle: string;
  detailAddress: string;
  detailBasins: string;
  detailLengths: string;
  detailNearbyTitle: string;
  detailNearbyAway: (km: string) => string;
  detailBack: string;

  fbTitle: string;
  fbIntro: string;
  fbKinds: Record<FeedbackKind, string>;
  fbPool: string;
  fbPoolPlaceholder: string;
  fbMessage: string;
  fbMessagePlaceholder: string;
  fbEmail: string;
  fbEmailHint: string;
  fbSend: string;
  fbSending: string;
  fbOrEmail: string;
  fbSent: string;
  fbSentHint: string;
  fbAnother: string;
  fbErrorDefault: string;
  fbErrorMail: string;
  fbSubject: string;

  footerData: string;
  footerLicenceFR: string;
  footerLicenceGB: string;
  footerLicenceDE: string;
  footerOsm: string;
  footerDisclaimer: string;
  footerIndependent: string;

  coveredLabel: string;
  countryNames: Record<string, string>;

  sources: {
    title: string;
    subtitle: string;
    intro: string;
    groups: Array<{ title: string; items: LinkItem[] }>;
    howTitle: string;
    how: string[];
  };
  privacy: {
    title: string;
    subtitle: string;
    updated: (date: string) => string;
    intro: string;
    sections: Array<{ title: string; paragraphs: string[] }>;
    contactTitle: string;
    changesTitle: string;
    changes: string;
  };
}

export const PRIVACY_UPDATED = "2026-09-21";

const URLS = {
  dataEs: "https://equipements.sports.gouv.fr",
  osm: "https://www.openstreetmap.org/copyright",
  activePlaces: "https://www.activeplacespower.com",
  baederleben: "https://baederleben.de",
  toulouse: "https://piscines-toulouse.fr/sources",
  schema: "https://schema.org/openingHoursSpecification",
  ban: "https://adresse.data.gouv.fr/",
  photon: "https://photon.komoot.io/",
  tiles: "https://operations.osmfoundation.org/policies/tiles/",
} as const;

const BASINS_FR = {
  sportif: "bassin sportif",
  ludique: "bassin ludique",
  mixte: "bassin mixte",
  toboggan: "bassin toboggan",
  plongeon: "fosse à plongeon",
  plongée: "fosse à plongée",
  principal: "bassin principal",
  apprentissage: "bassin d'apprentissage",
  lido: "bassin de plein air",
  pataugeoire: "pataugeoire",
  vagues: "bassin à vagues",
  spa: "bain à remous",
  kneipp: "bassin Kneipp",
  naturel: "bassin naturel",
};

const fr: Dict = {
  intlLocale: "fr-FR",
  metaTitle: "Swimmaps — trouvez une piscine près de chez vous",
  metaDescription:
    "Toutes les piscines publiques autour de vous, en France, en Angleterre et en Allemagne : " +
    "choisissez un rayon, voyez les bassins, horaires et tarifs disponibles, avec carte et itinéraires.",
  subtitle:
    "Trouvez les piscines publiques autour de vous : bassins, horaires et tarifs quand ils sont connus.",

  langAria: "Langue / Language / Sprache",
  navSources: "Sources",
  navPrivacy: "Confidentialité",
  navFeedback: "Signaler une erreur",
  backHome: "Toutes les piscines",
  dataDate: (date) => `Données du ${date}`,
  dataInfoAria: "Comment les données sont mises à jour",
  dataInfo:
    "Les jeux de données (Data ES, Active Places, Bäderleben, OpenStreetMap) sont reconstitués par script et publiés avec l'application : la date indique le dernier relevé. Les piscines de Toulouse reçoivent en plus leur statut du jour en direct.",
  themeNames: { system: "automatique", light: "clair", dark: "sombre" },
  themeSwitch: (current, next) => `Thème : ${current} — passer en ${next}`,

  iosInstallLead: "Installez l'appli : touchez",
  iosInstallTail: "puis « Sur l'écran d'accueil ».",
  iosHow: "Comment faire ?",
  iosHideSteps: "Masquer les étapes",
  iosDismiss: "Masquer cette invitation",
  iosShare: "Partager",
  iosStep1: "— dans Safari, en bas de l'écran sur iPhone, en haut à droite sur iPad.",
  iosStep2a: "Faites défiler la liste des actions vers le bas jusqu'à",
  iosStep2b: "« Sur l'écran d'accueil ».",
  iosCopy: "Copier",
  iosBookmark: "Ajouter aux favoris",
  iosAddHome: "Sur l'écran d'accueil",
  iosCancel: "Annuler",
  iosAdd: "Ajouter",
  iosStep3a: "Touchez",
  iosStep3b: "L'icône apparaît sur l'écran d'accueil : ouvrez l'appli depuis là.",

  offlineBanner:
    "Vous êtes hors ligne. Les piscines affichées viennent du dernier chargement — la carte et la recherche d'adresse reviendront avec le réseau.",
  offlineReload: "Actualiser",

  searchPlaceholder: "Adresse, ville, code postal…",
  searchAria: "Rechercher une adresse",
  locateButton: "📍 Autour de moi",
  locating: "Localisation…",
  errNoGeolocation: "La géolocalisation n'est pas disponible sur cet appareil.",
  errGeoDenied: "Position refusée ou indisponible — cherchez une adresse à la place.",
  errSearchDown: "Recherche d'adresse indisponible pour le moment.",

  savedAddressesAria: "Adresses enregistrées",
  saveAddress: "☆ Enregistrer",
  removeAddress: (label) => `Supprimer l'adresse ${label}`,

  poolSearchPlaceholder: "Rechercher une piscine ou une commune dans le rayon…",
  poolSearchAria: "Rechercher une piscine ou une commune",
  poolSearchClear: "Effacer la recherche",
  searchCount: (n, total) =>
    `${n === 0 ? "Aucune piscine ne porte ce nom" : `${n} piscine${n > 1 ? "s" : ""} trouvée${n > 1 ? "s" : ""}`} parmi les ${total} du rayon, tous filtres confondus.`,
  searchNone: (query) => `Aucune piscine ne correspond à « ${query} ».`,

  radiusLabel: "Rayon",
  radiusAria: "Rayon de recherche",
  typeLabel: "Type",
  typeAria: "Type de piscine",
  typeAll: "Toutes",
  typeIndoor: "Couvertes",
  typeOutdoor: "Plein air",
  openLabel: "Ouvertes",
  openAria: "Ouverture",
  openTitle:
    "« Cette semaine » : écarte les fermetures saisonnières connues. « Aujourd'hui » : garde les piscines aux horaires inconnus. « Maintenant » : horaires connus et ouverts uniquement.",
  openAll: "Toutes",
  openWeek: "Cette semaine",
  openWeekShort: "Semaine",
  openNow: "Maintenant",
  openNowShort: "Maint.",
  openToday: "Aujourd'hui",
  openTodayShort: "AJD",
  favLabel: "Suivies",
  favAria: "Favoris",
  favAll: "Toutes",
  favOnly: "★ Favoris",
  favTip:
    "💡 Touchez ☆ à côté du nom d'une piscine pour la suivre : elle passe en tête de liste, et la pastille ★ Favoris la retrouve.",
  favTipOk: "Compris",
  lenLabel: "Bassin",
  lenAria: "Longueur de bassin",
  lenAll: "Toutes",

  sectionTimeline: "Horaires par jour",
  sectionMap: "Où sont les piscines",
  sectionList: (n) => `Les piscines (${n})`,

  dayShort: ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."],
  todaySuffix: "(aujourd'hui)",
  legendOpenNow: "ouverte maintenant",
  legendSlot: "créneau d'ouverture",
  legendNow: "maintenant",
  timelineUnknown: (n) =>
    `${n} piscine${n > 1 ? "s" : ""} du rayon sans horaires connus ne figure${n > 1 ? "nt" : ""} pas ici.`,
  timelineMore: (n) => `${n} autre${n > 1 ? "s" : ""} plus loin — réduisez le rayon pour les voir.`,
  timelineSeasonal: "fermeture saisonnière",
  timelineClosed: "fermée",
  timelineHolidayNote:
    "Semaine type en période scolaire ; les horaires de vacances scolaires figurent sur chaque fiche.",
  timelineGoto: (name) => `Aller à la fiche ${name}`,

  loadError: "Impossible de charger la liste des piscines. Rechargez la page.",
  emptyTitle: "Où cherchez-vous une piscine ?",
  emptyHint: "Touchez « 📍 Autour de moi » ou saisissez une adresse ci-dessus.",
  referenced: (n) => `${n} piscines publiques référencées.`,
  loadingPools: "Chargement des piscines…",
  noneInRadius: "Aucune piscine dans ce rayon — essayez un rayon plus grand.",
  noneInRadiusNear: (km) => `Aucune piscine dans ce rayon — la plus proche est à ${km}.`,
  noneFavorite:
    "Aucune piscine favorite dans ce rayon — touchez ☆ sur une piscine pour l'ajouter.",
  noneFilters: "Aucune piscine ne correspond à ces filtres dans ce rayon.",
  countLine: (n, radiusKm, label) =>
    `${n} piscine${n > 1 ? "s" : ""} à moins de ${radiusKm} km à vol d'oiseau de ${label}.`,
  showMore: (n) => `Afficher plus (${n} restantes)`,
  mapAria: "Carte des piscines",
  mapOpenCount: (n) => `${n} piscine${n > 1 ? "s" : ""} ouverte${n > 1 ? "s" : ""} en ce moment.`,
  mapHint:
    "Touchez un repère pour ouvrir sa fiche. ★ = piscine suivie, couleur vive = ouverte en ce moment.",
  mapPopupDetail: "Fiche détaillée",

  distanceTitle: "Distance à vol d'oiseau",
  favAdd: (name) => `Ajouter ${name} aux favoris`,
  favRemove: (name) => `Retirer ${name} des favoris`,
  envLabels: { int: "Couverte", ext: "Plein air", mix: "Couverte + plein air" },
  basinLabels: BASINS_FR,
  basinFallback: (label) => `bassin ${label}`,

  seasonalClosed: "Fermeture saisonnière en cours",
  badgeOpenNow: "Ouverte en ce moment",
  badgeOpenUntil: (time) => `Ouverte · jusqu'à ${time}`,
  badgeOpensAt: (time) => `Ouvre à ${time}`,
  badgeDone: "Terminé pour aujourd'hui",
  badgeClosedNow: "Fermée en ce moment",
  badgeClosedToday: "Fermée aujourd'hui",
  todayLabel: "Aujourd'hui :",
  liveSource: "Statut du jour en direct — piscines-toulouse.fr",
  schoolTerm: "Période scolaire",
  schoolHolidays: "Vacances scolaires",
  specialPeriods: "Périodes particulières",
  hoursLabel: "Horaires :",
  centreHoursNote:
    "Horaires d'ouverture du centre (source : site officiel) — les créneaux des bassins peuvent différer.",
  noHours: "Horaires non renseignés — vérifiez sur le site officiel.",
  priceLabel: "Tarif :",
  paidEntry: "Entrée payante",
  freeEntry: "Accès gratuit",
  directions: "Itinéraire",
  directionsAria: (name) => `Itinéraire vers ${name} (Google Maps)`,
  directionsTitle: "Itinéraire — ouvre Google Maps",
  phoneAria: (name, phone) => `Appeler ${name} au ${phone}`,
  phoneTitle: (phone) => `Appeler l'accueil — ${phone}`,
  website: "Site web",
  websiteAria: (name) => `Site officiel de ${name} (nouvel onglet)`,
  websiteTitle: "Site officiel — ouvre un nouvel onglet",
  searchWebsite: "Rechercher le site",
  searchWebsiteTitle: "Site inconnu — rechercher sur le web",
  detailLink: "Fiche détaillée",
  detailLinkTitle: "Fiche détaillée — horaires de la semaine et infos pratiques",

  detailMetaTitle: (name, city) => `${name} à ${city} — horaires, bassins et accès`,
  detailMetaDescription: (name, city) =>
    `Piscine ${name} à ${city} : horaires d'ouverture quand ils sont connus, bassins et longueurs, tarif, adresse, itinéraire et site officiel.`,
  detailSubtitle: (city) => `Piscine publique à ${city} — horaires, bassins et accès.`,
  detailHoursTitle: "Horaires de la semaine",
  detailHoursNote:
    "Horaires issus de sources ouvertes (OpenStreetMap, site officiel) — vérifiez avant de vous déplacer.",
  detailHoursUnknown:
    "Horaires non renseignés dans nos sources : consultez le site officiel ou appelez l'accueil.",
  detailRawHours: "Horaires publiés (non interprétés)",
  detailInfoTitle: "Infos pratiques",
  detailAddress: "Adresse",
  detailBasins: "Bassins",
  detailLengths: "Longueurs",
  detailNearbyTitle: "Autres piscines à proximité",
  detailNearbyAway: (km) => `à ${km}`,
  detailBack: "← Toutes les piscines autour de moi",

  fbTitle: "💬 Signaler une erreur ou donner votre avis",
  fbIntro:
    "Un horaire faux, une piscine fermée ou manquante, une idée ? Dites-le, cela aide à corriger l'application et ses sources ouvertes.",
  fbKinds: {
    hours: "Horaires incorrects",
    info: "Info erronée",
    missing: "Piscine manquante ou fermée",
    suggestion: "Suggestion",
    other: "Autre",
  },
  fbPool: "Piscine concernée (facultatif)",
  fbPoolPlaceholder: "Nom et commune",
  fbMessage: "Votre message",
  fbMessagePlaceholder: "Ex. : la piscine ferme à 19h le samedi, pas 20h.",
  fbEmail: "Votre e-mail",
  fbEmailHint: "(facultatif, pour la réponse)",
  fbSend: "Envoyer",
  fbSending: "Envoi…",
  fbOrEmail: "ou par e-mail",
  fbSent: "✓ Merci, votre message est bien arrivé.",
  fbSentHint:
    "Une correction d'horaires se fait aussi directement dans OpenStreetMap : elle profite alors à tout le monde.",
  fbAnother: "Envoyer un autre message",
  fbErrorDefault: "Envoi impossible pour le moment.",
  fbErrorMail: "Vous pouvez aussi envoyer le message par e-mail.",
  fbSubject: "Swimmaps — signalement",

  footerData: "Données :",
  footerLicenceFR: "(licence ouverte)",
  footerLicenceGB: "(licence OGL v3)",
  footerLicenceDE:
    "(© Bundesinstitut für Sportwissenschaft · coordonnées © GeoBasis-DE / BKG 2021)",
  footerOsm: "© les contributeurs d'OpenStreetMap",
  footerDisclaimer:
    "Horaires et tarifs issus de sources ouvertes : disponibles pour une partie des piscines " +
    "seulement — vérifiez sur le site officiel avant de vous déplacer.",
  footerIndependent:
    "Application personnelle et indépendante, non affiliée aux gestionnaires des piscines ni à aucune administration.",

  coveredLabel: "Pays couverts :",
  countryNames: { fr: "France", gb: "Angleterre", de: "Allemagne" },

  sources: {
    title: "Sources des données",
    subtitle: "D'où viennent les piscines, horaires et tarifs affichés",
    intro:
      "Swimmaps est une application personnelle et indépendante, non affiliée aux gestionnaires des piscines ni à aucune administration. Elle n'invente aucune donnée : tout ce qu'elle affiche vient des sources ouvertes ci-dessous, et une information absente est dite absente plutôt que devinée. Vérifiez toujours une information critique sur le site officiel de la piscine.",
    groups: [
      {
        title: "France",
        items: [
          {
            label: "Data ES — recensement des équipements sportifs",
            detail:
              "Ministère des Sports, licence ouverte : nom, adresse, coordonnées, bassins et longueurs. Les installations réservées (scolaires, militaires, hôtelières…) sont écartées.",
            url: URLS.dataEs,
          },
          {
            label: "OpenStreetMap",
            detail:
              "ODbL : horaires (opening_hours), tarif, site web et téléphone, rapprochés par proximité géographique (< 300 m).",
            url: URLS.osm,
          },
          {
            label: "Piscines de Toulouse — statut du jour en direct",
            detail:
              "L'application sœur relève les pages officielles de Toulouse et de son agglomération ; son statut prime sur les horaires OSM pour ces piscines.",
            url: URLS.toulouse,
          },
        ],
      },
      {
        title: "Angleterre",
        items: [
          {
            label: "Active Places (Sport England)",
            detail:
              "Licence OGL v3 : piscines ouvertes au public (« Pay and Play » et clubs communautaires), longueurs et sites web. Enrichissement OpenStreetMap identique à la France.",
            url: URLS.activePlaces,
          },
        ],
      },
      {
        title: "Allemagne",
        items: [
          {
            label: "Bäderleben (Bundesinstitut für Sportwissenschaft)",
            detail:
              "Bäder publics avec tarifs d'entrée, longueurs, sites web et téléphones. © BISp ; coordonnées © GeoBasis-DE / BKG 2021.",
            url: URLS.baederleben,
          },
        ],
      },
      {
        title: "Autres services utilisés",
        items: [
          {
            label: "Sites officiels des piscines",
            detail:
              "Horaires du centre lus dans leurs données structurées schema.org quand OpenStreetMap n'en a pas (marqués comme tels sur la fiche).",
            url: URLS.schema,
          },
          {
            label: "Base Adresse Nationale",
            detail: "Recherche d'adresse en France (api-adresse.data.gouv.fr).",
            url: URLS.ban,
          },
          {
            label: "Photon (komoot)",
            detail: "Recherche d'adresse hors de France, sur données OpenStreetMap.",
            url: URLS.photon,
          },
          {
            label: "Fond de carte OpenStreetMap",
            detail: "Tuiles servies par la fondation OpenStreetMap.",
            url: URLS.tiles,
          },
        ],
      },
    ],
    howTitle: "Comment les données sont relevées",
    how: [
      "Un script reconstitue les jeux de données pays par pays et les publie avec l'application ; la date du dernier relevé figure en tête de la page d'accueil. Rien n'est complété à la main.",
      "La couverture reflète l'état de l'open data : en France, les horaires ne sont connus que pour environ une piscine sur dix, les tarifs pour une sur cinquante. L'interface affiche alors « non renseigné » et un lien vers le site officiel.",
      "Une erreur se corrige à la source — dans OpenStreetMap pour les horaires, tarifs et sites web — ou via le formulaire de signalement de l'application.",
    ],
  },
  privacy: {
    title: "Politique de confidentialité",
    subtitle: "Application « Swimmaps »",
    updated: (date) => `Dernière mise à jour : ${date}`,
    intro:
      "Swimmaps est une application personnelle et bénévole, non affiliée aux gestionnaires des piscines ni à aucune administration. Elle affiche les piscines publiques à partir de données ouvertes. Cette page explique quelles données elle traite — en résumé : rien qui vous identifie, sauf ce que vous choisissez vous-même de nous écrire.",
    sections: [
      {
        title: "Données personnelles collectées",
        paragraphs: [
          "Aucune, par défaut. L'application ne demande pas de compte et ne collecte aucune donnée vous concernant. Elle n'accède à votre position que si vous touchez « Autour de moi », et cette position reste dans votre navigateur : elle sert à calculer les distances et n'est jamais envoyée à notre serveur.",
          "Quand vous saisissez une adresse, le texte tapé est envoyé aux services de recherche d'adresse (Base Adresse Nationale pour la France, Photon/komoot ailleurs) pour être transformé en coordonnées. Rien d'autre ne leur est transmis.",
        ],
      },
      {
        title: "Stockage local sur votre appareil",
        paragraphs: [
          "Vos favoris (★), vos adresses enregistrées, la dernière recherche, le thème choisi et l'état des blocs repliés sont conservés dans le stockage local de votre navigateur, sur votre appareil uniquement. Ils ne sont jamais transmis et disparaissent si vous effacez les données du site.",
        ],
      },
      {
        title: "Suivi, publicité et cookies",
        paragraphs: [
          "L'application ne contient aucune publicité et ne dépose aucun cookie.",
          "Elle utilise la mesure d'audience de Vercel, son hébergeur, qui compte le nombre de visites et les pages consultées. Cette mesure est agrégée et sans cookie : elle ne crée aucun profil, ne vous suit pas d'un site à l'autre et ne permet pas de vous identifier.",
        ],
      },
      {
        title: "Services tiers affichés dans la page",
        paragraphs: [
          "Le fond de carte est servi par la fondation OpenStreetMap : comme pour toute image chargée depuis un autre site, votre adresse IP lui est visible. Le statut du jour des piscines de Toulouse est lu sur l'application sœur Piscines de Toulouse, sans aucune donnée vous concernant.",
        ],
      },
      {
        title: "Formulaire de signalement (facultatif)",
        paragraphs: [
          "Le formulaire ne transmet que ce que vous saisissez : le type de signalement, la piscine concernée, votre message et — si vous le souhaitez — votre adresse e-mail. Il est envoyé par e-mail à l'auteure de l'application (via le prestataire Resend), à la seule fin de corriger l'application et, le cas échéant, de vous répondre. Aucune liste de diffusion, aucun partage, aucune revente ; écrivez-nous pour faire supprimer un message envoyé.",
        ],
      },
      {
        title: "Données techniques d'hébergement",
        paragraphs: [
          "Le site est hébergé par Vercel. Comme tout serveur web, l'hébergeur peut journaliser des données techniques standard (adresse IP, type de navigateur) à seule fin de fournir la page et d'assurer la sécurité du service. Ces journaux ne sont ni consultés ni exploités par l'auteure.",
        ],
      },
      {
        title: "Vos droits",
        paragraphs: [
          "Si vous n'avez pas envoyé de signalement, il n'existe aucune donnée vous concernant. Dans le cas contraire, vous pouvez à tout moment demander à consulter, corriger ou supprimer ce qui vous concerne à l'adresse ci-dessous.",
        ],
      },
    ],
    contactTitle: "Contact",
    changesTitle: "Modifications",
    changes:
      "Cette politique pourra être mise à jour. La date de dernière mise à jour figure en haut de la page.",
  },
};

const en: Dict = {
  intlLocale: "en-GB",
  metaTitle: "Swimmaps — find a swimming pool near you",
  metaDescription:
    "Every public swimming pool around you, in France, England and Germany: pick a radius, " +
    "see pools, opening hours and prices where known, with a map and directions.",
  subtitle:
    "Find the public swimming pools around you: basins, opening hours and prices where known.",

  langAria: "Langue / Language / Sprache",
  navSources: "Sources",
  navPrivacy: "Privacy",
  navFeedback: "Report an error",
  backHome: "All pools",
  dataDate: (date) => `Data as of ${date}`,
  dataInfoAria: "How the data is updated",
  dataInfo:
    "The datasets (Data ES, Active Places, Bäderleben, OpenStreetMap) are rebuilt by script and shipped with the app: the date is the last extraction. Toulouse pools additionally get their live daily status.",
  themeNames: { system: "automatic", light: "light", dark: "dark" },
  themeSwitch: (current, next) => `Theme: ${current} — switch to ${next}`,

  iosInstallLead: "Install the app: tap",
  iosInstallTail: "then “Add to Home Screen”.",
  iosHow: "How?",
  iosHideSteps: "Hide the steps",
  iosDismiss: "Hide this invitation",
  iosShare: "Share",
  iosStep1: "— in Safari, at the bottom of the screen on iPhone, top right on iPad.",
  iosStep2a: "Scroll the list of actions down to",
  iosStep2b: "“Add to Home Screen”.",
  iosCopy: "Copy",
  iosBookmark: "Add Bookmark",
  iosAddHome: "Add to Home Screen",
  iosCancel: "Cancel",
  iosAdd: "Add",
  iosStep3a: "Tap",
  iosStep3b: "The icon appears on your home screen: open the app from there.",

  offlineBanner:
    "You are offline. The pools shown come from the last load — the map and address search will return with the network.",
  offlineReload: "Reload",

  searchPlaceholder: "Address, town, postcode…",
  searchAria: "Search for an address",
  locateButton: "📍 Around me",
  locating: "Locating…",
  errNoGeolocation: "Geolocation is not available on this device.",
  errGeoDenied: "Location denied or unavailable — search for an address instead.",
  errSearchDown: "Address search is unavailable right now.",

  savedAddressesAria: "Saved addresses",
  saveAddress: "☆ Save",
  removeAddress: (label) => `Remove address ${label}`,

  poolSearchPlaceholder: "Search a pool or a town within the radius…",
  poolSearchAria: "Search a pool or a town",
  poolSearchClear: "Clear search",
  searchCount: (n, total) =>
    `${n === 0 ? "No pool has this name" : `${n} pool${n > 1 ? "s" : ""} found`} among the ${total} within the radius, ignoring filters.`,
  searchNone: (query) => `No pool matches “${query}”.`,

  radiusLabel: "Radius",
  radiusAria: "Search radius",
  typeLabel: "Type",
  typeAria: "Pool type",
  typeAll: "All",
  typeIndoor: "Indoor",
  typeOutdoor: "Outdoor",
  openLabel: "Open",
  openAria: "Opening",
  openTitle:
    "“This week”: drops known seasonal closures. “Today”: keeps pools with unknown hours. “Now”: only pools with known, currently-open hours.",
  openAll: "All",
  openWeek: "This week",
  openWeekShort: "Week",
  openNow: "Now",
  openNowShort: "Now",
  openToday: "Today",
  openTodayShort: "Today",
  favLabel: "Starred",
  favAria: "Favourites",
  favAll: "All",
  favOnly: "★ Favourites",
  favTip:
    "💡 Tap ☆ next to a pool's name to follow it: it moves to the top of the list, and the ★ Favourites chip brings it back.",
  favTipOk: "Got it",
  lenLabel: "Length",
  lenAria: "Pool length",
  lenAll: "Any",

  sectionTimeline: "Hours by day",
  sectionMap: "Where the pools are",
  sectionList: (n) => `The pools (${n})`,

  dayShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  todaySuffix: "(today)",
  legendOpenNow: "open now",
  legendSlot: "opening slot",
  legendNow: "now",
  timelineUnknown: (n) =>
    `${n} pool${n > 1 ? "s" : ""} within the radius with unknown hours ${n > 1 ? "are" : "is"} not shown here.`,
  timelineMore: (n) => `${n} more further away — reduce the radius to see them.`,
  timelineSeasonal: "seasonal closure",
  timelineClosed: "closed",
  timelineHolidayNote:
    "Standard week during school term; school-holiday hours are on each pool's page.",
  timelineGoto: (name) => `Go to ${name}`,

  loadError: "Could not load the pool list. Please reload the page.",
  emptyTitle: "Where are you looking for a pool?",
  emptyHint: "Tap “📍 Around me” or type an address above.",
  referenced: (n) => `${n} public pools listed.`,
  loadingPools: "Loading pools…",
  noneInRadius: "No pool within this radius — try a larger one.",
  noneInRadiusNear: (km) => `No pool within this radius — the nearest one is ${km} away.`,
  noneFavorite: "No favourite pool within this radius — tap ☆ on a pool to add it.",
  noneFilters: "No pool matches these filters within this radius.",
  countLine: (n, radiusKm, label) =>
    `${n} pool${n > 1 ? "s" : ""} within ${radiusKm} km of ${label} (straight line).`,
  showMore: (n) => `Show more (${n} left)`,
  mapAria: "Pool map",
  mapOpenCount: (n) => `${n} pool${n > 1 ? "s" : ""} open right now.`,
  mapHint: "Tap a marker to open its page. ★ = starred pool, bright colour = open right now.",
  mapPopupDetail: "Details",

  distanceTitle: "Straight-line distance",
  favAdd: (name) => `Add ${name} to favourites`,
  favRemove: (name) => `Remove ${name} from favourites`,
  envLabels: { int: "Indoor", ext: "Outdoor", mix: "Indoor + outdoor" },
  basinLabels: {
    sportif: "lap pool",
    ludique: "leisure pool",
    mixte: "mixed pool",
    toboggan: "splash pool",
    plongeon: "diving pit",
    plongée: "scuba pit",
    principal: "main pool",
    apprentissage: "learner pool",
    lido: "lido",
    pataugeoire: "paddling pool",
    vagues: "wave pool",
    spa: "hot tub",
    kneipp: "Kneipp basin",
    naturel: "natural pool",
  },
  basinFallback: (label) => `${label} pool`,

  seasonalClosed: "Seasonally closed at the moment",
  badgeOpenNow: "Open now",
  badgeOpenUntil: (time) => `Open · until ${time}`,
  badgeOpensAt: (time) => `Opens at ${time}`,
  badgeDone: "Done for today",
  badgeClosedNow: "Closed now",
  badgeClosedToday: "Closed today",
  todayLabel: "Today:",
  liveSource: "Live daily status — piscines-toulouse.fr",
  schoolTerm: "School term",
  schoolHolidays: "School holidays",
  specialPeriods: "Special periods",
  hoursLabel: "Opening hours:",
  centreHoursNote:
    "Centre opening hours (source: official website) — pool session times may differ.",
  noHours: "Opening hours unknown — check the official website.",
  priceLabel: "Price:",
  paidEntry: "Paid entry",
  freeEntry: "Free entry",
  directions: "Directions",
  directionsAria: (name) => `Directions to ${name} (Google Maps)`,
  directionsTitle: "Directions — opens Google Maps",
  phoneAria: (name, phone) => `Call ${name} on ${phone}`,
  phoneTitle: (phone) => `Call reception — ${phone}`,
  website: "Website",
  websiteAria: (name) => `Official website of ${name} (new tab)`,
  websiteTitle: "Official website — opens a new tab",
  searchWebsite: "Search the website",
  searchWebsiteTitle: "Website unknown — search the web",
  detailLink: "Details",
  detailLinkTitle: "Detail page — weekly hours and practical info",

  detailMetaTitle: (name, city) => `${name} in ${city} — hours, pools and access`,
  detailMetaDescription: (name, city) =>
    `${name} swimming pool in ${city}: opening hours where known, pools and lengths, price, address, directions and official website.`,
  detailSubtitle: (city) => `Public swimming pool in ${city} — hours, pools and access.`,
  detailHoursTitle: "Weekly hours",
  detailHoursNote:
    "Hours come from open sources (OpenStreetMap, official website) — check before travelling.",
  detailHoursUnknown:
    "Opening hours are not in our sources: check the official website or call reception.",
  detailRawHours: "Published hours (not interpreted)",
  detailInfoTitle: "Practical info",
  detailAddress: "Address",
  detailBasins: "Pools",
  detailLengths: "Lengths",
  detailNearbyTitle: "Other pools nearby",
  detailNearbyAway: (km) => `${km} away`,
  detailBack: "← All pools around me",

  fbTitle: "💬 Report an error or share feedback",
  fbIntro:
    "Wrong hours, a closed or missing pool, an idea? Tell us — it helps fix the app and its open sources.",
  fbKinds: {
    hours: "Wrong hours",
    info: "Wrong info",
    missing: "Missing or closed pool",
    suggestion: "Suggestion",
    other: "Other",
  },
  fbPool: "Pool concerned (optional)",
  fbPoolPlaceholder: "Name and town",
  fbMessage: "Your message",
  fbMessagePlaceholder: "E.g. the pool closes at 7 pm on Saturdays, not 8 pm.",
  fbEmail: "Your e-mail",
  fbEmailHint: "(optional, for a reply)",
  fbSend: "Send",
  fbSending: "Sending…",
  fbOrEmail: "or by e-mail",
  fbSent: "✓ Thanks, your message has arrived.",
  fbSentHint:
    "Opening hours can also be fixed directly in OpenStreetMap — then everyone benefits.",
  fbAnother: "Send another message",
  fbErrorDefault: "Sending is not possible right now.",
  fbErrorMail: "You can also send the message by e-mail.",
  fbSubject: "Swimmaps — feedback",

  footerData: "Data:",
  footerLicenceFR: "(open licence)",
  footerLicenceGB: "(OGL v3 licence)",
  footerLicenceDE:
    "(© Bundesinstitut für Sportwissenschaft · coordinates © GeoBasis-DE / BKG 2021)",
  footerOsm: "© OpenStreetMap contributors",
  footerDisclaimer:
    "Opening hours and prices come from open sources and are only available for part of " +
    "the pools — check the official website before travelling.",
  footerIndependent:
    "Personal, independent app, not affiliated with pool operators or any public authority.",

  coveredLabel: "Countries covered:",
  countryNames: { fr: "France", gb: "England", de: "Germany" },

  sources: {
    title: "Data sources",
    subtitle: "Where the pools, hours and prices come from",
    intro:
      "Swimmaps is a personal, independent app, not affiliated with pool operators or any public authority. It invents no data: everything shown comes from the open sources below, and missing information is shown as missing rather than guessed. Always check critical information on the pool's official website.",
    groups: [
      {
        title: "France",
        items: [
          {
            label: "Data ES — national sports facilities census",
            detail:
              "Ministry of Sports, open licence: name, address, coordinates, pools and lengths. Restricted facilities (schools, military, hotels…) are dropped.",
            url: URLS.dataEs,
          },
          {
            label: "OpenStreetMap",
            detail:
              "ODbL: opening hours (opening_hours), price, website and phone, matched by geographic proximity (< 300 m).",
            url: URLS.osm,
          },
          {
            label: "Piscines de Toulouse — live daily status",
            detail:
              "The sister app reads the official pages of Toulouse and its suburbs; its status overrides OSM hours for those pools.",
            url: URLS.toulouse,
          },
        ],
      },
      {
        title: "England",
        items: [
          {
            label: "Active Places (Sport England)",
            detail:
              "OGL v3 licence: pools open to the public (“Pay and Play” and community clubs), lengths and websites. Same OpenStreetMap enrichment as France.",
            url: URLS.activePlaces,
          },
        ],
      },
      {
        title: "Germany",
        items: [
          {
            label: "Bäderleben (Bundesinstitut für Sportwissenschaft)",
            detail:
              "Public pools with entry prices, lengths, websites and phones. © BISp; coordinates © GeoBasis-DE / BKG 2021.",
            url: URLS.baederleben,
          },
        ],
      },
      {
        title: "Other services used",
        items: [
          {
            label: "Official pool websites",
            detail:
              "Centre opening hours read from their schema.org structured data when OpenStreetMap has none (marked as such on the page).",
            url: URLS.schema,
          },
          {
            label: "Base Adresse Nationale",
            detail: "Address search in France (api-adresse.data.gouv.fr).",
            url: URLS.ban,
          },
          {
            label: "Photon (komoot)",
            detail: "Address search outside France, on OpenStreetMap data.",
            url: URLS.photon,
          },
          {
            label: "OpenStreetMap base map",
            detail: "Tiles served by the OpenStreetMap Foundation.",
            url: URLS.tiles,
          },
        ],
      },
    ],
    howTitle: "How the data is collected",
    how: [
      "A script rebuilds the datasets country by country and ships them with the app; the date of the last extraction is shown at the top of the home page. Nothing is completed by hand.",
      "Coverage reflects the state of open data: in France, hours are known for about one pool in ten and prices for one in fifty. The interface then shows “unknown” and a link to the official website.",
      "Errors are fixed at the source — in OpenStreetMap for hours, prices and websites — or through the app's feedback form.",
    ],
  },
  privacy: {
    title: "Privacy policy",
    subtitle: "The “Swimmaps” app",
    updated: (date) => `Last updated: ${date}`,
    intro:
      "Swimmaps is a personal, volunteer-run app, not affiliated with pool operators or any public authority. It shows public swimming pools from open data. This page explains which data it processes — in short: nothing that identifies you, except what you choose to write to us.",
    sections: [
      {
        title: "Personal data collected",
        paragraphs: [
          "None, by default. The app requires no account and collects no data about you. It only accesses your location if you tap “Around me”, and that location stays in your browser: it is used to compute distances and is never sent to our server.",
          "When you type an address, the text is sent to address-search services (Base Adresse Nationale for France, Photon/komoot elsewhere) to be turned into coordinates. Nothing else is transmitted to them.",
        ],
      },
      {
        title: "Local storage on your device",
        paragraphs: [
          "Your favourites (★), saved addresses, last search, chosen theme and collapsed blocks are kept in your browser's local storage, on your device only. They are never transmitted and disappear if you clear the site's data.",
        ],
      },
      {
        title: "Tracking, advertising and cookies",
        paragraphs: [
          "The app contains no advertising and sets no cookies.",
          "It uses Vercel's audience measurement, provided by its host, which counts visits and pages viewed. This measurement is aggregated and cookie-free: it builds no profile, does not follow you across sites and cannot identify you.",
        ],
      },
      {
        title: "Third-party services shown in the page",
        paragraphs: [
          "The base map is served by the OpenStreetMap Foundation: as with any image loaded from another site, your IP address is visible to it. The daily status of Toulouse pools is read from the sister app Piscines de Toulouse, without any data about you.",
        ],
      },
      {
        title: "Feedback form (optional)",
        paragraphs: [
          "The form only transmits what you type: the kind of report, the pool concerned, your message and — if you wish — your e-mail address. It is e-mailed to the app's author (through the provider Resend), solely to fix the app and, where relevant, reply to you. No mailing list, no sharing, no resale; write to us to have a sent message deleted.",
        ],
      },
      {
        title: "Technical hosting data",
        paragraphs: [
          "The site is hosted by Vercel. Like any web server, the host may log standard technical data (IP address, browser type) solely to serve the page and keep the service secure. These logs are neither consulted nor used by the author.",
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          "If you have not sent any feedback, no data about you exists. Otherwise you may at any time ask to access, correct or delete what concerns you at the address below.",
        ],
      },
    ],
    contactTitle: "Contact",
    changesTitle: "Changes",
    changes: "This policy may be updated. The date of the last update is shown at the top of the page.",
  },
};

const de: Dict = {
  intlLocale: "de-DE",
  metaTitle: "Swimmaps — finde ein Schwimmbad in deiner Nähe",
  metaDescription:
    "Alle öffentlichen Schwimmbäder um dich herum, in Deutschland, Frankreich und England: " +
    "Umkreis wählen, Becken, Öffnungszeiten und Preise sehen — mit Karte und Wegbeschreibung.",
  subtitle:
    "Finde die öffentlichen Schwimmbäder um dich herum: Becken, Öffnungszeiten und Preise, soweit bekannt.",

  langAria: "Langue / Language / Sprache",
  navSources: "Quellen",
  navPrivacy: "Datenschutz",
  navFeedback: "Fehler melden",
  backHome: "Alle Schwimmbäder",
  dataDate: (date) => `Datenstand ${date}`,
  dataInfoAria: "Wie die Daten aktualisiert werden",
  dataInfo:
    "Die Datensätze (Data ES, Active Places, Bäderleben, OpenStreetMap) werden per Skript neu erstellt und mit der App ausgeliefert: das Datum ist der letzte Abruf. Die Bäder in Toulouse erhalten zusätzlich ihren tagesaktuellen Status.",
  themeNames: { system: "automatisch", light: "hell", dark: "dunkel" },
  themeSwitch: (current, next) => `Design: ${current} — zu ${next} wechseln`,

  iosInstallLead: "App installieren: tippe auf",
  iosInstallTail: "und dann „Zum Home-Bildschirm“.",
  iosHow: "Wie geht das?",
  iosHideSteps: "Schritte ausblenden",
  iosDismiss: "Hinweis ausblenden",
  iosShare: "Teilen",
  iosStep1: "— in Safari unten auf dem iPhone, oben rechts auf dem iPad.",
  iosStep2a: "Scrolle die Liste der Aktionen nach unten bis zu",
  iosStep2b: "„Zum Home-Bildschirm“.",
  iosCopy: "Kopieren",
  iosBookmark: "Lesezeichen",
  iosAddHome: "Zum Home-Bildschirm",
  iosCancel: "Abbrechen",
  iosAdd: "Hinzufügen",
  iosStep3a: "Tippe auf",
  iosStep3b: "Das Symbol erscheint auf dem Home-Bildschirm: öffne die App von dort.",

  offlineBanner:
    "Du bist offline. Die angezeigten Bäder stammen vom letzten Laden — Karte und Adresssuche kommen mit dem Netz zurück.",
  offlineReload: "Aktualisieren",

  searchPlaceholder: "Adresse, Ort, Postleitzahl…",
  searchAria: "Adresse suchen",
  locateButton: "📍 In meiner Nähe",
  locating: "Ortung…",
  errNoGeolocation: "Standortbestimmung ist auf diesem Gerät nicht verfügbar.",
  errGeoDenied: "Standort abgelehnt oder nicht verfügbar — suche stattdessen eine Adresse.",
  errSearchDown: "Adresssuche ist derzeit nicht verfügbar.",

  savedAddressesAria: "Gespeicherte Adressen",
  saveAddress: "☆ Speichern",
  removeAddress: (label) => `Adresse ${label} entfernen`,

  poolSearchPlaceholder: "Schwimmbad oder Ort im Umkreis suchen…",
  poolSearchAria: "Schwimmbad oder Ort suchen",
  poolSearchClear: "Suche löschen",
  searchCount: (n, total) =>
    `${n === 0 ? "Kein Schwimmbad trägt diesen Namen" : `${n} Schwimmb${n > 1 ? "äder" : "ad"} gefunden`} unter den ${total} im Umkreis, unabhängig von den Filtern.`,
  searchNone: (query) => `Kein Schwimmbad passt zu „${query}“.`,

  radiusLabel: "Umkreis",
  radiusAria: "Suchumkreis",
  typeLabel: "Typ",
  typeAria: "Schwimmbadtyp",
  typeAll: "Alle",
  typeIndoor: "Hallenbad",
  typeOutdoor: "Freibad",
  openLabel: "Geöffnet",
  openAria: "Öffnung",
  openTitle:
    "„Diese Woche“: blendet bekannte Saisonschließungen aus. „Heute“: behält Bäder mit unbekannten Zeiten. „Jetzt“: nur Bäder mit bekannten, aktuell geöffneten Zeiten.",
  openAll: "Alle",
  openWeek: "Diese Woche",
  openWeekShort: "Woche",
  openNow: "Jetzt",
  openNowShort: "Jetzt",
  openToday: "Heute",
  openTodayShort: "Heute",
  favLabel: "Gemerkt",
  favAria: "Favoriten",
  favAll: "Alle",
  favOnly: "★ Favoriten",
  favTip:
    "💡 Tippe auf ☆ neben dem Namen eines Bades, um es zu merken: es rückt an den Anfang der Liste, und der Filter ★ Favoriten findet es wieder.",
  favTipOk: "Verstanden",
  lenLabel: "Becken",
  lenAria: "Beckenlänge",
  lenAll: "Alle",

  sectionTimeline: "Öffnungszeiten pro Tag",
  sectionMap: "Wo die Bäder sind",
  sectionList: (n) => `Die Schwimmbäder (${n})`,

  dayShort: ["Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa.", "So."],
  todaySuffix: "(heute)",
  legendOpenNow: "jetzt geöffnet",
  legendSlot: "Öffnungszeit",
  legendNow: "jetzt",
  timelineUnknown: (n) =>
    `${n} Schwimmb${n > 1 ? "äder" : "ad"} im Umkreis ohne bekannte Zeiten ${n > 1 ? "fehlen" : "fehlt"} hier.`,
  timelineMore: (n) => `${n} weitere weiter entfernt — verkleinere den Umkreis, um sie zu sehen.`,
  timelineSeasonal: "Saisonschließung",
  timelineClosed: "geschlossen",
  timelineHolidayNote:
    "Normale Woche während der Schulzeit; die Ferienzeiten stehen auf der Detailseite jedes Bades.",
  timelineGoto: (name) => `Zu ${name} springen`,

  loadError: "Die Schwimmbadliste konnte nicht geladen werden. Bitte Seite neu laden.",
  emptyTitle: "Wo suchst du ein Schwimmbad?",
  emptyHint: "Tippe auf „📍 In meiner Nähe“ oder gib oben eine Adresse ein.",
  referenced: (n) => `${n} öffentliche Schwimmbäder erfasst.`,
  loadingPools: "Schwimmbäder werden geladen…",
  noneInRadius: "Kein Schwimmbad in diesem Umkreis — versuche einen größeren.",
  noneInRadiusNear: (km) => `Kein Schwimmbad in diesem Umkreis — das nächste ist ${km} entfernt.`,
  noneFavorite:
    "Kein Favorit in diesem Umkreis — tippe auf ☆ bei einem Schwimmbad, um es hinzuzufügen.",
  noneFilters: "Kein Schwimmbad in diesem Umkreis passt zu diesen Filtern.",
  countLine: (n, radiusKm, label) =>
    `${n} Schwimmb${n > 1 ? "äder" : "ad"} im Umkreis von ${radiusKm} km (Luftlinie) um ${label}.`,
  showMore: (n) => `Mehr anzeigen (${n} weitere)`,
  mapAria: "Schwimmbad-Karte",
  mapOpenCount: (n) => `${n} Schwimmb${n > 1 ? "äder" : "ad"} jetzt geöffnet.`,
  mapHint: "Tippe auf eine Markierung, um die Detailseite zu öffnen. ★ = gemerkt, kräftige Farbe = jetzt geöffnet.",
  mapPopupDetail: "Details",

  distanceTitle: "Entfernung Luftlinie",
  favAdd: (name) => `${name} zu Favoriten hinzufügen`,
  favRemove: (name) => `${name} aus Favoriten entfernen`,
  envLabels: { int: "Hallenbad", ext: "Freibad", mix: "Kombibad" },
  basinLabels: {
    sportif: "Schwimmerbecken",
    ludique: "Nichtschwimmerbecken",
    mixte: "Variobecken",
    toboggan: "Rutschenbecken",
    plongeon: "Sprungbecken",
    plongée: "Tauchbecken",
    principal: "Hauptbecken",
    apprentissage: "Kursbecken",
    lido: "Freibecken",
    pataugeoire: "Kleinkinderbecken",
    vagues: "Wellenbecken",
    spa: "Warmsprudelbecken",
    kneipp: "Kneippbecken",
    naturel: "Naturbecken",
  },
  basinFallback: (label) => `${label}-Becken`,

  seasonalClosed: "Derzeit saisonbedingt geschlossen",
  badgeOpenNow: "Jetzt geöffnet",
  badgeOpenUntil: (time) => `Geöffnet · bis ${time}`,
  badgeOpensAt: (time) => `Öffnet um ${time}`,
  badgeDone: "Für heute geschlossen",
  badgeClosedNow: "Jetzt geschlossen",
  badgeClosedToday: "Heute geschlossen",
  todayLabel: "Heute:",
  liveSource: "Tagesaktueller Status — piscines-toulouse.fr",
  schoolTerm: "Schulzeit",
  schoolHolidays: "Schulferien",
  specialPeriods: "Besondere Zeiträume",
  hoursLabel: "Öffnungszeiten:",
  centreHoursNote:
    "Öffnungszeiten des Zentrums (Quelle: offizielle Website) — Beckenzeiten können abweichen.",
  noHours: "Öffnungszeiten unbekannt — bitte auf der offiziellen Website prüfen.",
  priceLabel: "Eintritt:",
  paidEntry: "Kostenpflichtig",
  freeEntry: "Eintritt frei",
  directions: "Route",
  directionsAria: (name) => `Route zu ${name} (Google Maps)`,
  directionsTitle: "Route — öffnet Google Maps",
  phoneAria: (name, phone) => `${name} anrufen: ${phone}`,
  phoneTitle: (phone) => `Kasse anrufen — ${phone}`,
  website: "Website",
  websiteAria: (name) => `Offizielle Website von ${name} (neuer Tab)`,
  websiteTitle: "Offizielle Website — öffnet einen neuen Tab",
  searchWebsite: "Website suchen",
  searchWebsiteTitle: "Website unbekannt — im Web suchen",
  detailLink: "Details",
  detailLinkTitle: "Detailseite — Wochenzeiten und praktische Infos",

  detailMetaTitle: (name, city) => `${name} in ${city} — Öffnungszeiten, Becken und Anfahrt`,
  detailMetaDescription: (name, city) =>
    `Schwimmbad ${name} in ${city}: Öffnungszeiten, soweit bekannt, Becken und Längen, Eintritt, Adresse, Route und offizielle Website.`,
  detailSubtitle: (city) => `Öffentliches Schwimmbad in ${city} — Öffnungszeiten, Becken und Anfahrt.`,
  detailHoursTitle: "Öffnungszeiten der Woche",
  detailHoursNote:
    "Zeiten aus offenen Quellen (OpenStreetMap, offizielle Website) — vor dem Besuch bitte prüfen.",
  detailHoursUnknown:
    "Öffnungszeiten fehlen in unseren Quellen: bitte offizielle Website prüfen oder anrufen.",
  detailRawHours: "Veröffentlichte Zeiten (nicht interpretiert)",
  detailInfoTitle: "Praktische Infos",
  detailAddress: "Adresse",
  detailBasins: "Becken",
  detailLengths: "Längen",
  detailNearbyTitle: "Weitere Schwimmbäder in der Nähe",
  detailNearbyAway: (km) => `${km} entfernt`,
  detailBack: "← Alle Schwimmbäder in meiner Nähe",

  fbTitle: "💬 Fehler melden oder Feedback geben",
  fbIntro:
    "Falsche Zeiten, ein geschlossenes oder fehlendes Bad, eine Idee? Sag es uns — das hilft, die App und ihre offenen Quellen zu verbessern.",
  fbKinds: {
    hours: "Falsche Öffnungszeiten",
    info: "Falsche Angabe",
    missing: "Fehlendes oder geschlossenes Bad",
    suggestion: "Vorschlag",
    other: "Sonstiges",
  },
  fbPool: "Betroffenes Schwimmbad (optional)",
  fbPoolPlaceholder: "Name und Ort",
  fbMessage: "Deine Nachricht",
  fbMessagePlaceholder: "Z. B.: Das Bad schließt samstags um 19 Uhr, nicht um 20 Uhr.",
  fbEmail: "Deine E-Mail",
  fbEmailHint: "(optional, für eine Antwort)",
  fbSend: "Senden",
  fbSending: "Wird gesendet…",
  fbOrEmail: "oder per E-Mail",
  fbSent: "✓ Danke, deine Nachricht ist angekommen.",
  fbSentHint:
    "Öffnungszeiten lassen sich auch direkt in OpenStreetMap korrigieren — davon profitieren dann alle.",
  fbAnother: "Weitere Nachricht senden",
  fbErrorDefault: "Senden ist derzeit nicht möglich.",
  fbErrorMail: "Du kannst die Nachricht auch per E-Mail senden.",
  fbSubject: "Swimmaps — Meldung",

  footerData: "Daten:",
  footerLicenceFR: "(offene Lizenz)",
  footerLicenceGB: "(OGL-v3-Lizenz)",
  footerLicenceDE:
    "(© Bundesinstitut für Sportwissenschaft · Koordinaten © GeoBasis-DE / BKG 2021)",
  footerOsm: "© OpenStreetMap-Mitwirkende",
  footerDisclaimer:
    "Öffnungszeiten und Preise stammen aus offenen Quellen und liegen nur für einen Teil " +
    "der Bäder vor — vor dem Besuch bitte auf der offiziellen Website prüfen.",
  footerIndependent:
    "Private, unabhängige App, ohne Verbindung zu den Betreibern der Bäder oder zu Behörden.",

  coveredLabel: "Abgedeckte Länder:",
  countryNames: { fr: "Frankreich", gb: "England", de: "Deutschland" },

  sources: {
    title: "Datenquellen",
    subtitle: "Woher Bäder, Öffnungszeiten und Preise stammen",
    intro:
      "Swimmaps ist eine private, unabhängige App ohne Verbindung zu den Betreibern der Bäder oder zu Behörden. Sie erfindet keine Daten: alles Angezeigte stammt aus den offenen Quellen unten, und fehlende Angaben werden als fehlend gezeigt statt geraten. Prüfe wichtige Angaben immer auf der offiziellen Website des Bades.",
    groups: [
      {
        title: "Frankreich",
        items: [
          {
            label: "Data ES — nationale Erhebung der Sportanlagen",
            detail:
              "Sportministerium, offene Lizenz: Name, Adresse, Koordinaten, Becken und Längen. Nicht öffentliche Anlagen (Schulen, Militär, Hotels…) werden ausgeschlossen.",
            url: URLS.dataEs,
          },
          {
            label: "OpenStreetMap",
            detail:
              "ODbL: Öffnungszeiten (opening_hours), Eintritt, Website und Telefon, räumlich zugeordnet (< 300 m).",
            url: URLS.osm,
          },
          {
            label: "Piscines de Toulouse — tagesaktueller Status",
            detail:
              "Die Schwester-App liest die offiziellen Seiten von Toulouse und Umgebung; ihr Status hat für diese Bäder Vorrang vor den OSM-Zeiten.",
            url: URLS.toulouse,
          },
        ],
      },
      {
        title: "England",
        items: [
          {
            label: "Active Places (Sport England)",
            detail:
              "OGL-v3-Lizenz: öffentlich zugängliche Bäder („Pay and Play“ und Vereinsbäder), Längen und Websites. Gleiche OpenStreetMap-Anreicherung wie in Frankreich.",
            url: URLS.activePlaces,
          },
        ],
      },
      {
        title: "Deutschland",
        items: [
          {
            label: "Bäderleben (Bundesinstitut für Sportwissenschaft)",
            detail:
              "Öffentliche Bäder mit Eintrittspreisen, Längen, Websites und Telefonnummern. © BISp; Koordinaten © GeoBasis-DE / BKG 2021.",
            url: URLS.baederleben,
          },
        ],
      },
      {
        title: "Weitere genutzte Dienste",
        items: [
          {
            label: "Offizielle Websites der Bäder",
            detail:
              "Öffnungszeiten des Zentrums aus deren schema.org-Daten, wenn OpenStreetMap keine hat (auf der Detailseite entsprechend markiert).",
            url: URLS.schema,
          },
          {
            label: "Base Adresse Nationale",
            detail: "Adresssuche in Frankreich (api-adresse.data.gouv.fr).",
            url: URLS.ban,
          },
          {
            label: "Photon (komoot)",
            detail: "Adresssuche außerhalb Frankreichs, auf OpenStreetMap-Daten.",
            url: URLS.photon,
          },
          {
            label: "OpenStreetMap-Kartenhintergrund",
            detail: "Kacheln der OpenStreetMap Foundation.",
            url: URLS.tiles,
          },
        ],
      },
    ],
    howTitle: "Wie die Daten erhoben werden",
    how: [
      "Ein Skript erstellt die Datensätze Land für Land neu und liefert sie mit der App aus; das Datum des letzten Abrufs steht oben auf der Startseite. Nichts wird von Hand ergänzt.",
      "Die Abdeckung spiegelt den Stand der offenen Daten: in Frankreich sind Öffnungszeiten nur für etwa jedes zehnte Bad bekannt, Preise für jedes fünfzigste. Die App zeigt dann „unbekannt“ und einen Link zur offiziellen Website.",
      "Fehler werden an der Quelle behoben — in OpenStreetMap für Zeiten, Preise und Websites — oder über das Meldeformular der App.",
    ],
  },
  privacy: {
    title: "Datenschutzerklärung",
    subtitle: "App „Swimmaps“",
    updated: (date) => `Zuletzt aktualisiert: ${date}`,
    intro:
      "Swimmaps ist eine private, ehrenamtliche App ohne Verbindung zu den Betreibern der Bäder oder zu Behörden. Sie zeigt öffentliche Schwimmbäder aus offenen Daten. Diese Seite erklärt, welche Daten sie verarbeitet — kurz: nichts, was dich identifiziert, außer dem, was du uns selbst schreibst.",
    sections: [
      {
        title: "Erhobene personenbezogene Daten",
        paragraphs: [
          "Standardmäßig keine. Die App verlangt kein Konto und sammelt keine Daten über dich. Auf deinen Standort greift sie nur zu, wenn du auf „In meiner Nähe“ tippst, und dieser bleibt in deinem Browser: er dient der Entfernungsberechnung und wird nie an unseren Server gesendet.",
          "Wenn du eine Adresse eingibst, wird der getippte Text an die Adressdienste (Base Adresse Nationale für Frankreich, Photon/komoot sonst) gesendet, um Koordinaten zu ermitteln. Mehr wird ihnen nicht übermittelt.",
        ],
      },
      {
        title: "Lokale Speicherung auf deinem Gerät",
        paragraphs: [
          "Deine Favoriten (★), gespeicherte Adressen, die letzte Suche, das gewählte Design und der Zustand der eingeklappten Blöcke liegen im lokalen Speicher deines Browsers, nur auf deinem Gerät. Sie werden nie übertragen und verschwinden, wenn du die Website-Daten löschst.",
        ],
      },
      {
        title: "Tracking, Werbung und Cookies",
        paragraphs: [
          "Die App enthält keine Werbung und setzt keine Cookies.",
          "Sie nutzt die Reichweitenmessung von Vercel, ihrem Hoster, die Besuche und aufgerufene Seiten zählt. Diese Messung ist aggregiert und cookiefrei: sie erstellt kein Profil, verfolgt dich nicht über Websites hinweg und kann dich nicht identifizieren.",
        ],
      },
      {
        title: "Drittdienste auf der Seite",
        paragraphs: [
          "Der Kartenhintergrund kommt von der OpenStreetMap Foundation: wie bei jedem von einer anderen Website geladenen Bild ist deine IP-Adresse für sie sichtbar. Der Tagesstatus der Bäder in Toulouse wird von der Schwester-App Piscines de Toulouse gelesen, ohne Daten über dich.",
        ],
      },
      {
        title: "Meldeformular (optional)",
        paragraphs: [
          "Das Formular übermittelt nur, was du eingibst: die Art der Meldung, das betroffene Bad, deine Nachricht und — wenn du möchtest — deine E-Mail-Adresse. Es wird per E-Mail (über den Dienst Resend) an die Autorin der App gesendet, allein um die App zu korrigieren und dir gegebenenfalls zu antworten. Kein Verteiler, keine Weitergabe, kein Verkauf; schreib uns, um eine gesendete Nachricht löschen zu lassen.",
        ],
      },
      {
        title: "Technische Hosting-Daten",
        paragraphs: [
          "Die Website wird von Vercel gehostet. Wie jeder Webserver kann der Hoster technische Standarddaten (IP-Adresse, Browsertyp) protokollieren, allein um die Seite auszuliefern und den Dienst abzusichern. Diese Protokolle werden von der Autorin weder eingesehen noch genutzt.",
        ],
      },
      {
        title: "Deine Rechte",
        paragraphs: [
          "Wenn du keine Meldung gesendet hast, existieren keine Daten über dich. Andernfalls kannst du jederzeit unter der Adresse unten Auskunft, Berichtigung oder Löschung verlangen.",
        ],
      },
    ],
    contactTitle: "Kontakt",
    changesTitle: "Änderungen",
    changes: "Diese Erklärung kann aktualisiert werden. Das Datum der letzten Aktualisierung steht oben auf der Seite.",
  },
};

const DICTS: Record<Locale, Dict> = { fr, en, de };

export function getDict(locale: Locale): Dict {
  return DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

/** « 3 juillet 2026 » / « 3 July 2026 » / « 3. Juli 2026 ». */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(getDict(locale).intlLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
