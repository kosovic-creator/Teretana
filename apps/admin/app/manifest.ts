import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Puls — Administracija teretane",
    short_name: "Puls",
    description: "Administracija članova, uplata i dolazaka u teretanu",
    lang: "sr-Latn",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#131b16",
    theme_color: "#131b16",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
