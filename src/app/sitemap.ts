import type { MetadataRoute } from "next";
import { serviceAreas } from "@/content/service-areas";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://raptor-roofing.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/services/roofing`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/services/siding`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/services/gutters`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/services/emergency-tarping`, lastModified, changeFrequency: "monthly", priority: 0.9 },
  ];

  const areaRoutes: MetadataRoute.Sitemap = serviceAreas.map((area) => ({
    url: `${BASE_URL}/service-areas/${area.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...areaRoutes];
}
