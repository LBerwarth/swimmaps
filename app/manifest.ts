import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "SwimMaps",
    short_name: "SwimMaps",
    description:
      "Les piscines publiques autour de vous — France, Allemagne, Angleterre, Espagne, Portugal, Italie, Suisse, Autriche, Belgique, Pays-Bas. Public swimming pools around you.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdf8fc",
    theme_color: "#6d28d9",
    dir: "ltr",
    categories: ["sports", "health", "lifestyle", "travel"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // « / » redirige vers la langue du navigateur en conservant la requête.
    shortcuts: [
      {
        name: "Piscines ouvertes maintenant · Open now",
        short_name: "Maintenant",
        url: "/?open=now",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Mes piscines favorites · Favourites",
        short_name: "Favoris ★",
        url: "/?fav=1",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Piscines en plein air · Outdoor",
        short_name: "Plein air",
        url: "/?type=outdoor",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Bassins de 50 m · 50 m pools",
        short_name: "50 m",
        url: "/?length=50",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
