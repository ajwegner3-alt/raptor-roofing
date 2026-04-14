// src/lib/schema.ts
import type {
  HomeAndConstructionBusiness,
  Service as SchemaService,
  FAQPage,
  BreadcrumbList,
  WithContext,
  DayOfWeek,
} from "schema-dts";
import { siteConfig } from "@/content/site";
import type { Service } from "@/content/services";
import type { FAQ } from "@/content/faqs";

// ============================================================
// JSON-LD Server Component
// Usage: <JsonLd data={localBusinessSchema()} />
// ============================================================

interface JsonLdProps {
  data: WithContext<HomeAndConstructionBusiness>
    | WithContext<SchemaService>
    | WithContext<FAQPage>
    | WithContext<BreadcrumbList>;
}

/**
 * Server component that renders JSON-LD structured data.
 * Uses native <script> tag — NOT next/script (which is for executable JS).
 * Includes XSS sanitization per Next.js official docs.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

// ============================================================
// LocalBusiness / HomeAndConstructionBusiness Schema
// Use on: homepage, about page
// ============================================================

export function localBusinessSchema(): WithContext<HomeAndConstructionBusiness> {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone.display,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.2565,   // Omaha center
      longitude: -95.9345,
    },
    openingHoursSpecification: siteConfig.hours
      .filter((h) => !h.closed)
      .map((h) => ({
        "@type": "OpeningHoursSpecification" as const,
        // schema-dts v2: cast day name to DayOfWeek type (accepts "Monday" short form)
        dayOfWeek: h.day as DayOfWeek,
        opens: h.open,
        closes: h.close,
      })),
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    priceRange: "$$",
    foundingDate: String(siteConfig.founding.year),
    slogan: siteConfig.tagline,
    // PLACEHOLDER: add aggregateRating once real reviews are confirmed
    // aggregateRating: {
    //   "@type": "AggregateRating",
    //   ratingValue: siteConfig.reviews.rating,
    //   reviewCount: siteConfig.reviews.count,
    // },
  };
}

// ============================================================
// Service Schema
// Use on: individual service pages
// ============================================================

export function serviceSchema(service: Service): WithContext<SchemaService> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `${siteConfig.url}/services/${service.slug}`,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.phone.display,
    },
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    serviceType: service.title,
  };
}

// ============================================================
// FAQPage Schema
// Use on: any page with an FAQ accordion
// ============================================================

export function faqPageSchema(faqItems: FAQ[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ============================================================
// BreadcrumbList Schema
// Use on: all inner pages (service pages, about, contact)
// ============================================================

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbSchema(
  items: BreadcrumbItem[]
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http")
        ? item.href
        : `${siteConfig.url}${item.href}`,
    })),
  };
}
