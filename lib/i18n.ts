/**
 * Internationalisation de Swimmaps : français, anglais, allemand — une langue
 * par pays couvert. Dictionnaires plats, quelques entrées fonctions pour les
 * chaînes paramétrées.
 */

export type Locale = "fr" | "en" | "de" | "es" | "it" | "nl";
export const LOCALES: Locale[] = ["fr", "en", "de", "es", "it", "nl"];
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
  liveSource: (at: string) => string;
  toulouseRecommend: string;
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

  tipTitle: string;
  tipDesc: string;
  tipButton: string;
  tipNote: string;

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
    "Les piscines publiques autour de vous en France, Allemagne, Angleterre, Espagne, Italie, Belgique et aux Pays-Bas : " +
    "bassins, horaires et tarifs, avec carte et itinéraires.",
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
  liveSource: (at) => `Statut du jour relevé ${at} — piscines-toulouse.fr`,
  toulouseRecommend: "Semaine détaillée, fermetures et tarifs sur Piscines de Toulouse",
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
    `${/piscine|aquatique|nautique|bassin|baignade/i.test(name) ? name : `Piscine ${name}`} à ${city} : horaires si connus, bassins, tarif, adresse et itinéraire.`,
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

  tipTitle: "Offrir un café",
  tipDesc:
    "Swimmaps est une application personnelle et indépendante. Si elle vous évite un trajet pour rien, vous pouvez m'offrir un café.",
  tipButton: "Offrir un café",
  tipNote: "Avec ou sans café, elle reste gratuite et la même pour tout le monde.",

  coveredLabel: "Pays couverts :",
  countryNames: {
    fr: "France", gb: "Angleterre", de: "Allemagne",
    es: "Espagne", it: "Italie", be: "Belgique", nl: "Pays-Bas",
  },

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
        title: "Espagne, Italie, Belgique, Pays-Bas",
        items: [
          {
            label: "OpenStreetMap",
            detail:
              "ODbL, seule source : centres et parcs aquatiques nommés, hors hôtels et campings. Horaires et tarifs plus rares qu'ailleurs ; commune déduite de la localité la plus proche quand l'adresse manque.",
            url: URLS.osm,
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
    "Public swimming pools near you in France, Germany, England, Spain, Italy, Belgium and the Netherlands: " +
    "pools, opening hours and prices, with a map and directions.",
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
  liveSource: (at) => `Daily status checked ${at} — piscines-toulouse.fr`,
  toulouseRecommend: "Full week, closures and prices on Piscines de Toulouse",
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
    `${/pool|swim|baths|lido|aquatic|piscine/i.test(name) ? name : `${name} swimming pool`} in ${city}: opening hours where known, pools, price, address and directions.`,
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

  tipTitle: "Buy me a coffee",
  tipDesc:
    "Swimmaps is a personal, independent side project. If it saves you a wasted trip, you can buy me a coffee.",
  tipButton: "Buy me a coffee",
  tipNote: "With or without coffee, the app stays free and the same for everyone.",

  coveredLabel: "Countries covered:",
  countryNames: {
    fr: "France", gb: "England", de: "Germany",
    es: "Spain", it: "Italy", be: "Belgium", nl: "Netherlands",
  },

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
        title: "Spain, Italy, Belgium, Netherlands",
        items: [
          {
            label: "OpenStreetMap",
            detail:
              "ODbL, sole source: named pools and water parks, excluding hotels and campsites. Hours and prices are rarer than elsewhere; the town is the nearest locality when the address is missing.",
            url: URLS.osm,
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
    "Öffentliche Schwimmbäder in deiner Nähe in Deutschland, Frankreich, England, Spanien, Italien, Belgien und den Niederlanden: " +
    "Becken, Öffnungszeiten und Preise, mit Karte und Route.",
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
  liveSource: (at) => `Tagesstatus, abgerufen ${at} — piscines-toulouse.fr`,
  toulouseRecommend: "Ganze Woche, Schließungen und Preise auf Piscines de Toulouse",
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
    `${/bad|schwimm|therme/i.test(name) ? name : `Schwimmbad ${name}`} in ${city}: Öffnungszeiten soweit bekannt, Becken, Eintritt, Adresse und Route.`,
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

  tipTitle: "Spendier mir einen Kaffee",
  tipDesc:
    "Swimmaps ist ein privates, unabhängiges Hobbyprojekt. Wenn es dir einen umsonst gefahrenen Weg erspart, kannst du mir einen Kaffee spendieren.",
  tipButton: "Kaffee spendieren",
  tipNote: "Mit oder ohne Kaffee: Die App bleibt kostenlos und für alle gleich.",

  coveredLabel: "Abgedeckte Länder:",
  countryNames: {
    fr: "Frankreich", gb: "England", de: "Deutschland",
    es: "Spanien", it: "Italien", be: "Belgien", nl: "Niederlande",
  },

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
        title: "Spanien, Italien, Belgien, Niederlande",
        items: [
          {
            label: "OpenStreetMap",
            detail:
              "ODbL, einzige Quelle: benannte Bäder und Freizeitbäder, ohne Hotels und Campingplätze. Öffnungszeiten und Preise seltener als anderswo; der Ort ist die nächste Ortschaft, wenn die Adresse fehlt.",
            url: URLS.osm,
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

const it: Dict = {
  intlLocale: "it-IT",
  metaTitle: "Swimmaps — trova una piscina vicino a te",
  metaDescription:
    "Piscine pubbliche vicino a te in Francia, Germania, Inghilterra, Spagna, Italia, Belgio e Paesi Bassi: " +
    "vasche, orari e prezzi, con mappa e indicazioni stradali.",
  subtitle:
    "Trova le piscine pubbliche intorno a te: vasche, orari e prezzi quando noti.",

  langAria: "Lingua / Language / Taal",
  navSources: "Fonti",
  navPrivacy: "Privacy",
  navFeedback: "Segnala un errore",
  backHome: "Tutte le piscine",
  dataDate: (date) => `Dati aggiornati al ${date}`,
  dataInfoAria: "Come vengono aggiornati i dati",
  dataInfo:
    "I dataset (Data ES, Active Places, Bäderleben, OpenStreetMap) vengono ricostruiti da uno script e distribuiti con l'app: la data è quella dell'ultima estrazione. Le piscine di Tolosa ricevono in più il loro stato giornaliero in tempo reale.",
  themeNames: { system: "automatico", light: "chiaro", dark: "scuro" },
  themeSwitch: (current, next) => `Tema: ${current} — passa a ${next}`,

  iosInstallLead: "Installa l'app: tocca",
  iosInstallTail: "poi “Aggiungi alla schermata Home”.",
  iosHow: "Come?",
  iosHideSteps: "Nascondi i passaggi",
  iosDismiss: "Nascondi questo invito",
  iosShare: "Condividi",
  iosStep1: "— in Safari, in basso sullo schermo su iPhone, in alto a destra su iPad.",
  iosStep2a: "Scorri l'elenco delle azioni fino a",
  iosStep2b: "“Aggiungi alla schermata Home”.",
  iosCopy: "Copia",
  iosBookmark: "Aggiungi segnalibro",
  iosAddHome: "Aggiungi alla schermata Home",
  iosCancel: "Annulla",
  iosAdd: "Aggiungi",
  iosStep3a: "Tocca",
  iosStep3b: "L'icona compare nella schermata Home: apri l'app da lì.",

  offlineBanner:
    "Sei offline. Le piscine mostrate provengono dall'ultimo caricamento — la mappa e la ricerca di indirizzi torneranno con la rete.",
  offlineReload: "Ricarica",

  searchPlaceholder: "Indirizzo, città, CAP…",
  searchAria: "Cerca un indirizzo",
  locateButton: "📍 Intorno a me",
  locating: "Localizzazione…",
  errNoGeolocation: "La geolocalizzazione non è disponibile su questo dispositivo.",
  errGeoDenied: "Posizione negata o non disponibile — cerca invece un indirizzo.",
  errSearchDown: "La ricerca di indirizzi non è disponibile al momento.",

  savedAddressesAria: "Indirizzi salvati",
  saveAddress: "☆ Salva",
  removeAddress: (label) => `Rimuovi l'indirizzo ${label}`,

  poolSearchPlaceholder: "Cerca una piscina o una città nel raggio…",
  poolSearchAria: "Cerca una piscina o una città",
  poolSearchClear: "Cancella la ricerca",
  searchCount: (n, total) =>
    `${n === 0 ? "Nessuna piscina ha questo nome" : `${n} piscin${n > 1 ? "e" : "a"} trovat${n > 1 ? "e" : "a"}`} tra le ${total} nel raggio, filtri esclusi.`,
  searchNone: (query) => `Nessuna piscina corrisponde a “${query}”.`,

  radiusLabel: "Raggio",
  radiusAria: "Raggio di ricerca",
  typeLabel: "Tipo",
  typeAria: "Tipo di piscina",
  typeAll: "Tutte",
  typeIndoor: "Coperta",
  typeOutdoor: "Scoperta",
  openLabel: "Aperta",
  openAria: "Apertura",
  openTitle:
    "“Questa settimana”: esclude le chiusure stagionali note. “Oggi”: mantiene le piscine con orari sconosciuti. “Adesso”: solo le piscine con orari noti e aperte in questo momento.",
  openAll: "Tutte",
  openWeek: "Questa settimana",
  openWeekShort: "Settimana",
  openNow: "Adesso",
  openNowShort: "Adesso",
  openToday: "Oggi",
  openTodayShort: "Oggi",
  favLabel: "Preferite",
  favAria: "Preferiti",
  favAll: "Tutte",
  favOnly: "★ Preferiti",
  favTip:
    "💡 Tocca ☆ accanto al nome di una piscina per seguirla: sale in cima all'elenco e il filtro ★ Preferiti te la ritrova.",
  favTipOk: "Ok, capito",
  lenLabel: "Lunghezza",
  lenAria: "Lunghezza della vasca",
  lenAll: "Qualsiasi",

  sectionTimeline: "Orari per giorno",
  sectionMap: "Dove sono le piscine",
  sectionList: (n) => `Le piscine (${n})`,

  dayShort: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
  todaySuffix: "(oggi)",
  legendOpenNow: "aperta ora",
  legendSlot: "fascia di apertura",
  legendNow: "adesso",
  timelineUnknown: (n) =>
    `${n} piscin${n > 1 ? "e" : "a"} nel raggio con orari sconosciuti non ${n > 1 ? "sono mostrate" : "è mostrata"} qui.`,
  timelineMore: (n) => `Altre ${n} più lontane — riduci il raggio per vederle.`,
  timelineSeasonal: "chiusura stagionale",
  timelineClosed: "chiusa",
  timelineHolidayNote:
    "Settimana tipo durante il periodo scolastico; gli orari delle vacanze sono nella pagina di ogni piscina.",
  timelineGoto: (name) => `Vai a ${name}`,

  loadError: "Impossibile caricare l'elenco delle piscine. Ricarica la pagina.",
  emptyTitle: "Dove cerchi una piscina?",
  emptyHint: "Tocca “📍 Intorno a me” o scrivi un indirizzo qui sopra.",
  referenced: (n) => `${n} piscine pubbliche censite.`,
  loadingPools: "Caricamento delle piscine…",
  noneInRadius: "Nessuna piscina in questo raggio — provane uno più ampio.",
  noneInRadiusNear: (km) => `Nessuna piscina in questo raggio — la più vicina è a ${km}.`,
  noneFavorite: "Nessuna piscina preferita in questo raggio — tocca ☆ su una piscina per aggiungerla.",
  noneFilters: "Nessuna piscina corrisponde a questi filtri in questo raggio.",
  countLine: (n, radiusKm, label) =>
    `${n} piscin${n > 1 ? "e" : "a"} entro ${radiusKm} km da ${label} (in linea d'aria).`,
  showMore: (n) => `Mostra altre (ne restano ${n})`,
  mapAria: "Mappa delle piscine",
  mapOpenCount: (n) => `${n} piscin${n > 1 ? "e aperte" : "a aperta"} in questo momento.`,
  mapHint: "Tocca un segnaposto per aprirne la pagina. ★ = piscina preferita, colore acceso = aperta ora.",
  mapPopupDetail: "Dettagli",

  distanceTitle: "Distanza in linea d'aria",
  favAdd: (name) => `Aggiungi ${name} ai preferiti`,
  favRemove: (name) => `Rimuovi ${name} dai preferiti`,
  envLabels: { int: "Coperta", ext: "Scoperta", mix: "Coperta + scoperta" },
  basinLabels: {
    sportif: "vasca sportiva",
    ludique: "vasca ludica",
    mixte: "vasca mista",
    toboggan: "vasca con scivoli",
    plongeon: "vasca tuffi",
    plongée: "vasca per immersioni",
    principal: "vasca principale",
    apprentissage: "vasca didattica",
    lido: "vasca all'aperto",
    pataugeoire: "vasca per bambini",
    vagues: "piscina a onde",
    spa: "idromassaggio",
    kneipp: "vasca Kneipp",
    naturel: "piscina naturale",
  },
  basinFallback: (label) => `vasca ${label}`,

  seasonalClosed: "Chiusa per stagione al momento",
  badgeOpenNow: "Aperta ora",
  badgeOpenUntil: (time) => `Aperta · fino alle ${time}`,
  badgeOpensAt: (time) => `Apre alle ${time}`,
  badgeDone: "Chiusa per oggi",
  badgeClosedNow: "Chiusa ora",
  badgeClosedToday: "Chiusa oggi",
  todayLabel: "Oggi:",
  liveSource: (at) => `Stato del giorno verificato ${at} — piscines-toulouse.fr`,
  toulouseRecommend: "Settimana completa, chiusure e prezzi su Piscines de Toulouse",
  schoolTerm: "Periodo scolastico",
  schoolHolidays: "Vacanze scolastiche",
  specialPeriods: "Periodi speciali",
  hoursLabel: "Orari:",
  centreHoursNote:
    "Orari del centro (fonte: sito ufficiale) — gli orari della vasca possono essere diversi.",
  noHours: "Orari sconosciuti — controlla il sito ufficiale.",
  priceLabel: "Prezzo:",
  paidEntry: "Ingresso a pagamento",
  freeEntry: "Ingresso gratuito",
  directions: "Indicazioni",
  directionsAria: (name) => `Indicazioni per ${name} (Google Maps)`,
  directionsTitle: "Indicazioni — apre Google Maps",
  phoneAria: (name, phone) => `Chiama ${name} al ${phone}`,
  phoneTitle: (phone) => `Chiama la reception — ${phone}`,
  website: "Sito web",
  websiteAria: (name) => `Sito ufficiale di ${name} (nuova scheda)`,
  websiteTitle: "Sito ufficiale — si apre in una nuova scheda",
  searchWebsite: "Cerca il sito",
  searchWebsiteTitle: "Sito sconosciuto — cerca sul web",
  detailLink: "Dettagli",
  detailLinkTitle: "Pagina di dettaglio — orari settimanali e info pratiche",

  detailMetaTitle: (name, city) => `${name} a ${city} — orari, vasche e accesso`,
  detailMetaDescription: (name, city) =>
    `${/piscin|natator|nuoto|acqua|aqua|lido|bagni|pool|swim/i.test(name) ? name : `Piscina ${name}`} a ${city}: orari se noti, vasche, prezzo, indirizzo e indicazioni stradali.`,
  detailSubtitle: (city) => `Piscina pubblica a ${city} — orari, vasche e accesso.`,
  detailHoursTitle: "Orari settimanali",
  detailHoursNote:
    "Gli orari provengono da fonti aperte (OpenStreetMap, sito ufficiale) — verificali prima di partire.",
  detailHoursUnknown:
    "Gli orari non sono nelle nostre fonti: controlla il sito ufficiale o chiama la reception.",
  detailRawHours: "Orari pubblicati (non interpretati)",
  detailInfoTitle: "Info pratiche",
  detailAddress: "Indirizzo",
  detailBasins: "Vasche",
  detailLengths: "Lunghezze",
  detailNearbyTitle: "Altre piscine nei dintorni",
  detailNearbyAway: (km) => `a ${km}`,
  detailBack: "← Tutte le piscine intorno a me",

  fbTitle: "💬 Segnala un errore o lascia un commento",
  fbIntro:
    "Orari sbagliati, una piscina chiusa o mancante, un'idea? Scrivici — aiuta a correggere l'app e le sue fonti aperte.",
  fbKinds: {
    hours: "Orari sbagliati",
    info: "Info sbagliate",
    missing: "Piscina mancante o chiusa",
    suggestion: "Suggerimento",
    other: "Altro",
  },
  fbPool: "Piscina interessata (facoltativo)",
  fbPoolPlaceholder: "Nome e città",
  fbMessage: "Il tuo messaggio",
  fbMessagePlaceholder: "Es. il sabato la piscina chiude alle 19, non alle 20.",
  fbEmail: "La tua e-mail",
  fbEmailHint: "(facoltativa, per una risposta)",
  fbSend: "Invia",
  fbSending: "Invio in corso…",
  fbOrEmail: "o via e-mail",
  fbSent: "✓ Grazie, il tuo messaggio è arrivato.",
  fbSentHint:
    "Gli orari si possono correggere anche direttamente su OpenStreetMap — così ne beneficiano tutti.",
  fbAnother: "Invia un altro messaggio",
  fbErrorDefault: "L'invio non è possibile al momento.",
  fbErrorMail: "Puoi anche inviare il messaggio via e-mail.",
  fbSubject: "Swimmaps — segnalazione",

  footerData: "Dati:",
  footerLicenceFR: "(licenza aperta)",
  footerLicenceGB: "(licenza OGL v3)",
  footerLicenceDE:
    "(© Bundesinstitut für Sportwissenschaft · coordinate © GeoBasis-DE / BKG 2021)",
  footerOsm: "© contributori di OpenStreetMap",
  footerDisclaimer:
    "Orari e prezzi provengono da fonti aperte e sono disponibili solo per una parte " +
    "delle piscine — controlla il sito ufficiale prima di partire.",
  footerIndependent:
    "App personale e indipendente, non affiliata ai gestori delle piscine né ad alcun ente pubblico.",

  tipTitle: "Offrimi un caffè",
  tipDesc:
    "Swimmaps è un progetto personale e indipendente. Se ti ha evitato un viaggio a vuoto, puoi offrirmi un caffè.",
  tipButton: "Offrimi un caffè",
  tipNote: "Con o senza caffè, l'app resta gratuita e uguale per tutti.",

  coveredLabel: "Paesi coperti:",
  countryNames: {
    fr: "Francia", gb: "Inghilterra", de: "Germania",
    es: "Spagna", it: "Italia", be: "Belgio", nl: "Paesi Bassi",
  },

  sources: {
    title: "Fonti dei dati",
    subtitle: "Da dove vengono piscine, orari e prezzi",
    intro:
      "Swimmaps è un'app personale e indipendente, non affiliata ai gestori delle piscine né ad alcun ente pubblico. Non inventa alcun dato: tutto ciò che mostra proviene dalle fonti aperte qui sotto, e le informazioni mancanti sono indicate come tali anziché indovinate. Verifica sempre le informazioni importanti sul sito ufficiale della piscina.",
    groups: [
      {
        title: "Francia",
        items: [
          {
            label: "Data ES — censimento nazionale degli impianti sportivi",
            detail:
              "Ministero dello Sport, licenza aperta: nome, indirizzo, coordinate, vasche e lunghezze. Gli impianti ad accesso riservato (scuole, militari, hotel…) sono esclusi.",
            url: URLS.dataEs,
          },
          {
            label: "OpenStreetMap",
            detail:
              "ODbL: orari (opening_hours), prezzo, sito web e telefono, abbinati per vicinanza geografica (< 300 m).",
            url: URLS.osm,
          },
          {
            label: "Piscines de Toulouse — stato giornaliero in tempo reale",
            detail:
              "L'app gemella legge le pagine ufficiali di Tolosa e dintorni; il suo stato sostituisce gli orari OSM per queste piscine.",
            url: URLS.toulouse,
          },
        ],
      },
      {
        title: "Inghilterra",
        items: [
          {
            label: "Active Places (Sport England)",
            detail:
              "Licenza OGL v3: piscine aperte al pubblico (“Pay and Play” e club locali), lunghezze e siti web. Stesso arricchimento OpenStreetMap della Francia.",
            url: URLS.activePlaces,
          },
        ],
      },
      {
        title: "Germania",
        items: [
          {
            label: "Bäderleben (Bundesinstitut für Sportwissenschaft)",
            detail:
              "Piscine pubbliche con prezzi d'ingresso, lunghezze, siti web e telefoni. © BISp; coordinate © GeoBasis-DE / BKG 2021.",
            url: URLS.baederleben,
          },
        ],
      },
      {
        title: "Spagna, Italia, Belgio, Paesi Bassi",
        items: [
          {
            label: "OpenStreetMap",
            detail:
              "ODbL, unica fonte: piscine e acquapark con un nome, esclusi hotel e campeggi. Orari e prezzi sono più rari che altrove; la città è la località più vicina quando manca l'indirizzo.",
            url: URLS.osm,
          },
        ],
      },
      {
        title: "Altri servizi utilizzati",
        items: [
          {
            label: "Siti ufficiali delle piscine",
            detail:
              "Orari del centro letti dai loro dati strutturati schema.org quando OpenStreetMap non ne ha (indicati come tali nella pagina).",
            url: URLS.schema,
          },
          {
            label: "Base Adresse Nationale",
            detail: "Ricerca di indirizzi in Francia (api-adresse.data.gouv.fr).",
            url: URLS.ban,
          },
          {
            label: "Photon (komoot)",
            detail: "Ricerca di indirizzi fuori dalla Francia, su dati OpenStreetMap.",
            url: URLS.photon,
          },
          {
            label: "Mappa di base OpenStreetMap",
            detail: "Tessere fornite dalla OpenStreetMap Foundation.",
            url: URLS.tiles,
          },
        ],
      },
    ],
    howTitle: "Come vengono raccolti i dati",
    how: [
      "Uno script ricostruisce i dataset paese per paese e li distribuisce con l'app; la data dell'ultima estrazione è indicata in cima alla home page. Niente viene completato a mano.",
      "La copertura riflette lo stato dei dati aperti: in Francia gli orari sono noti per circa una piscina su dieci e i prezzi per una su cinquanta. L'interfaccia mostra allora “sconosciuto” e un link al sito ufficiale.",
      "Gli errori si correggono alla fonte — su OpenStreetMap per orari, prezzi e siti web — o tramite il modulo di segnalazione dell'app.",
    ],
  },
  privacy: {
    title: "Informativa sulla privacy",
    subtitle: "L'app “Swimmaps”",
    updated: (date) => `Ultimo aggiornamento: ${date}`,
    intro:
      "Swimmaps è un'app personale e volontaria, non affiliata ai gestori delle piscine né ad alcun ente pubblico. Mostra le piscine pubbliche a partire da dati aperti. Questa pagina spiega quali dati tratta — in breve: nulla che ti identifichi, tranne ciò che scegli di scriverci.",
    sections: [
      {
        title: "Dati personali raccolti",
        paragraphs: [
          "Nessuno, per impostazione predefinita. L'app non richiede alcun account e non raccoglie dati su di te. Accede alla tua posizione solo se tocchi “Intorno a me”, e questa posizione resta nel tuo browser: serve a calcolare le distanze e non viene mai inviata al nostro server.",
          "Quando scrivi un indirizzo, il testo viene inviato ai servizi di ricerca di indirizzi (Base Adresse Nationale per la Francia, Photon/komoot altrove) per essere convertito in coordinate. Nient'altro viene loro trasmesso.",
        ],
      },
      {
        title: "Archiviazione locale sul tuo dispositivo",
        paragraphs: [
          "I tuoi preferiti (★), gli indirizzi salvati, l'ultima ricerca, il tema scelto e i blocchi chiusi sono conservati nella memoria locale del tuo browser, solo sul tuo dispositivo. Non vengono mai trasmessi e scompaiono se cancelli i dati del sito.",
        ],
      },
      {
        title: "Tracciamento, pubblicità e cookie",
        paragraphs: [
          "L'app non contiene pubblicità e non imposta cookie.",
          "Utilizza la misurazione del pubblico di Vercel, fornita dal suo hosting, che conta le visite e le pagine viste. Questa misurazione è aggregata e senza cookie: non crea profili, non ti segue da un sito all'altro e non può identificarti.",
        ],
      },
      {
        title: "Servizi di terze parti mostrati nella pagina",
        paragraphs: [
          "La mappa di base è fornita dalla OpenStreetMap Foundation: come per qualsiasi immagine caricata da un altro sito, il tuo indirizzo IP le è visibile. Lo stato giornaliero delle piscine di Tolosa viene letto dall'app gemella Piscines de Toulouse, senza alcun dato su di te.",
        ],
      },
      {
        title: "Modulo di segnalazione (facoltativo)",
        paragraphs: [
          "Il modulo trasmette solo ciò che scrivi: il tipo di segnalazione, la piscina interessata, il tuo messaggio e — se lo desideri — il tuo indirizzo e-mail. Viene inviato via e-mail all'autrice dell'app (tramite il fornitore Resend), al solo scopo di correggere l'app e, se necessario, risponderti. Nessuna mailing list, nessuna condivisione, nessuna rivendita; scrivici per far cancellare un messaggio inviato.",
        ],
      },
      {
        title: "Dati tecnici di hosting",
        paragraphs: [
          "Il sito è ospitato da Vercel. Come ogni server web, l'hosting può registrare dati tecnici standard (indirizzo IP, tipo di browser) al solo scopo di servire la pagina e mantenere il servizio sicuro. Questi log non vengono né consultati né utilizzati dall'autrice.",
        ],
      },
      {
        title: "I tuoi diritti",
        paragraphs: [
          "Se non hai inviato alcuna segnalazione, non esiste alcun dato su di te. Altrimenti puoi chiedere in qualsiasi momento di accedere, correggere o cancellare ciò che ti riguarda all'indirizzo qui sotto.",
        ],
      },
    ],
    contactTitle: "Contatti",
    changesTitle: "Modifiche",
    changes: "Questa informativa può essere aggiornata. La data dell'ultimo aggiornamento è indicata in cima alla pagina.",
  },
};

const nl: Dict = {
  intlLocale: "nl-NL",
  metaTitle: "Swimmaps — vind een zwembad bij jou in de buurt",
  metaDescription:
    "Openbare zwembaden bij jou in de buurt in Nederland, België, Frankrijk, Duitsland, Engeland, Spanje en Italië: " +
    "baden, openingstijden en prijzen, met kaart en routebeschrijving.",
  subtitle:
    "Vind de openbare zwembaden om je heen: baden, openingstijden en prijzen, voor zover bekend.",

  langAria: "Taal / Language / Lingua",
  navSources: "Bronnen",
  navPrivacy: "Privacy",
  navFeedback: "Fout melden",
  backHome: "Alle zwembaden",
  dataDate: (date) => `Gegevens van ${date}`,
  dataInfoAria: "Hoe de gegevens worden bijgewerkt",
  dataInfo:
    "De datasets (Data ES, Active Places, Bäderleben, OpenStreetMap) worden met een script opnieuw opgebouwd en met de app meegeleverd: de datum is die van de laatste extractie. Voor de zwembaden in Toulouse komt daar de dagelijkse live-status bij.",
  themeNames: { system: "automatisch", light: "licht", dark: "donker" },
  themeSwitch: (current, next) => `Thema: ${current} — overschakelen naar ${next}`,

  iosInstallLead: "Installeer de app: tik op",
  iosInstallTail: "en dan op “Zet op beginscherm”.",
  iosHow: "Hoe?",
  iosHideSteps: "Stappen verbergen",
  iosDismiss: "Deze uitnodiging verbergen",
  iosShare: "Deel",
  iosStep1: "— in Safari, onderaan het scherm op iPhone, rechtsboven op iPad.",
  iosStep2a: "Scrol in de lijst met acties omlaag naar",
  iosStep2b: "“Zet op beginscherm”.",
  iosCopy: "Kopieer",
  iosBookmark: "Voeg bladwijzer toe",
  iosAddHome: "Zet op beginscherm",
  iosCancel: "Annuleer",
  iosAdd: "Voeg toe",
  iosStep3a: "Tik op",
  iosStep3b: "Het pictogram verschijnt op je beginscherm: open de app vanaf daar.",

  offlineBanner:
    "Je bent offline. De getoonde zwembaden komen van de laatste keer laden — de kaart en het zoeken naar adressen werken weer zodra je verbinding hebt.",
  offlineReload: "Opnieuw laden",

  searchPlaceholder: "Adres, plaats, postcode…",
  searchAria: "Zoek een adres",
  locateButton: "📍 In mijn buurt",
  locating: "Locatie bepalen…",
  errNoGeolocation: "Locatiebepaling is niet beschikbaar op dit apparaat.",
  errGeoDenied: "Locatie geweigerd of niet beschikbaar — zoek in plaats daarvan een adres.",
  errSearchDown: "Zoeken naar adressen is momenteel niet beschikbaar.",

  savedAddressesAria: "Opgeslagen adressen",
  saveAddress: "☆ Opslaan",
  removeAddress: (label) => `Adres ${label} verwijderen`,

  poolSearchPlaceholder: "Zoek een zwembad of plaats binnen de straal…",
  poolSearchAria: "Zoek een zwembad of plaats",
  poolSearchClear: "Zoekopdracht wissen",
  searchCount: (n, total) =>
    `${n === 0 ? "Geen zwembad met deze naam" : `${n} zwemba${n > 1 ? "den" : "d"} gevonden`} van de ${total} binnen de straal, los van de filters.`,
  searchNone: (query) => `Geen zwembad gevonden voor “${query}”.`,

  radiusLabel: "Straal",
  radiusAria: "Zoekstraal",
  typeLabel: "Type",
  typeAria: "Type zwembad",
  typeAll: "Alle",
  typeIndoor: "Binnen",
  typeOutdoor: "Buiten",
  openLabel: "Open",
  openAria: "Openingstijden",
  openTitle:
    "“Deze week”: laat bekende seizoenssluitingen weg. “Vandaag”: houdt zwembaden met onbekende tijden. “Nu”: alleen zwembaden met bekende tijden die nu open zijn.",
  openAll: "Alle",
  openWeek: "Deze week",
  openWeekShort: "Week",
  openNow: "Nu",
  openNowShort: "Nu",
  openToday: "Vandaag",
  openTodayShort: "Vandaag",
  favLabel: "Bewaard",
  favAria: "Favorieten",
  favAll: "Alle",
  favOnly: "★ Favorieten",
  favTip:
    "💡 Tik op ☆ naast de naam van een zwembad om het te volgen: het komt bovenaan de lijst te staan, en met het filter ★ Favorieten vind je het terug.",
  favTipOk: "Begrepen",
  lenLabel: "Lengte",
  lenAria: "Lengte van het bad",
  lenAll: "Alle",

  sectionTimeline: "Openingstijden per dag",
  sectionMap: "Waar de zwembaden zijn",
  sectionList: (n) => `De zwembaden (${n})`,

  dayShort: ["ma", "di", "wo", "do", "vr", "za", "zo"],
  todaySuffix: "(vandaag)",
  legendOpenNow: "nu open",
  legendSlot: "openingstijd",
  legendNow: "nu",
  timelineUnknown: (n) =>
    `${n} zwemba${n > 1 ? "den" : "d"} binnen de straal zonder bekende tijden ${n > 1 ? "staan" : "staat"} hier niet.`,
  timelineMore: (n) => `Nog ${n} verder weg — verklein de straal om ze te zien.`,
  timelineSeasonal: "seizoenssluiting",
  timelineClosed: "gesloten",
  timelineHolidayNote:
    "Normale schoolweek; de tijden in de schoolvakanties staan op de pagina van elk zwembad.",
  timelineGoto: (name) => `Ga naar ${name}`,

  loadError: "De lijst met zwembaden kon niet worden geladen. Laad de pagina opnieuw.",
  emptyTitle: "Waar zoek je een zwembad?",
  emptyHint: "Tik op “📍 In mijn buurt” of typ hierboven een adres.",
  referenced: (n) => `${n} openbare zwembaden opgenomen.`,
  loadingPools: "Zwembaden laden…",
  noneInRadius: "Geen zwembad binnen deze straal — probeer een grotere.",
  noneInRadiusNear: (km) => `Geen zwembad binnen deze straal — het dichtstbijzijnde ligt op ${km}.`,
  noneFavorite: "Geen favoriet zwembad binnen deze straal — tik op ☆ bij een zwembad om het toe te voegen.",
  noneFilters: "Geen zwembad binnen deze straal past bij deze filters.",
  countLine: (n, radiusKm, label) =>
    `${n} zwemba${n > 1 ? "den" : "d"} binnen ${radiusKm} km van ${label} (hemelsbreed).`,
  showMore: (n) => `Meer tonen (nog ${n})`,
  mapAria: "Kaart van de zwembaden",
  mapOpenCount: (n) => `${n} zwemba${n > 1 ? "den" : "d"} nu open.`,
  mapHint: "Tik op een markering om de pagina te openen. ★ = bewaard zwembad, felle kleur = nu open.",
  mapPopupDetail: "Details",

  distanceTitle: "Afstand hemelsbreed",
  favAdd: (name) => `${name} toevoegen aan favorieten`,
  favRemove: (name) => `${name} verwijderen uit favorieten`,
  envLabels: { int: "Binnenbad", ext: "Buitenbad", mix: "Binnen- en buitenbad" },
  basinLabels: {
    sportif: "wedstrijdbad",
    ludique: "recreatiebad",
    mixte: "gecombineerd bad",
    toboggan: "glijbaanbad",
    plongeon: "duikbad",
    plongée: "duiktank",
    principal: "hoofdbad",
    apprentissage: "instructiebad",
    lido: "buitenbad",
    pataugeoire: "peuterbad",
    vagues: "golfslagbad",
    spa: "bubbelbad",
    kneipp: "kneippbad",
    naturel: "natuurbad",
  },
  basinFallback: (label) => `${label}-bad`,

  seasonalClosed: "Momenteel gesloten buiten het seizoen",
  badgeOpenNow: "Nu open",
  badgeOpenUntil: (time) => `Open · tot ${time}`,
  badgeOpensAt: (time) => `Gaat open om ${time}`,
  badgeDone: "Gesloten voor vandaag",
  badgeClosedNow: "Nu gesloten",
  badgeClosedToday: "Vandaag gesloten",
  todayLabel: "Vandaag:",
  liveSource: (at) => `Dagstatus gecontroleerd ${at} — piscines-toulouse.fr`,
  toulouseRecommend: "Hele week, sluitingen en prijzen op Piscines de Toulouse",
  schoolTerm: "Schoolperiode",
  schoolHolidays: "Schoolvakanties",
  specialPeriods: "Bijzondere periodes",
  hoursLabel: "Openingstijden:",
  centreHoursNote:
    "Openingstijden van het centrum (bron: officiële website) — de zwemtijden kunnen afwijken.",
  noHours: "Openingstijden onbekend — kijk op de officiële website.",
  priceLabel: "Prijs:",
  paidEntry: "Betaalde toegang",
  freeEntry: "Gratis toegang",
  directions: "Route",
  directionsAria: (name) => `Route naar ${name} (Google Maps)`,
  directionsTitle: "Route — opent Google Maps",
  phoneAria: (name, phone) => `${name} bellen op ${phone}`,
  phoneTitle: (phone) => `Bel de receptie — ${phone}`,
  website: "Website",
  websiteAria: (name) => `Officiële website van ${name} (nieuw tabblad)`,
  websiteTitle: "Officiële website — opent een nieuw tabblad",
  searchWebsite: "Website zoeken",
  searchWebsiteTitle: "Website onbekend — zoek op het web",
  detailLink: "Details",
  detailLinkTitle: "Detailpagina — weektijden en praktische info",

  detailMetaTitle: (name, city) => `${name} in ${city} — openingstijden, baden en bereikbaarheid`,
  detailMetaDescription: (name, city) =>
    `${/bad|baden|zwem|aqua|tropi|lido|piscine|pool/i.test(name) ? name : `Zwembad ${name}`} in ${city}: openingstijden voor zover bekend, baden, prijs, adres en route.`,
  detailSubtitle: (city) => `Openbaar zwembad in ${city} — openingstijden, baden en bereikbaarheid.`,
  detailHoursTitle: "Openingstijden per week",
  detailHoursNote:
    "De tijden komen uit open bronnen (OpenStreetMap, officiële website) — controleer ze voordat je gaat.",
  detailHoursUnknown:
    "De openingstijden staan niet in onze bronnen: kijk op de officiële website of bel de receptie.",
  detailRawHours: "Gepubliceerde tijden (niet geïnterpreteerd)",
  detailInfoTitle: "Praktische info",
  detailAddress: "Adres",
  detailBasins: "Baden",
  detailLengths: "Lengtes",
  detailNearbyTitle: "Andere zwembaden in de buurt",
  detailNearbyAway: (km) => `op ${km}`,
  detailBack: "← Alle zwembaden in mijn buurt",

  fbTitle: "💬 Meld een fout of geef feedback",
  fbIntro:
    "Verkeerde tijden, een gesloten of ontbrekend zwembad, een idee? Laat het ons weten — zo verbeteren we de app en haar open bronnen.",
  fbKinds: {
    hours: "Verkeerde tijden",
    info: "Verkeerde info",
    missing: "Ontbrekend of gesloten zwembad",
    suggestion: "Suggestie",
    other: "Overig",
  },
  fbPool: "Betreffend zwembad (optioneel)",
  fbPoolPlaceholder: "Naam en plaats",
  fbMessage: "Je bericht",
  fbMessagePlaceholder: "Bijv. het zwembad sluit op zaterdag om 19.00 uur, niet om 20.00 uur.",
  fbEmail: "Je e-mailadres",
  fbEmailHint: "(optioneel, voor een antwoord)",
  fbSend: "Versturen",
  fbSending: "Bezig met versturen…",
  fbOrEmail: "of per e-mail",
  fbSent: "✓ Bedankt, je bericht is aangekomen.",
  fbSentHint:
    "Openingstijden kun je ook rechtstreeks in OpenStreetMap aanpassen — daar heeft iedereen iets aan.",
  fbAnother: "Nog een bericht versturen",
  fbErrorDefault: "Versturen is momenteel niet mogelijk.",
  fbErrorMail: "Je kunt het bericht ook per e-mail sturen.",
  fbSubject: "Swimmaps — feedback",

  footerData: "Gegevens:",
  footerLicenceFR: "(open licentie)",
  footerLicenceGB: "(OGL v3-licentie)",
  footerLicenceDE:
    "(© Bundesinstitut für Sportwissenschaft · coördinaten © GeoBasis-DE / BKG 2021)",
  footerOsm: "© OpenStreetMap-bijdragers",
  footerDisclaimer:
    "Openingstijden en prijzen komen uit open bronnen en zijn maar voor een deel " +
    "van de zwembaden bekend — kijk op de officiële website voordat je gaat.",
  footerIndependent:
    "Persoonlijke, onafhankelijke app, niet verbonden aan zwembadexploitanten of overheden.",

  tipTitle: "Trakteer me op een koffie",
  tipDesc:
    "Swimmaps is een persoonlijk, onafhankelijk hobbyproject. Bespaart het je een vergeefse rit, dan kun je me op een koffie trakteren.",
  tipButton: "Trakteer op koffie",
  tipNote: "Met of zonder koffie: de app blijft gratis en voor iedereen hetzelfde.",

  coveredLabel: "Landen:",
  countryNames: {
    fr: "Frankrijk", gb: "Engeland", de: "Duitsland",
    es: "Spanje", it: "Italië", be: "België", nl: "Nederland",
  },

  sources: {
    title: "Gegevensbronnen",
    subtitle: "Waar de zwembaden, tijden en prijzen vandaan komen",
    intro:
      "Swimmaps is een persoonlijke, onafhankelijke app, niet verbonden aan zwembadexploitanten of overheden. De app verzint geen gegevens: alles wat je ziet komt uit de open bronnen hieronder, en ontbrekende informatie wordt als ontbrekend getoond in plaats van geraden. Controleer belangrijke informatie altijd op de officiële website van het zwembad.",
    groups: [
      {
        title: "Frankrijk",
        items: [
          {
            label: "Data ES — nationale inventaris van sportvoorzieningen",
            detail:
              "Ministerie van Sport, open licentie: naam, adres, coördinaten, baden en lengtes. Niet-openbare voorzieningen (scholen, defensie, hotels…) worden weggelaten.",
            url: URLS.dataEs,
          },
          {
            label: "OpenStreetMap",
            detail:
              "ODbL: openingstijden (opening_hours), prijs, website en telefoon, gekoppeld op geografische nabijheid (< 300 m).",
            url: URLS.osm,
          },
          {
            label: "Piscines de Toulouse — dagelijkse live-status",
            detail:
              "De zusterapp leest de officiële pagina's van Toulouse en omgeving; haar status gaat voor die zwembaden voor op de OSM-tijden.",
            url: URLS.toulouse,
          },
        ],
      },
      {
        title: "Engeland",
        items: [
          {
            label: "Active Places (Sport England)",
            detail:
              "OGL v3-licentie: zwembaden die open zijn voor publiek (“Pay and Play” en verenigingen), lengtes en websites. Zelfde OpenStreetMap-verrijking als in Frankrijk.",
            url: URLS.activePlaces,
          },
        ],
      },
      {
        title: "Duitsland",
        items: [
          {
            label: "Bäderleben (Bundesinstitut für Sportwissenschaft)",
            detail:
              "Openbare zwembaden met toegangsprijzen, lengtes, websites en telefoonnummers. © BISp; coördinaten © GeoBasis-DE / BKG 2021.",
            url: URLS.baederleben,
          },
        ],
      },
      {
        title: "Spanje, Italië, België, Nederland",
        items: [
          {
            label: "OpenStreetMap",
            detail:
              "ODbL, enige bron: zwembaden en waterparken met een naam, zonder hotels en campings. Tijden en prijzen zijn er zeldzamer dan elders; de plaats is de dichtstbijzijnde woonkern als het adres ontbreekt.",
            url: URLS.osm,
          },
        ],
      },
      {
        title: "Andere gebruikte diensten",
        items: [
          {
            label: "Officiële websites van zwembaden",
            detail:
              "Openingstijden van het centrum uit hun gestructureerde schema.org-gegevens als OpenStreetMap er geen heeft (op de pagina als zodanig aangegeven).",
            url: URLS.schema,
          },
          {
            label: "Base Adresse Nationale",
            detail: "Adres zoeken in Frankrijk (api-adresse.data.gouv.fr).",
            url: URLS.ban,
          },
          {
            label: "Photon (komoot)",
            detail: "Adres zoeken buiten Frankrijk, op basis van OpenStreetMap-gegevens.",
            url: URLS.photon,
          },
          {
            label: "OpenStreetMap-achtergrondkaart",
            detail: "Kaarttegels geleverd door de OpenStreetMap Foundation.",
            url: URLS.tiles,
          },
        ],
      },
    ],
    howTitle: "Hoe de gegevens worden verzameld",
    how: [
      "Een script bouwt de datasets land voor land opnieuw op en levert ze mee met de app; de datum van de laatste extractie staat bovenaan de startpagina. Niets wordt met de hand aangevuld.",
      "De dekking weerspiegelt de stand van de open data: in Frankrijk zijn de tijden bekend voor ongeveer één op de tien zwembaden en de prijzen voor één op de vijftig. De app toont dan “onbekend” en een link naar de officiële website.",
      "Fouten worden bij de bron verbeterd — in OpenStreetMap voor tijden, prijzen en websites — of via het feedbackformulier van de app.",
    ],
  },
  privacy: {
    title: "Privacybeleid",
    subtitle: "De app “Swimmaps”",
    updated: (date) => `Laatst bijgewerkt: ${date}`,
    intro:
      "Swimmaps is een persoonlijke app, gemaakt door een vrijwilliger, niet verbonden aan zwembadexploitanten of overheden. De app toont openbare zwembaden op basis van open data. Op deze pagina lees je welke gegevens worden verwerkt — kort gezegd: niets wat jou identificeert, behalve wat je ons zelf schrijft.",
    sections: [
      {
        title: "Verzamelde persoonsgegevens",
        paragraphs: [
          "Standaard geen. De app vraagt geen account en verzamelt geen gegevens over jou. Je locatie wordt alleen gebruikt als je op “In mijn buurt” tikt, en die blijft in je browser: hij dient om afstanden te berekenen en wordt nooit naar onze server gestuurd.",
          "Als je een adres typt, wordt de tekst naar adreszoekdiensten gestuurd (Base Adresse Nationale voor Frankrijk, elders Photon/komoot) om er coördinaten van te maken. Verder wordt er niets naar hen verstuurd.",
        ],
      },
      {
        title: "Lokale opslag op je apparaat",
        paragraphs: [
          "Je favorieten (★), opgeslagen adressen, laatste zoekopdracht, gekozen thema en ingeklapte blokken worden bewaard in de lokale opslag van je browser, alleen op je apparaat. Ze worden nooit verstuurd en verdwijnen als je de sitegegevens wist.",
        ],
      },
      {
        title: "Tracking, advertenties en cookies",
        paragraphs: [
          "De app bevat geen advertenties en plaatst geen cookies.",
          "De app gebruikt de bezoekersmeting van Vercel, de hostingprovider, die bezoeken en bekeken pagina's telt. Deze meting is geaggregeerd en zonder cookies: er wordt geen profiel opgebouwd, je wordt niet over websites heen gevolgd en je kunt er niet mee worden geïdentificeerd.",
        ],
      },
      {
        title: "Diensten van derden op de pagina",
        paragraphs: [
          "De achtergrondkaart wordt geleverd door de OpenStreetMap Foundation: zoals bij elke afbeelding die van een andere site wordt geladen, is je IP-adres voor hen zichtbaar. De dagstatus van de zwembaden in Toulouse wordt gelezen uit de zusterapp Piscines de Toulouse, zonder gegevens over jou.",
        ],
      },
      {
        title: "Feedbackformulier (optioneel)",
        paragraphs: [
          "Het formulier verstuurt alleen wat je invult: het soort melding, het betreffende zwembad, je bericht en — als je dat wilt — je e-mailadres. Het wordt per e-mail naar de maker van de app gestuurd (via de dienst Resend), uitsluitend om de app te verbeteren en je zo nodig te antwoorden. Geen mailinglijst, niet gedeeld, niet verkocht; schrijf ons om een verstuurd bericht te laten verwijderen.",
        ],
      },
      {
        title: "Technische hostinggegevens",
        paragraphs: [
          "De site wordt gehost door Vercel. Zoals elke webserver kan de host standaard technische gegevens (IP-adres, type browser) vastleggen, uitsluitend om de pagina te leveren en de dienst te beveiligen. Deze logs worden door de maker niet bekeken of gebruikt.",
        ],
      },
      {
        title: "Je rechten",
        paragraphs: [
          "Als je geen feedback hebt gestuurd, bestaan er geen gegevens over jou. Anders kun je op elk moment via het adres hieronder vragen om inzage, correctie of verwijdering van wat jou betreft.",
        ],
      },
    ],
    contactTitle: "Contact",
    changesTitle: "Wijzigingen",
    changes: "Dit beleid kan worden bijgewerkt. De datum van de laatste wijziging staat bovenaan de pagina.",
  },
};

const es: Dict = {
  intlLocale: "es-ES",
  metaTitle: "Swimmaps — encuentra una piscina cerca de ti",
  metaDescription:
    "Piscinas públicas cerca de ti en Francia, Alemania, Inglaterra, España, Italia, Bélgica y Países Bajos: " +
    "vasos, horarios y precios, con mapa y cómo llegar.",
  subtitle:
    "Encuentra las piscinas públicas a tu alrededor: vasos, horarios y precios cuando se conocen.",

  langAria: "Idioma / Language / Langue",
  navSources: "Fuentes",
  navPrivacy: "Privacidad",
  navFeedback: "Informar de un error",
  backHome: "Todas las piscinas",
  dataDate: (date) => `Datos a ${date}`,
  dataInfoAria: "Cómo se actualizan los datos",
  dataInfo:
    "Los conjuntos de datos (Data ES, Active Places, Bäderleben, OpenStreetMap) se regeneran mediante un script y se incluyen en la app: la fecha es la de la última extracción. Las piscinas de Toulouse reciben además su estado diario en directo.",
  themeNames: { system: "automático", light: "claro", dark: "oscuro" },
  themeSwitch: (current, next) => `Tema: ${current} — cambiar a ${next}`,

  iosInstallLead: "Instala la app: toca",
  iosInstallTail: "y luego «Añadir a pantalla de inicio».",
  iosHow: "¿Cómo?",
  iosHideSteps: "Ocultar los pasos",
  iosDismiss: "Ocultar esta invitación",
  iosShare: "Compartir",
  iosStep1: "— en Safari, abajo de la pantalla en iPhone, arriba a la derecha en iPad.",
  iosStep2a: "Desplaza la lista de acciones hasta",
  iosStep2b: "«Añadir a pantalla de inicio».",
  iosCopy: "Copiar",
  iosBookmark: "Añadir marcador",
  iosAddHome: "Añadir a pantalla de inicio",
  iosCancel: "Cancelar",
  iosAdd: "Añadir",
  iosStep3a: "Toca",
  iosStep3b: "El icono aparece en tu pantalla de inicio: abre la app desde ahí.",

  offlineBanner:
    "Estás sin conexión. Las piscinas mostradas son de la última carga — el mapa y la búsqueda de direcciones volverán con la red.",
  offlineReload: "Recargar",

  searchPlaceholder: "Dirección, localidad, código postal…",
  searchAria: "Buscar una dirección",
  locateButton: "📍 Cerca de mí",
  locating: "Localizando…",
  errNoGeolocation: "La geolocalización no está disponible en este dispositivo.",
  errGeoDenied: "Ubicación denegada o no disponible — busca una dirección.",
  errSearchDown: "La búsqueda de direcciones no está disponible ahora mismo.",

  savedAddressesAria: "Direcciones guardadas",
  saveAddress: "☆ Guardar",
  removeAddress: (label) => `Eliminar la dirección ${label}`,

  poolSearchPlaceholder: "Busca una piscina o una localidad dentro del radio…",
  poolSearchAria: "Buscar una piscina o una localidad",
  poolSearchClear: "Borrar la búsqueda",
  searchCount: (n, total) =>
    `${n === 0 ? "Ninguna piscina tiene este nombre" : `${n} piscina${n > 1 ? "s encontradas" : " encontrada"}`} entre las ${total} del radio, sin tener en cuenta los filtros.`,
  searchNone: (query) => `Ninguna piscina coincide con «${query}».`,

  radiusLabel: "Radio",
  radiusAria: "Radio de búsqueda",
  typeLabel: "Tipo",
  typeAria: "Tipo de piscina",
  typeAll: "Todas",
  typeIndoor: "Cubierta",
  typeOutdoor: "Exterior",
  openLabel: "Abierta",
  openAria: "Apertura",
  openTitle:
    "«Esta semana»: descarta los cierres de temporada conocidos. «Hoy»: mantiene las piscinas con horario desconocido. «Ahora»: solo las piscinas con horario conocido y abiertas en este momento.",
  openAll: "Todas",
  openWeek: "Esta semana",
  openWeekShort: "Semana",
  openNow: "Ahora",
  openNowShort: "Ahora",
  openToday: "Hoy",
  openTodayShort: "Hoy",
  favLabel: "Favoritas",
  favAria: "Favoritas",
  favAll: "Todas",
  favOnly: "★ Favoritas",
  favTip:
    "💡 Toca ☆ junto al nombre de una piscina para seguirla: sube al principio de la lista y el botón ★ Favoritas te la vuelve a mostrar.",
  favTipOk: "Entendido",
  lenLabel: "Longitud",
  lenAria: "Longitud del vaso",
  lenAll: "Cualquiera",

  sectionTimeline: "Horarios por día",
  sectionMap: "Dónde están las piscinas",
  sectionList: (n) => `Las piscinas (${n})`,

  dayShort: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  todaySuffix: "(hoy)",
  legendOpenNow: "abierta ahora",
  legendSlot: "franja de apertura",
  legendNow: "ahora",
  timelineUnknown: (n) =>
    `${n} piscina${n > 1 ? "s" : ""} del radio con horario desconocido no se ${n > 1 ? "muestran" : "muestra"} aquí.`,
  timelineMore: (n) => `${n} más lejos — reduce el radio para verlas.`,
  timelineSeasonal: "cierre de temporada",
  timelineClosed: "cerrada",
  timelineHolidayNote:
    "Semana tipo en periodo escolar; los horarios de vacaciones escolares están en la ficha de cada piscina.",
  timelineGoto: (name) => `Ir a ${name}`,

  loadError: "No se ha podido cargar la lista de piscinas. Recarga la página.",
  emptyTitle: "¿Dónde buscas una piscina?",
  emptyHint: "Toca «📍 Cerca de mí» o escribe una dirección arriba.",
  referenced: (n) => `${n} piscinas públicas registradas.`,
  loadingPools: "Cargando piscinas…",
  noneInRadius: "Ninguna piscina en este radio — prueba con uno mayor.",
  noneInRadiusNear: (km) => `Ninguna piscina en este radio — la más cercana está a ${km}.`,
  noneFavorite: "Ninguna piscina favorita en este radio — toca ☆ en una piscina para añadirla.",
  noneFilters: "Ninguna piscina coincide con estos filtros en este radio.",
  countLine: (n, radiusKm, label) =>
    `${n} piscina${n > 1 ? "s" : ""} a menos de ${radiusKm} km de ${label} (en línea recta).`,
  showMore: (n) => `Ver más (quedan ${n})`,
  mapAria: "Mapa de piscinas",
  mapOpenCount: (n) => `${n} piscina${n > 1 ? "s abiertas" : " abierta"} ahora mismo.`,
  mapHint: "Toca un marcador para abrir su ficha. ★ = piscina favorita, color vivo = abierta ahora mismo.",
  mapPopupDetail: "Ficha",

  distanceTitle: "Distancia en línea recta",
  favAdd: (name) => `Añadir ${name} a favoritas`,
  favRemove: (name) => `Quitar ${name} de favoritas`,
  envLabels: { int: "Cubierta", ext: "Al aire libre", mix: "Cubierta + al aire libre" },
  basinLabels: {
    sportif: "vaso deportivo",
    ludique: "vaso recreativo",
    mixte: "vaso mixto",
    toboggan: "vaso de toboganes",
    plongeon: "foso de saltos",
    plongée: "foso de buceo",
    principal: "vaso principal",
    apprentissage: "vaso de enseñanza",
    lido: "vaso al aire libre",
    pataugeoire: "chapoteadero",
    vagues: "piscina de olas",
    spa: "jacuzzi",
    kneipp: "vaso Kneipp",
    naturel: "piscina natural",
  },
  basinFallback: (label) => `vaso ${label}`,

  seasonalClosed: "Cerrada por temporada en este momento",
  badgeOpenNow: "Abierta ahora",
  badgeOpenUntil: (time) => `Abierta · hasta las ${time}`,
  badgeOpensAt: (time) => `Abre a las ${time}`,
  badgeDone: "Cerrada por hoy",
  badgeClosedNow: "Cerrada ahora",
  badgeClosedToday: "Cerrada hoy",
  todayLabel: "Hoy:",
  liveSource: (at) => `Estado del día comprobado ${at} — piscines-toulouse.fr`,
  toulouseRecommend: "Semana completa, cierres y precios en Piscines de Toulouse",
  schoolTerm: "Periodo escolar",
  schoolHolidays: "Vacaciones escolares",
  specialPeriods: "Periodos especiales",
  hoursLabel: "Horario:",
  centreHoursNote:
    "Horario del centro (fuente: web oficial) — los horarios de baño pueden ser distintos.",
  noHours: "Horario desconocido — consulta la web oficial.",
  priceLabel: "Precio:",
  paidEntry: "Entrada de pago",
  freeEntry: "Entrada gratuita",
  directions: "Cómo llegar",
  directionsAria: (name) => `Cómo llegar a ${name} (Google Maps)`,
  directionsTitle: "Cómo llegar — abre Google Maps",
  phoneAria: (name, phone) => `Llamar a ${name} al ${phone}`,
  phoneTitle: (phone) => `Llamar a recepción — ${phone}`,
  website: "Web",
  websiteAria: (name) => `Web oficial de ${name} (nueva pestaña)`,
  websiteTitle: "Web oficial — se abre en una nueva pestaña",
  searchWebsite: "Buscar la web",
  searchWebsiteTitle: "Web desconocida — buscar en internet",
  detailLink: "Ficha",
  detailLinkTitle: "Ficha detallada — horario semanal e información práctica",

  detailMetaTitle: (name, city) => `${name} en ${city} — horarios, vasos y acceso`,
  detailMetaDescription: (name, city) =>
    `${/piscin|natator|acuátic|acuatic|aqua|parque|pool|swim/i.test(name) ? name : `Piscina ${name}`} en ${city}: horarios cuando se conocen, vasos, precio, dirección y cómo llegar.`,
  detailSubtitle: (city) => `Piscina pública en ${city} — horarios, vasos y acceso.`,
  detailHoursTitle: "Horario semanal",
  detailHoursNote:
    "Los horarios proceden de fuentes abiertas (OpenStreetMap, web oficial) — compruébalos antes de ir.",
  detailHoursUnknown:
    "El horario no figura en nuestras fuentes: consulta la web oficial o llama a recepción.",
  detailRawHours: "Horario publicado (sin interpretar)",
  detailInfoTitle: "Información práctica",
  detailAddress: "Dirección",
  detailBasins: "Vasos",
  detailLengths: "Longitudes",
  detailNearbyTitle: "Otras piscinas cercanas",
  detailNearbyAway: (km) => `a ${km}`,
  detailBack: "← Todas las piscinas cerca de mí",

  fbTitle: "💬 Informar de un error o dar tu opinión",
  fbIntro:
    "¿Horario incorrecto, una piscina cerrada o que falta, una idea? Cuéntanoslo — ayuda a mejorar la app y sus fuentes abiertas.",
  fbKinds: {
    hours: "Horario incorrecto",
    info: "Información incorrecta",
    missing: "Piscina que falta o cerrada",
    suggestion: "Sugerencia",
    other: "Otro",
  },
  fbPool: "Piscina en cuestión (opcional)",
  fbPoolPlaceholder: "Nombre y localidad",
  fbMessage: "Tu mensaje",
  fbMessagePlaceholder: "P. ej.: la piscina cierra a las 19:00 los sábados, no a las 20:00.",
  fbEmail: "Tu correo electrónico",
  fbEmailHint: "(opcional, para responderte)",
  fbSend: "Enviar",
  fbSending: "Enviando…",
  fbOrEmail: "o por correo electrónico",
  fbSent: "✓ Gracias, tu mensaje ha llegado.",
  fbSentHint:
    "Los horarios también se pueden corregir directamente en OpenStreetMap — así se beneficia todo el mundo.",
  fbAnother: "Enviar otro mensaje",
  fbErrorDefault: "No es posible enviar el mensaje ahora mismo.",
  fbErrorMail: "También puedes enviar el mensaje por correo electrónico.",
  fbSubject: "Swimmaps — comentarios",

  footerData: "Datos:",
  footerLicenceFR: "(licencia abierta)",
  footerLicenceGB: "(licencia OGL v3)",
  footerLicenceDE:
    "(© Bundesinstitut für Sportwissenschaft · coordenadas © GeoBasis-DE / BKG 2021)",
  footerOsm: "© colaboradores de OpenStreetMap",
  footerDisclaimer:
    "Los horarios y precios proceden de fuentes abiertas y solo están disponibles para una parte de " +
    "las piscinas — consulta la web oficial antes de ir.",
  footerIndependent:
    "App personal e independiente, sin vínculo con los gestores de las piscinas ni con ninguna administración pública.",

  tipTitle: "Invítame a un café",
  tipDesc:
    "Swimmaps es un proyecto personal e independiente. Si te ahorra un viaje en balde, puedes invitarme a un café.",
  tipButton: "Invítame a un café",
  tipNote: "Con café o sin él, la app sigue siendo gratuita e igual para todo el mundo.",

  coveredLabel: "Países cubiertos:",
  countryNames: {
    fr: "Francia", gb: "Inglaterra", de: "Alemania",
    es: "España", it: "Italia", be: "Bélgica", nl: "Países Bajos",
  },

  sources: {
    title: "Fuentes de datos",
    subtitle: "De dónde proceden las piscinas, los horarios y los precios",
    intro:
      "Swimmaps es una app personal e independiente, sin vínculo con los gestores de las piscinas ni con ninguna administración pública. No inventa ningún dato: todo lo que muestra procede de las fuentes abiertas que figuran abajo, y la información que falta se indica como tal en lugar de suponerse. Comprueba siempre la información importante en la web oficial de la piscina.",
    groups: [
      {
        title: "Francia",
        items: [
          {
            label: "Data ES — censo nacional de instalaciones deportivas",
            detail:
              "Ministerio de Deportes, licencia abierta: nombre, dirección, coordenadas, vasos y longitudes. Se descartan las instalaciones de acceso restringido (centros escolares, militares, hoteles…).",
            url: URLS.dataEs,
          },
          {
            label: "OpenStreetMap",
            detail:
              "ODbL: horarios (opening_hours), precio, web y teléfono, asociados por proximidad geográfica (< 300 m).",
            url: URLS.osm,
          },
          {
            label: "Piscines de Toulouse — estado diario en directo",
            detail:
              "La app hermana lee las páginas oficiales de Toulouse y su área metropolitana; su estado prevalece sobre los horarios de OSM para esas piscinas.",
            url: URLS.toulouse,
          },
        ],
      },
      {
        title: "Inglaterra",
        items: [
          {
            label: "Active Places (Sport England)",
            detail:
              "Licencia OGL v3: piscinas abiertas al público (“Pay and Play” y clubes comunitarios), longitudes y webs. Mismo enriquecimiento con OpenStreetMap que en Francia.",
            url: URLS.activePlaces,
          },
        ],
      },
      {
        title: "Alemania",
        items: [
          {
            label: "Bäderleben (Bundesinstitut für Sportwissenschaft)",
            detail:
              "Piscinas públicas con precios de entrada, longitudes, webs y teléfonos. © BISp; coordenadas © GeoBasis-DE / BKG 2021.",
            url: URLS.baederleben,
          },
        ],
      },
      {
        title: "España, Italia, Bélgica, Países Bajos",
        items: [
          {
            label: "OpenStreetMap",
            detail:
              "ODbL, fuente única: piscinas y parques acuáticos con nombre, sin hoteles ni campings. Los horarios y precios son más escasos que en otros países; la localidad es la más cercana cuando falta la dirección.",
            url: URLS.osm,
          },
        ],
      },
      {
        title: "Otros servicios utilizados",
        items: [
          {
            label: "Webs oficiales de las piscinas",
            detail:
              "Horario del centro leído de sus datos estructurados schema.org cuando OpenStreetMap no lo tiene (indicado como tal en la ficha).",
            url: URLS.schema,
          },
          {
            label: "Base Adresse Nationale",
            detail: "Búsqueda de direcciones en Francia (api-adresse.data.gouv.fr).",
            url: URLS.ban,
          },
          {
            label: "Photon (komoot)",
            detail: "Búsqueda de direcciones fuera de Francia, con datos de OpenStreetMap.",
            url: URLS.photon,
          },
          {
            label: "Mapa base de OpenStreetMap",
            detail: "Teselas servidas por la OpenStreetMap Foundation.",
            url: URLS.tiles,
          },
        ],
      },
    ],
    howTitle: "Cómo se recopilan los datos",
    how: [
      "Un script regenera los conjuntos de datos país por país y los incluye en la app; la fecha de la última extracción aparece en la parte superior de la página de inicio. Nada se completa a mano.",
      "La cobertura refleja el estado de los datos abiertos: en Francia se conoce el horario de una piscina de cada diez y el precio de una de cada cincuenta. En esos casos la interfaz muestra «desconocido» y un enlace a la web oficial.",
      "Los errores se corrigen en la fuente — en OpenStreetMap para horarios, precios y webs — o mediante el formulario de comentarios de la app.",
    ],
  },
  privacy: {
    title: "Política de privacidad",
    subtitle: "La app «Swimmaps»",
    updated: (date) => `Última actualización: ${date}`,
    intro:
      "Swimmaps es una app personal y voluntaria, sin vínculo con los gestores de las piscinas ni con ninguna administración pública. Muestra las piscinas públicas a partir de datos abiertos. Esta página explica qué datos trata — en resumen: nada que te identifique, salvo lo que decidas escribirnos.",
    sections: [
      {
        title: "Datos personales recogidos",
        paragraphs: [
          "Ninguno, por defecto. La app no requiere cuenta y no recoge ningún dato sobre ti. Solo accede a tu ubicación si tocas «Cerca de mí», y esa ubicación se queda en tu navegador: sirve para calcular distancias y nunca se envía a nuestro servidor.",
          "Cuando escribes una dirección, el texto se envía a servicios de búsqueda de direcciones (Base Adresse Nationale para Francia, Photon/komoot en el resto) para convertirlo en coordenadas. No se les transmite nada más.",
        ],
      },
      {
        title: "Almacenamiento local en tu dispositivo",
        paragraphs: [
          "Tus favoritas (★), direcciones guardadas, última búsqueda, tema elegido y bloques plegados se guardan en el almacenamiento local de tu navegador, solo en tu dispositivo. Nunca se transmiten y desaparecen si borras los datos del sitio.",
        ],
      },
      {
        title: "Seguimiento, publicidad y cookies",
        paragraphs: [
          "La app no contiene publicidad y no instala cookies.",
          "Utiliza la medición de audiencia de Vercel, proporcionada por su alojamiento, que cuenta las visitas y las páginas vistas. Esta medición es agregada y sin cookies: no crea perfiles, no te sigue de un sitio a otro y no puede identificarte.",
        ],
      },
      {
        title: "Servicios de terceros mostrados en la página",
        paragraphs: [
          "El mapa base lo sirve la OpenStreetMap Foundation: como con cualquier imagen cargada desde otro sitio, tu dirección IP le resulta visible. El estado diario de las piscinas de Toulouse se lee de la app hermana Piscines de Toulouse, sin ningún dato sobre ti.",
        ],
      },
      {
        title: "Formulario de comentarios (opcional)",
        paragraphs: [
          "El formulario solo transmite lo que escribes: el tipo de aviso, la piscina en cuestión, tu mensaje y — si quieres — tu dirección de correo electrónico. Se envía por correo a la autora de la app (a través del proveedor Resend), únicamente para corregir la app y, si procede, responderte. Sin lista de correo, sin cesión, sin reventa; escríbenos para que se elimine un mensaje enviado.",
        ],
      },
      {
        title: "Datos técnicos de alojamiento",
        paragraphs: [
          "El sitio está alojado en Vercel. Como cualquier servidor web, el alojamiento puede registrar datos técnicos estándar (dirección IP, tipo de navegador) únicamente para servir la página y mantener la seguridad del servicio. La autora no consulta ni utiliza estos registros.",
        ],
      },
      {
        title: "Tus derechos",
        paragraphs: [
          "Si no has enviado ningún comentario, no existe ningún dato sobre ti. En caso contrario, puedes solicitar en cualquier momento el acceso, la rectificación o la supresión de lo que te concierne en la dirección indicada abajo.",
        ],
      },
    ],
    contactTitle: "Contacto",
    changesTitle: "Cambios",
    changes: "Esta política puede actualizarse. La fecha de la última actualización aparece en la parte superior de la página.",
  },
};

const DICTS: Record<Locale, Dict> = { fr, en, de, es, it, nl };

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
