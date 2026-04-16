import Link from "next/link";
import { Phone } from "lucide-react";
import { siteConfig } from "@/content/site";

interface FinalCTAProps {
  heading?: string;
  subheading?: string;
  variant?: "dark" | "accent";
}

export function FinalCTA({
  heading = "Ready to Get Started?",
  subheading = "Call us or request a free estimate — a real Raptor crew member will follow up within 2 hours.",
  variant = "dark",
}: FinalCTAProps) {
  const isDark = variant === "dark";

  return (
    <section
      aria-label="Call to action"
      className={`py-16 lg:py-20 ${isDark ? "bg-primary-900" : "bg-accent-600"}`}
    >
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
        <h2
          className={`font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl`}
        >
          {heading}
        </h2>
        <p
          className={`mx-auto mt-4 max-w-2xl font-body text-lg ${
            isDark ? "text-white/80" : "text-white/90"
          }`}
        >
          {subheading}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={siteConfig.phone.href}
            className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md px-8 py-4 font-display text-base font-bold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 ${
              isDark
                ? "bg-accent-600 hover:bg-accent-700 focus-visible:ring-offset-primary-900"
                : "bg-white/20 hover:bg-white/30 focus-visible:ring-offset-accent-600 border border-white/40"
            }`}
            aria-label={`Call Raptor Roofing at ${siteConfig.phone.display}`}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call {siteConfig.phone.display}
          </a>
          <Link
            href="/contact"
            className={`inline-flex min-h-[52px] items-center justify-center rounded-md border px-8 py-4 font-display text-base font-semibold uppercase tracking-wide text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 ${
              isDark
                ? "border-white/30 hover:bg-white/10 focus-visible:ring-offset-primary-900"
                : "border-white/50 hover:bg-white/20 focus-visible:ring-offset-accent-600"
            }`}
          >
            Get a Free Estimate
          </Link>
        </div>

        <p
          className={`mt-6 font-body text-sm ${
            isDark ? "text-white/50" : "text-white/70"
          }`}
        >
          Licensed NE #{siteConfig.license.number} &middot; Bonded &amp; Insured
        </p>
      </div>
    </section>
  );
}
