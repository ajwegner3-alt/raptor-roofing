import Image from "next/image";
import { Phone } from "lucide-react";
import { siteConfig } from "@/content/site";
import { LeadForm } from "./LeadForm";

// 5-layer visual stack per hero-section-contractor skill:
//  0. Background photo
//  1. Dark gradient + brand-colored glow radials
//  2. SVG noise texture (tactile grain)
//  3. Roof-peak SVG divider (signature brand transition)
//  4. Content grid (headline + CTAs + trust + form)

const OVERLAY_STYLE = {
  backgroundImage: [
    // Directional dark gradient — heavier on left (text side), lighter on right (form side)
    "linear-gradient(to right, rgba(15,30,36,0.78) 0%, rgba(15,30,36,0.58) 50%, rgba(15,30,36,0.38) 100%)",
    // Primary slate-teal glow from lower-left
    "radial-gradient(ellipse at 15% 50%, rgba(46,74,86,0.35) 0%, transparent 55%)",
    // Crimson glow from upper-right
    "radial-gradient(ellipse at 80% 15%, rgba(200,53,42,0.10) 0%, transparent 45%)",
  ].join(","),
};

const NOISE_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
};

export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-primary-950"
      aria-label="Raptor Roofing hero"
    >
      {/* Layer 0: Background photograph */}
      <Image
        src="/images/hero.webp"
        alt="Raptor Roofing crew working on an Omaha home"
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

      {/* Layer 4: Content grid (two-column on lg+, stacked on mobile) */}
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pt-16 pb-28 lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:px-8 lg:pt-20 lg:pb-40">
        {/* Left column: Headline + sub + call CTA + trust signals */}
        <div className="text-center lg:text-left">
          <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            The Family-Owned Roofer{" "}
            <span className="text-accent-500">Omaha</span> Calls Back.
          </h1>

          <p className="mx-auto mt-6 max-w-xl font-body text-lg text-white/90 sm:text-xl lg:mx-0">
            Fifteen years in the neighborhood. Same crew from estimate to final
            walkthrough. No subcontractors, no pressure, no disappearing act
            after the storm.
          </p>

          {/* Primary call-to-action (phone) */}
          <div className="mt-8 flex justify-center lg:justify-start">
            <a
              href={siteConfig.phone.href}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-accent-600 px-8 py-4 font-display text-base font-bold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-accent-700"
              aria-label={`Call Raptor Roofing at ${siteConfig.phone.display}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call {siteConfig.phone.display}
            </a>
          </div>

          {/* Visual trust signals — stacked for clean, equal-weight alignment */}
          <ul className="mt-8 flex flex-col items-center gap-3 lg:items-start">
            {/* Google reviews */}
            <li className="flex items-center gap-3">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="shrink-0"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg
                    key={i}
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="#FBBC05"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </span>
              <span className="font-display text-sm font-semibold text-white">
                {siteConfig.reviews.rating} · {siteConfig.reviews.count} Google
                Reviews{" "}
                <span className="font-normal text-white/50">[Placeholder]</span>
              </span>
            </li>

            {/* BBB Accredited Business — A- rating */}
            <li>
              <svg
                role="img"
                aria-label="BBB Accredited Business, A-minus rating"
                width="158"
                height="40"
                viewBox="0 0 158 40"
                className="shrink-0"
              >
                <rect width="158" height="40" rx="3" fill="#00607B" />
                {/* Torch icon */}
                <g transform="translate(8, 7)" fill="#ffffff">
                  <path d="M10 0 C7 3 5 6 7 10 C5 9 4 5 6 2 C3 5 2 9 4 13 L16 13 C18 9 17 5 14 2 C16 5 15 9 13 10 C15 6 13 3 10 0 Z" />
                  <rect x="7" y="15" width="6" height="10" rx="0.5" />
                  <rect x="5" y="25" width="10" height="1.5" />
                </g>
                {/* BBB wordmark */}
                <text
                  x="34"
                  y="19"
                  fontFamily="Arial, Helvetica, sans-serif"
                  fontSize="14"
                  fontWeight="900"
                  fill="#ffffff"
                  letterSpacing="-0.3"
                >
                  BBB
                </text>
                {/* ACCREDITED BUSINESS */}
                <text
                  x="34"
                  y="31"
                  fontFamily="Arial, Helvetica, sans-serif"
                  fontSize="6"
                  fontWeight="700"
                  fill="#ffffff"
                  letterSpacing="0.5"
                >
                  ACCREDITED BUSINESS
                </text>
                {/* Rating badge */}
                <rect
                  x="118"
                  y="7"
                  width="32"
                  height="26"
                  rx="2"
                  fill="#ffffff"
                />
                <text
                  x="134"
                  y="27"
                  fontFamily="Arial, Helvetica, sans-serif"
                  fontSize="16"
                  fontWeight="900"
                  fill="#00607B"
                  textAnchor="middle"
                >
                  A-
                </text>
              </svg>
            </li>

            {/* License & Insured shield */}
            <li className="flex items-center gap-3">
              <svg
                width="22"
                height="26"
                viewBox="0 0 24 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0 text-white"
              >
                <path d="M12 26s9-4.5 9-12V5l-9-3-9 3v9c0 7.5 9 12 9 12z" />
                <path d="m8 14 3 3 5-6" />
              </svg>
              <span className="font-display text-sm font-semibold text-white">
                Licensed &amp; Insured · NE #
                <span className="font-normal text-white/50">[Placeholder]</span>{" "}
                · Bonded
              </span>
            </li>
          </ul>
        </div>

        {/* Right column: Lead capture form card */}
        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <LeadForm />
        </div>
      </div>

      {/* Layer 3: Roof-peak SVG divider transitioning into TrustStrip (bg-neutral-50) */}
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
