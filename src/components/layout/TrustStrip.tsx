import Image from "next/image"
import { siteConfig } from "@/content/site"

export function TrustStrip() {
  return (
    <section
      aria-label="Trust and credentials"
      className="border-t border-black/5 bg-neutral-50 shadow-sm"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-5 px-4 py-4 lg:gap-8 lg:px-8">
        {/* Google Reviews */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5" aria-label={`${siteConfig.reviews.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="h-4 w-4 fill-accent-500" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </span>
          <span className="font-display text-sm font-bold uppercase tracking-wide text-primary-900">
            {siteConfig.reviews.count} Google Reviews
          </span>
        </div>

        <span className="hidden text-primary-300 lg:inline" aria-hidden="true">|</span>

        {/* Licensed & Insured */}
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-bold uppercase tracking-wide text-primary-900">
            NE Licensed · Bonded &amp; Insured
          </span>
        </div>

        <span className="hidden text-primary-300 lg:inline" aria-hidden="true">|</span>

        {/* Locally Owned */}
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-bold uppercase tracking-wide text-primary-900">
            Locally Owned in Omaha
          </span>
        </div>

        <span className="hidden text-primary-300 lg:inline" aria-hidden="true">|</span>

        {/* BBB Accredited Business */}
        <div className="flex items-center">
          <Image
            src="/images/bbb-accredited.png"
            alt="BBB Accredited Business"
            width={140}
            height={33}
            className="h-8 w-auto object-contain"
          />
        </div>
      </div>
    </section>
  )
}
