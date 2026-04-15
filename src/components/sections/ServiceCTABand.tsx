import { Phone } from "lucide-react";
import { siteConfig } from "@/content/site";

export function ServiceCTABand() {
  return (
    <section
      aria-label="Call to action"
      className="bg-primary-900 py-16 lg:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-accent-400">
          Ready to get started?
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
          We answer the phone. You get a straight answer.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-white/80">
          No automated systems, no call centers. A real Raptor estimator picks up
          and gives you an honest assessment — no obligation.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={siteConfig.phone.href}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-accent-600 px-8 py-4 font-display text-base font-bold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-accent-700"
            aria-label={`Call Raptor Roofing at ${siteConfig.phone.display}`}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call {siteConfig.phone.display}
          </a>
          <a
            href="#estimate-form"
            className="inline-flex min-h-[52px] items-center justify-center rounded-md border border-white/30 px-8 py-4 font-display text-base font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
          >
            Get a Free Estimate
          </a>
        </div>

        <p className="mt-6 font-body text-sm text-white/50">
          Licensed NE #{siteConfig.license.number} &middot; Bonded &amp; Insured
        </p>
      </div>
    </section>
  );
}
