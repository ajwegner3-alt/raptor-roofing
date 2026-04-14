// src/lib/metadata.ts
import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

interface BuildMetadataParams {
  title: string;
  description: string;
  path?: string;            // e.g. "/services/roofing" — used for canonical
  ogImage?: string;         // path relative to site root e.g. "/og/roofing.jpg"
  noIndex?: boolean;        // set true for thank-you pages, form confirms
  useAbsoluteTitle?: boolean; // set true when title already contains brand name
}

/**
 * buildMetadata — per-page SEO metadata helper.
 *
 * Usage in a page file:
 *
 *   export const metadata = buildMetadata({
 *     title: "Roof Replacement in Omaha | Raptor Roofing",
 *     description: "...",
 *     path: "/services/roofing",
 *     useAbsoluteTitle: true,  // title already has brand name
 *   });
 *
 * Or for a page without brand name in title:
 *
 *   export const metadata = buildMetadata({
 *     title: "Roof Replacement in Omaha",
 *     description: "...",
 *     path: "/services/roofing",
 *     // title.template from root layout appends " | Raptor Roofing"
 *   });
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  ogImage = "/og/default.jpg",
  noIndex = false,
  useAbsoluteTitle = false,
}: BuildMetadataParams): Metadata {
  const siteUrl = siteConfig.url;
  const canonicalUrl = `${siteUrl}${path}`;
  const ogImageUrl = `${siteUrl}${ogImage}`;

  return {
    // Title: absolute overrides template; string uses parent template
    title: useAbsoluteTitle ? { absolute: title } : title,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${title}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },

    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
