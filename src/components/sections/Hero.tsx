import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { siteConfig } from "@/content/site";

export function Hero() {
  return (
    <section
      className="relative isolate flex min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100dvh-5rem)] items-center overflow-hidden"
      aria-label="Raptor Roofing hero"
    >
      {/* Hero photograph */}
      <Image
        src="/images/hero-placeholder.jpg"
        alt="Raptor Roofing crew working on an Omaha home"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />

      {/* Dark legibility overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[var(--color-overlay)]"
      />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-4xl px-4 py-20 text-center sm:py-24 lg:px-8">
        <h1 className="font-display text-4xl font-bold uppercase leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          The Family-Owned Roofer Omaha Calls Back.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl font-body text-lg text-white/90 sm:text-xl">
          Fifteen years in the neighborhood. Same crew from estimate to final
          walkthrough. No subcontractors, no pressure, no disappearing act after
          the storm.
        </p>

        {/* Micro-trust line */}
        <p className="mt-6 font-display text-xs font-semibold uppercase tracking-widest text-white/80 sm:text-sm">
          Licensed NE #[PLACEHOLDER] &middot;{" "}
          {siteConfig.founding.yearsInBusiness}+ Years in Omaha &middot;{" "}
          {siteConfig.reviews.rating}&#9733; {siteConfig.reviews.count} Reviews
          [PLACEHOLDER]
        </p>

        {/* CTA row */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Crimson click-to-call */}
          <a
            href={siteConfig.phone.href}
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-md bg-accent-600 px-8 py-4 font-display text-base font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-accent-700"
            aria-label={`Call Raptor Roofing at ${siteConfig.phone.display}`}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call {siteConfig.phone.display}
          </a>

          {/* Slate-outline estimate button */}
          <Link
            href="#estimate-form"
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-md border-2 border-white bg-white/10 px-8 py-4 font-display text-base font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-primary-700"
          >
            Request a Free Estimate
          </Link>
        </div>
      </div>
    </section>
  );
}
