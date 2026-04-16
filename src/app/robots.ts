// src/app/robots.ts
// Next.js App Router — served at /robots.txt
// Uses a fallback (not a throw) because robots.txt is low-stakes:
// if NEXT_PUBLIC_SITE_URL is missing, defaulting to the preview URL is
// acceptable. The hard throw-guard in sitemap.ts catches missing env vars first.
import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://raptor-roofing.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
