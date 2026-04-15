import Image from "next/image";
import { Phone } from "lucide-react";
import { siteConfig } from "@/content/site";

// About hero — 5-layer visual stack mirroring ServiceHero.tsx:
//  0. Background photo (about-hero.webp — TODO Phase 8: swap with real family/crew photo asset)
//  1. Dark gradient + brand-colored glow radials (constants copied verbatim from ServiceHero)
//  2. SVG noise texture (tactile grain — same as ServiceHero)
//  3. Foreground content — single centered column (NO LeadForm, NO service prop)
//  4. Roof-peak SVG divider — same fill as TrustStrip bg (#f4f6f7)
//
// Intentionally NOT a reuse of ServiceHero:
//  - ServiceHero requires a Service prop and always renders a right-column form/card
//  - About page has no form, no service context, and uses a single-column centered layout
//
// Server Component — no "use client" directive needed; no state, no client hooks.

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

export interface AboutHeroProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function AboutHero({
  eyebrow = "About Raptor Roofing",
  title = "Built on a Family Name. Backed by Our Own Crews.",
  subtitle = "We\u2019re a family-owned roofing company rooted in Omaha. Every roofer on your job site works directly for us\u2014no strangers, no middlemen, no surprises.",
}: AboutHeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden bg-primary-950"
      aria-label="About Raptor Roofing"
    >
      {/* Layer 0: Background photo — Phase 8 must swap /images/about-hero.webp with a real crew/family asset */}
      <Image
        src="/images/about-hero.webp"
        alt="Raptor Roofing crew on a residential roof in Omaha, Nebraska"
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

      {/* Layer 3: Single-column foreground content */}
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-16 pb-28 text-center lg:pt-20 lg:pb-40">

        {/* Eyebrow */}
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-accent-400">
          {eyebrow}
        </p>

        {/* H1 */}
        <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
          {title}
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl font-body text-lg text-white/90 sm:text-xl">
          {subtitle}
        </p>

        {/* Micro-trust line */}
        <p className="mt-3 font-body text-sm text-white/60">
          Family-Owned Since{" "}
          <span className="text-white/80">[PLACEHOLDER: founding year]</span>
          {" "}&middot; No Subcontractors &middot; Locally Owned in Omaha
        </p>

        {/* Single primary CTA — tel: only, no estimate form */}
        <div className="mt-8">
          <a
            href={siteConfig.phone.href}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-accent-600 px-8 py-4 font-display text-base font-bold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-accent-700"
            aria-label={`Call Raptor Roofing at ${siteConfig.phone.display}`}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call {siteConfig.phone.display}
          </a>
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
