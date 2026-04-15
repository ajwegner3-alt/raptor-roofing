import Image from "next/image";
import { Phone } from "lucide-react";
import { siteConfig } from "@/content/site";
import { LeadForm } from "./LeadForm";
import type { Service } from "@/content/services";

// Mirrors the 5-layer visual stack from Hero.tsx:
//  0. Background photo (service-specific heroImagePath)
//  1. Dark gradient + brand-colored glow radials
//  2. SVG noise texture (tactile grain)
//  3. Content grid (H1 + subheadline + micro-trust + dual CTAs + right column)
//  4. Roof-peak SVG divider (same fill as TrustStrip = #f4f6f7)

interface ServiceHeroProps {
  service: Service;
}

const OVERLAY_STYLE = {
  backgroundImage: [
    "linear-gradient(to right, rgba(15,30,36,0.82) 0%, rgba(15,30,36,0.62) 50%, rgba(15,30,36,0.42) 100%)",
    "radial-gradient(ellipse at 15% 50%, rgba(46,74,86,0.35) 0%, transparent 55%)",
    "radial-gradient(ellipse at 80% 15%, rgba(200,53,42,0.10) 0%, transparent 45%)",
  ].join(","),
};

const NOISE_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
};

export function ServiceHero({ service }: ServiceHeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden bg-primary-950"
      aria-label={`${service.shortTitle} service hero`}
    >
      {/* Layer 0: Service-specific background photograph */}
      <Image
        src={service.heroImagePath}
        alt={service.heroImageAlt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />

      {/* Layer 1: Dark gradient + colored glow radials */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={OVERLAY_STYLE}
      />

      {/* Layer 2: Noise texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 mix-blend-overlay"
        style={NOISE_STYLE}
      />

      {/* Layer 3: Content grid */}
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pt-16 pb-28 lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:px-8 lg:pt-20 lg:pb-40">

        {/* Left column: H1 + subheadline + micro-trust + dual CTAs */}
        <div className="text-center lg:text-left">
          <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            {service.headline}
          </h1>

          <p className="mx-auto mt-6 max-w-xl font-body text-lg text-white/90 sm:text-xl lg:mx-0">
            {service.subheadline}
          </p>

          {/* Micro-trust line */}
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-white/60 lg:mx-0">
            Licensed NE &middot; Bonded &amp; Insured &middot; 15 Years Local
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <a
              href={siteConfig.phone.href}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-accent-600 px-8 py-4 font-display text-base font-bold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-accent-700"
              aria-label={`Call Raptor Roofing at ${siteConfig.phone.display}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call Now
            </a>
            <a
              href="#estimate-form"
              className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-white/30 px-8 py-4 font-display text-base font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
            >
              Free Estimate
            </a>
          </div>
        </div>

        {/* Right column: LeadForm (standard) or tap-to-call card (emergency) */}
        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          {service.isEmergency ? (
            /* Emergency tarping: oversized call card instead of form */
            <div className="rounded-lg bg-primary-900/90 p-8 shadow-2xl ring-1 ring-white/10 text-center">
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-accent-400">
                Storm damage? Call now.
              </p>
              <a
                href={siteConfig.phone.href}
                className="mt-4 block font-display text-4xl font-bold text-white lg:text-5xl hover:text-accent-400 transition-colors"
                aria-label={`Call Raptor Roofing emergency line at ${siteConfig.phone.display}`}
              >
                {siteConfig.phone.display}
              </a>
              <p className="mt-4 font-body text-base text-white/80">
                We answer 24/7 &middot; Same-day tarp-ups across Omaha
              </p>
              <a
                href="#estimate-form"
                className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-md border border-white/30 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
              >
                Request a Free Estimate
              </a>
            </div>
          ) : (
            /* Standard services: embedded lead form */
            <LeadForm defaultService={service.slug} />
          )}
        </div>
      </div>

      {/* Layer 4: Roof-peak SVG divider — fill matches TrustStrip bg (#f4f6f7 = neutral-50) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 leading-none"
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="block h-16 w-full lg:h-20"
        >
          <path
            d="M0,80 L600,80 L720,15 L840,80 L1440,80 L1440,80 L0,80 Z"
            fill="#f4f6f7"
          />
        </svg>
      </div>
    </section>
  );
}
