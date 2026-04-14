import { Star, ShieldCheck, Award, Calendar, BadgeCheck } from "lucide-react"
import { siteConfig } from "@/content/site"

export function TrustStrip() {
  return (
    <section
      aria-label="Trust and credentials"
      className="border-y border-black/5 bg-neutral-50"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 py-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-accent-500 text-accent-500" aria-hidden="true" />
          <span className="font-display text-sm font-semibold uppercase tracking-wide text-primary-900">
            {siteConfig.reviews.rating}&#x2605; &middot; {siteConfig.reviews.count} reviews
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
          <Calendar className="h-5 w-5 text-primary-600" aria-hidden="true" />
          <span className="font-display text-sm font-semibold uppercase tracking-wide text-primary-900">
            {siteConfig.founding.yearsInBusiness} Years in Omaha
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary-600" aria-hidden="true" />
          <span className="font-display text-sm font-semibold uppercase tracking-wide text-primary-900">
            GAF &amp; Owens Corning Certified
          </span>
        </div>
      </div>
    </section>
  )
}
