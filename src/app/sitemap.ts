// src/app/sitemap.ts
// Next.js App Router — served at /sitemap.xml
// Reads NEXT_PUBLIC_SITE_URL as the single source of truth for the base URL.
// Throws at module load time (i.e., during next build) if the env var is unset,
// so Phase 7 deployment cannot silently produce a sitemap with relative URLs.
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;
if (!BASE_URL) {
  throw new Error(
    "[raptor-roofing] NEXT_PUBLIC_SITE_URL is not set — sitemap.ts cannot build absolute URLs. " +
      "Set it in .env.local (development) or Vercel Project Settings > Environment Variables (deploy). " +
      "See .env.local.example."
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services/roofing`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services/siding`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services/gutters`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services/emergency-tarping`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
