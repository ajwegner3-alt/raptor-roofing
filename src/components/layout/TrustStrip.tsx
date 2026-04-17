import { Star, ShieldCheck, MapPin, BadgeCheck } from "lucide-react"
import Image from "next/image"
import { siteConfig } from "@/content/site"

export function TrustStrip() {
  return (
    <section
      aria-label="Trust and credentials"
      className="border-y border-black/5 bg-neutral-50"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-3 px-4 py-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-accent-500 text-accent-500" aria-hidden="true" />
          <span className="font-display text-sm font-semibold uppercase tracking-wide text-primary-900">
            {siteConfig.reviews.count} Google Reviews
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-primary-600" aria-hidden="true" />
          <span className="font-display text-sm font-semibold uppercase tracking-wide text-primary-900">
            NE License #{siteConfig.license.number}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary-600" aria-hidden="true" />
          <span className="font-display text-sm font-semibold uppercase tracking-wide text-primary-900">
            Bonded &amp; Insured
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary-600" aria-hidden="true" />
          <span className="font-display text-sm font-semibold uppercase tracking-wide text-primary-900">
            Locally Owned in Omaha
          </span>
        </div>
        {/* BBB Accredited Business logo */}
        <div className="flex items-center">
          <Image
            src="/images/bbb-accredited.png"
            alt="BBB Accredited Business"
            width={200}
            height={80}
            className="h-20 w-auto object-contain"
          />
        </div>
      </div>
    </section>
  )
}
