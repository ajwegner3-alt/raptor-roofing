// The business schema (HomeAndConstructionBusiness / "Local Business" type) is
// rendered globally by the Footer on every marketing page — do NOT duplicate it here.
// See .planning/phases/05-about-contact/05-CONTEXT.md and 05-RESEARCH.md Pitfall 4.

import type { Metadata } from 'next';
import { Phone, MapPin, Clock } from 'lucide-react';
import { ContactForm } from '@/components/sections/ContactForm';
import { MapFacade } from '@/components/sections/MapFacade';
import { siteConfig } from '@/content/site';
import { serviceAreas } from '@/content/service-areas';
import { buildMetadata } from '@/lib/metadata';
import { breadcrumbSchema, JsonLd } from '@/lib/schema';

// ---------------------------------------------------------------------------
// Metadata — unique title/description distinct from every other page
// Title: 59 chars (under 60 limit). Description: ~150 chars.
// ---------------------------------------------------------------------------
export const metadata: Metadata = buildMetadata({
  path: '/contact',
  title: 'Contact Raptor Roofing — Free Estimate in Omaha',
  description:
    "Talk to Omaha\u2019s family-owned roofer. Call (402) 885-1462 or request a free estimate. Local crews, no subcontractors, no door-knockers.",
  useAbsoluteTitle: true,
});

// ---------------------------------------------------------------------------
// Map embed URL helper — degrades gracefully to city/zip when street is placeholder
// ---------------------------------------------------------------------------
function buildMapEmbedUrl(address: typeof siteConfig.address): string {
  const hasRealStreet =
    !address.street.startsWith('//') &&
    !address.street.toLowerCase().includes('placeholder');
  const q = hasRealStreet
    ? `${address.street}, ${address.city}, ${address.state} ${address.zip}`
    : `${address.city}, ${address.state} ${address.zip}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ContactPage() {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    siteConfig.address.full
  )}`;

  return (
    <>
      {/* BreadcrumbList JSON-LD only — no business schema duplication (owned by Footer) */}
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'Contact', href: '/contact' },
        ])}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Page hero strip — compact, not a full ServiceHero                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-primary-950 py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
            Get a Free Estimate from Raptor Roofing
          </h1>
          <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-white/75">
            Family-owned. Locally crewed. We answer every call within 2 hours
            during business hours.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Main content — two-column: form (left/top) + NAP (right/bottom)    */}
      {/* Mobile: form first (primary conversion path), NAP below            */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="contact-main-heading"
        className="bg-neutral-50 py-16 lg:py-24"
      >
        {/* Visually hidden heading for section labeling */}
        <h2 id="contact-main-heading" className="sr-only">
          Contact Information and Estimate Form
        </h2>

        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">

            {/* ---- LEFT / TOP on mobile: ContactForm ---- */}
            <div>
              <ContactForm />
            </div>

            {/* ---- RIGHT / BOTTOM on mobile: Enriched NAP block ---- */}
            <div className="space-y-10">

              {/* Big tap-to-call */}
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  Call Us Directly
                </p>
                <a
                  href={`tel:${siteConfig.phone.display.replace(/\D/g, '')}`}
                  aria-label={`Call Raptor Roofing at ${siteConfig.phone.display}`}
                  className="mt-3 inline-flex min-h-[56px] items-center gap-3 rounded-md bg-accent-600 px-6 py-4 font-display text-xl font-bold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-accent-700"
                >
                  <Phone className="h-6 w-6 shrink-0" aria-hidden="true" />
                  {siteConfig.phone.display}
                </a>
                <p className="mt-2 font-body text-sm text-neutral-500">
                  We respond within 2 hours during business hours.
                </p>
              </div>

              {/* Address block */}
              <div>
                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary-700"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-500">
                      Office
                    </p>
                    {/* PLACEHOLDER label must remain visible for Phase 8 handoff */}
                    <div className="mt-2">
                      <p className="font-body text-sm text-amber-500">
                        [PLACEHOLDER: confirm street address with Raptor]
                      </p>
                      <address className="mt-1 font-body text-base not-italic text-neutral-800">
                        {siteConfig.address.full}
                      </address>
                    </div>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block font-body text-sm font-semibold text-accent-600 underline-offset-2 hover:underline"
                    >
                      Get directions &rarr;
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours block — intentionally no "Open now" indicator (anti-chaser stance) */}
              <div>
                <div className="flex items-start gap-3">
                  <Clock
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary-700"
                    aria-hidden="true"
                  />
                  <div className="w-full">
                    <p className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-500">
                      Hours
                    </p>
                    <ul className="mt-2 space-y-1">
                      {siteConfig.hours.map((h) => (
                        <li
                          key={h.day}
                          className="flex justify-between gap-4 font-body text-sm text-neutral-700"
                        >
                          <span className="font-medium">{h.day}</span>
                          <span>
                            {h.closed || h.open === ''
                              ? 'Closed'
                              : `${h.open} – ${h.close}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
            {/* end right/NAP column */}

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Map section — facade pattern: static placeholder until user clicks  */}
      {/* Google Maps iframe loads on demand (eliminates ~300 kB Maps API JS  */}
      {/* from initial page load — required for Lighthouse Performance ≥ 90)  */}
      {/* ------------------------------------------------------------------ */}
      <section aria-labelledby="map-heading" className="bg-white">
        <h2 id="map-heading" className="sr-only">
          Raptor Roofing Location Map
        </h2>
        <MapFacade
          embedUrl={buildMapEmbedUrl(siteConfig.address)}
          directionsUrl={directionsUrl}
          locationLabel={`${siteConfig.address.city}, ${siteConfig.address.state} ${siteConfig.address.zip}`}
          height={320}
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Service area pill tags — NOT linked, NOT card grid, NOT county-grouped */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="service-area-heading"
        className="bg-neutral-50 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2
            id="service-area-heading"
            className="font-display text-2xl font-bold uppercase tracking-tight text-primary-900 sm:text-3xl"
          >
            Where We Work
          </h2>
          <p className="mt-3 font-body text-base text-neutral-600">
            Raptor Roofing serves homeowners and property managers across the
            greater Omaha metropolitan area.
          </p>

          {/* Pill tags — all 8 cities, no links */}
          <ul
            className="mt-6 flex flex-wrap gap-2"
            aria-label="Service area cities"
          >
            {serviceAreas.map((area) => (
              <li
                key={area.slug}
                className="rounded-full bg-primary-100 px-4 py-1.5 font-body text-sm font-medium text-primary-900"
              >
                {area.name}
              </li>
            ))}
          </ul>

          <p className="mt-4 font-body text-sm text-neutral-500">
            Plus surrounding Douglas and Sarpy County communities.
          </p>
        </div>
      </section>
    </>
  );
}
